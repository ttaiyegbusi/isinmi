import { useState } from "react";
import { ArrowRight } from "lucide-react";

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
    <footer className="bg-[#122e2c] text-white overflow-hidden">
      {/* CTA block */}
      <div className="px-6 sm:px-12 lg:px-20 pt-20 pb-16 border-b border-white/10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl leading-[1.0] mb-6" style={{ letterSpacing: "-0.02em" }}>
              Join us today!
              <br />
              Be a part of{" "}
              <em className="text-[#3d9e96] not-italic">Isinmi.</em>
            </h2>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm">
              Whether you're a survivor seeking support, an advocate, or someone who simply believes
              this work matters — there's a place for you here.
            </p>
          </div>

          {/* Email form */}
          <div>
            <p className="text-white/60 text-sm mb-4">Stay connected — join our community.</p>
            {submitted ? (
              <div className="flex items-center gap-3 text-[#3d9e96]">
                <div className="w-5 h-5 rounded-full border-2 border-[#3d9e96] flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#3d9e96]" />
                </div>
                <span className="text-sm font-medium">Thank you! You're on the list.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 bg-white/10 border border-white/20 rounded-full px-5 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#3d9e96] transition-colors"
                />
                <button
                  type="submit"
                  className="bg-[#3d9e96] hover:bg-[#2a7a74] text-white rounded-full px-5 py-3 flex items-center gap-2 text-sm font-medium transition-colors duration-200"
                >
                  Join
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Links block */}
      <div className="px-6 sm:px-12 lg:px-20 py-14">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <div className="font-display font-black text-2xl mb-3 tracking-tight">ISINMI</div>
            <p className="text-white/40 text-xs leading-relaxed max-w-[180px]">
              A sanctuary for survivors of sexual abuse across Nigeria and Africa.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <div className="text-white/40 text-xs tracking-widest uppercase mb-4">Navigate</div>
            <ul className="space-y-2.5">
              {["Home", "About Us", "The Data", "Our Reach", "Our Values", "Isinmi"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-white/70 text-sm hover:text-white transition-colors duration-200">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <div className="text-white/40 text-xs tracking-widest uppercase mb-4">Support</div>
            <ul className="space-y-2.5">
              {["Get Help", "Volunteer", "Donate", "Partner With Us", "Contact"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-white/70 text-sm hover:text-white transition-colors duration-200">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <div className="text-white/40 text-xs tracking-widest uppercase mb-4">Follow</div>
            <div className="flex flex-wrap gap-3">
              {["IG", "X", "FB", "LI"].map((label) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:border-[#3d9e96] hover:text-[#3d9e96] transition-all duration-200 text-white/60 text-xs font-bold"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div className="px-6 sm:px-12 lg:px-20 py-6">
          <div className="max-w-6xl mx-auto flex justify-between items-center flex-wrap gap-4">
            <p className="text-white/30 text-xs">
              © {new Date().getFullYear()} Isinmi. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-white/30 text-xs hover:text-white/60 transition-colors">Privacy Policy</a>
              <a href="#" className="text-white/30 text-xs hover:text-white/60 transition-colors">Terms of Use</a>
            </div>
          </div>
        </div>
        {/* Giant wordmark */}
        <div
          className="font-display font-black text-center leading-none select-none pointer-events-none"
          style={{
            fontSize: "clamp(5rem, 22vw, 22rem)",
            color: "rgba(255,255,255,0.04)",
            letterSpacing: "-0.03em",
            lineHeight: 0.85,
          }}
        >
          ISINMI
        </div>
      </div>
    </footer>
  );
}
