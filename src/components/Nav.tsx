import { useState, useEffect } from "react";

const links = ["Home", "About Us", "The Data", "Our Reach", "Values", "Testimonials"];
const hrefs = ["#home", "#about", "#data", "#reach", "#values", "#testimonials"];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-500">
      <div
        className={`flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium transition-all duration-500 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg shadow-black/10 text-[#1a4a47]"
            : "bg-white/20 backdrop-blur-sm border border-white/30 text-white"
        }`}
      >
        {links.map((link, i) => (
          <a
            key={link}
            href={hrefs[i]}
            className={`px-3 py-1.5 rounded-full transition-all duration-200 hover:bg-white/20 whitespace-nowrap text-xs sm:text-sm ${
              scrolled ? "hover:bg-[#1a4a47]/10 hover:text-[#1a4a47]" : "hover:bg-white/20"
            }`}
          >
            {link}
          </a>
        ))}
      </div>
    </nav>
  );
}
