import type { VercelRequest, VercelResponse } from "@vercel/node";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Adds a subscriber's email to a Resend Audience.
// Requires env vars: RESEND_API_KEY, RESEND_AUDIENCE_ID
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

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!apiKey || !audienceId) {
    console.error("Missing RESEND_API_KEY or RESEND_AUDIENCE_ID");
    return res.status(500).json({ error: "Email service is not configured yet." });
  }

  try {
    const r = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, unsubscribed: false }),
    });

    if (!r.ok) {
      const detail = await r.text();
      // Already subscribed -> treat as success.
      if (r.status === 409 || /already|exists/i.test(detail)) {
        return res.status(200).json({ ok: true, alreadySubscribed: true });
      }
      console.error("Resend error", r.status, detail);
      return res.status(502).json({ error: "Could not subscribe right now. Please try again." });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("subscribe handler error", err);
    return res.status(500).json({ error: "Could not subscribe right now. Please try again." });
  }
}
