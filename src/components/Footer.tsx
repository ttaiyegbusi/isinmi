import { useState } from "react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
  { label: "Our Values", href: "#values" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Join Us", href: "#join" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
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
            {status === "success" ? (
              <div className="bg-white rounded-full px-7 py-5 flex items-center gap-3 text-[#0e3431] font-medium">
                <span className="w-5 h-5 rounded-full bg-[#0e3431] text-white flex items-center justify-center text-xs">
                  ✓
                </span>
                Thank you — you're on the list.
              </div>
            ) : (
              <>
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
                    disabled={status === "loading"}
                    className="flex-1 min-w-0 bg-transparent px-5 py-3 text-[#0e3431] placeholder:text-gray-400 focus:outline-none"
                  />
                  {/* honeypot - hidden from users */}
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="absolute -left-[9999px] w-px h-px opacity-0"
                    aria-hidden="true"
                  />
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="flex-shrink-0 bg-[#0e3431] hover:bg-[#15403b] text-white rounded-full px-6 sm:px-8 py-3 font-medium whitespace-nowrap transition-colors disabled:opacity-60"
                  >
                    {status === "loading" ? "Joining…" : "Join us !"}
                  </button>
                </form>
                {status === "error" && (
                  <p className="mt-3 ml-2 text-sm text-[#ffb4a8]">{errorMsg}</p>
                )}
              </>
            )}
          </div>
        </div>

        {/* Brand + link columns */}
        <div className="mt-24 sm:mt-28 grid grid-cols-1 lg:grid-cols-[1.1fr_2fr] gap-12 lg:gap-20">
          {/* Brand */}
          <div>
            <div className="font-display font-black text-3xl tracking-tight">ÌSINMI</div>
            <p className="mt-4 text-white/50 text-sm leading-relaxed max-w-[220px]">
              Providing rest for survivors of sexual abuse in Nigeria.
            </p>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10">
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

          {/* Legal */}
          <div>
            <div className="text-white/45 text-sm mb-5">Legal</div>
            <ul className="space-y-3.5">
              <li>
                <a href="#" className="text-white text-base hover:text-[#2ee8d5] transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-white text-base hover:text-[#2ee8d5] transition-colors">
                  Terms of Use
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <div className="text-white/45 text-sm mb-5">Social Media</div>
            <div className="flex flex-wrap gap-3">
              {["IG", "X", "FB", "LI"].map((label) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-white/25 flex items-center justify-center text-white/70 text-xs font-bold hover:border-[#2ee8d5] hover:text-[#2ee8d5] transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Giant wordmark - fills the full width, all letters visible, bleeding
          off the bottom edge */}
      <div className="overflow-hidden text-center mt-8">
        <span
          className="font-display font-black inline-block text-white leading-none select-none pointer-events-none align-bottom"
          style={{
            fontSize: "26vw",
            letterSpacing: "-0.02em",
            whiteSpace: "nowrap",
            marginBottom: "-0.12em",
          }}
        >
          ÌSINMI
        </span>
      </div>
    </footer>
  );
}
