import type { VercelRequest, VercelResponse } from "@vercel/node";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Stores a subscriber's email in the Supabase `subscribers` table.
// Requires env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = (req.body || {}) as { email?: string; website?: string };

  // Honeypot: real users never fill this hidden field; bots do.
  if (body.website) return res.status(200).json({ ok: true });

  const email = (body.email || "").trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    return res.status(500).json({ error: "Email service is not configured yet." });
  }

  try {
    const r = await fetch(`${url}/rest/v1/subscribers`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ email }),
    });

    if (!r.ok) {
      const detail = await r.text();
      // 409 / unique-violation (23505) -> already subscribed, treat as success.
      if (r.status === 409 || detail.includes("23505") || /duplicate|already exists/i.test(detail)) {
        return res.status(200).json({ ok: true, alreadySubscribed: true });
      }
      console.error("Supabase error", r.status, detail);
      return res.status(502).json({ error: "Could not subscribe right now. Please try again." });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("subscribe handler error", err);
    return res.status(500).json({ error: "Could not subscribe right now. Please try again." });
  }
}
