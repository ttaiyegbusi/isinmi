import { useState } from "react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
  { label: "Our Values", href: "#values" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Join Us", href: "#join" },
];

const supportLinks = [
  { label: "About Us", href: "#about" },
  { label: "Our Values", href: "#values" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Join Us", href: "#join" },
];

function Social({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="w-7 h-7 rounded-md bg-white text-[#0e3431] flex items-center justify-center hover:bg-[#2ee8d5] transition-colors"
    >
      {children}
    </a>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <footer id="join" className="bg-[#0e3431] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 pt-24 sm:pt-28">
        {/* CTA + email */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div>
            <h2
              className="font-display text-white leading-[1.1] text-[clamp(2rem,4.5vw,3.25rem)]"
              style={{ letterSpacing: "-0.01em" }}
            >
              Join us today!
              <br />
              Be a part of <span className="text-[#2ee8d5]">Ìsinmi.</span>
            </h2>
            <p className="mt-6 text-white/55 text-sm sm:text-base leading-relaxed max-w-md">
              Whether you're a survivor seeking support, an advocate, or someone who simply
              believes this work matters — there's a place for you here.
            </p>
          </div>

          <div className="lg:pt-4">
            {submitted ? (
              <div className="bg-white rounded-full px-7 py-5 flex items-center gap-3 text-[#0e3431] font-medium">
                <span className="w-5 h-5 rounded-full bg-[#0e3431] text-white flex items-center justify-center text-xs">
                  ✓
                </span>
                Thank you — you're on the list.
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-full p-2 flex items-center w-full shadow-lg shadow-black/10"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 min-w-0 bg-transparent px-5 py-3 text-[#0e3431] placeholder:text-gray-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="flex-shrink-0 bg-[#0e3431] hover:bg-[#15403b] text-white rounded-full px-6 sm:px-8 py-3 font-medium whitespace-nowrap transition-colors"
                >
                  Join us !
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Columns */}
        <div className="mt-24 sm:mt-28 grid grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <div className="font-display font-black text-2xl tracking-tight">ÌSINMI</div>
            <p className="mt-4 text-white/50 text-sm leading-relaxed max-w-[200px]">
              Providing rest for survivors of sexual abuse in Nigeria.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <div className="text-white/45 text-sm mb-5">Navigation</div>
            <ul className="space-y-3.5">
              {navLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-white text-base hover:text-[#2ee8d5] transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <div className="text-white/45 text-sm mb-5">Support</div>
            <ul className="space-y-3.5">
              {supportLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-white text-base hover:text-[#2ee8d5] transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <div className="text-white/45 text-sm mb-5">Social Media</div>
            <div className="flex flex-col gap-2.5">
              <Social label="Twitter">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                  <path d="M23 4.6c-.8.36-1.7.6-2.6.72a4.5 4.5 0 0 0 2-2.5 9 9 0 0 1-2.86 1.1A4.5 4.5 0 0 0 11.7 8a12.8 12.8 0 0 1-9.3-4.7 4.5 4.5 0 0 0 1.4 6 4.4 4.4 0 0 1-2-.56v.06a4.5 4.5 0 0 0 3.6 4.4 4.5 4.5 0 0 1-2 .08 4.5 4.5 0 0 0 4.2 3.1A9 9 0 0 1 2 19.5 12.7 12.7 0 0 0 8.9 21.5c8.3 0 12.8-6.9 12.8-12.8v-.6A9 9 0 0 0 23 4.6z" />
                </svg>
              </Social>
              <Social label="Instagram">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
                  <circle cx="12" cy="12" r="3.8" />
                  <circle cx="17" cy="7" r="0.9" fill="currentColor" stroke="none" />
                </svg>
              </Social>
              <Social label="Discord">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                  <path d="M19.3 5.6A16 16 0 0 0 15.3 4.4l-.2.4a14.9 14.9 0 0 1 3.5 1.1 12.6 12.6 0 0 0-10.8 0A14.5 14.5 0 0 1 11.3 4.8l-.3-.4A16 16 0 0 0 7 5.6 16.5 16.5 0 0 0 4 16.6a16 16 0 0 0 4.9 2.5l.6-1a10.5 10.5 0 0 1-1.7-.8l.4-.3a11.3 11.3 0 0 0 9.6 0l.4.3a10.5 10.5 0 0 1-1.7.8l.6 1a16 16 0 0 0 4.9-2.5 16.4 16.4 0 0 0-2.7-11zM9.5 14.3c-.9 0-1.7-.85-1.7-1.9s.8-1.9 1.7-1.9 1.7.85 1.7 1.9-.8 1.9-1.7 1.9zm5 0c-.9 0-1.7-.85-1.7-1.9s.8-1.9 1.7-1.9 1.7.85 1.7 1.9-.8 1.9-1.7 1.9z" />
                </svg>
              </Social>
              <Social label="Facebook">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                  <path d="M13.5 21v-8h2.6l.4-3h-3V8.1c0-.87.24-1.46 1.5-1.46H16.5V4.06A21 21 0 0 0 14.3 4c-2.2 0-3.7 1.34-3.7 3.8V10H8v3h2.6v8z" />
                </svg>
              </Social>
            </div>
          </div>
        </div>

        {/* Legal */}
        <div className="mt-20 flex flex-wrap items-center justify-between gap-4 text-white/35 text-xs">
          <p>© {new Date().getFullYear()} Ìsinmi. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white/70 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white/70 transition-colors">Terms of Use</a>
          </div>
        </div>
      </div>

      {/* Giant wordmark, bleeding off the bottom edge */}
      <div className="overflow-hidden mt-10">
        <div
          className="font-display font-black text-center text-white leading-none select-none pointer-events-none"
          style={{
            fontSize: "clamp(5rem, 27vw, 26rem)",
            letterSpacing: "-0.02em",
            marginBottom: "-0.14em",
          }}
        >
          ÌSINMI
        </div>
      </div>
    </footer>
  );
}
