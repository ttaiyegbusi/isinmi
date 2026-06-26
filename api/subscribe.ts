import { Resend } from "resend";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  if (!apiKey) {
    console.error("Missing RESEND_API_KEY");
    return res.status(500).json({ error: "Email service is not configured yet." });
  }

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.contacts.create({
      email,
      unsubscribed: false,
    });

    if (error) {
      console.error("Resend error", error);
      // Already subscribed -> treat as success.
      if (error.code === "unprocessable_entity" || error.message?.includes("already")) {
        return res.status(200).json({ ok: true, alreadySubscribed: true });
      }
      return res.status(502).json({ error: "Could not subscribe right now. Please try again." });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("subscribe handler error", err);
    return res.status(500).json({ error: "Could not subscribe right now. Please try again." });
  }
}
