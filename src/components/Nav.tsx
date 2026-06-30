import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const links = ["Home", "About Us", "The Data", "Our Reach", "Values", "Testimonials"];
const hrefs = ["#home", "#about", "#data", "#reach", "#values", "#testimonials"];
const DONATE_HREF = "#join";

// Three-bar icon that morphs into an X when `open` is true.
function MenuToggleIcon({ open }: { open: boolean }) {
  const bar =
    "absolute left-0 right-0 h-[2px] rounded-full bg-current transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)]";
  return (
    <span className="relative block w-[18px] h-[14px]" aria-hidden="true">
      <span
        className={bar}
        style={{ top: open ? "6px" : "0px", transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
      />
      <span
        className={bar}
        style={{ top: "6px", opacity: open ? 0 : 1, transform: open ? "translateX(6px)" : "translateX(0)" }}
      />
      <span
        className={bar}
        style={{ top: open ? "6px" : "12px", transform: open ? "rotate(-45deg)" : "rotate(0deg)" }}
      />
    </span>
  );
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [canHover, setCanHover] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onOutsideClick);
    return () => document.removeEventListener("click", onOutsideClick);
  }, [open]);

  const pillBg = scrolled
    ? "bg-white shadow-lg shadow-black/10"
    : "bg-white/95 backdrop-blur-md shadow-lg shadow-black/10";

  return (
    <>
      {/* Centered links bar (desktop) */}
      <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50 hidden lg:block">
        <div className={`flex items-center gap-1 rounded-full px-3 py-2 text-[#1a4a47] ${pillBg}`}>
          {links.map((link, i) => (
            <a
              key={link}
              href={hrefs[i]}
              className="nav-link px-3 py-2 text-sm font-medium transition-colors duration-200 hover:text-[#0e3431]"
            >
              {link}
            </a>
          ))}
        </div>
      </nav>

      {/* Top-right cluster: compact menu (below lg) + Donate (all sizes) */}
      <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5">
        {/* Compact icon menu — links won't fit centered on small screens */}
        <div
          ref={menuRef}
          className="relative lg:hidden"
          onMouseEnter={canHover ? () => setOpen(true) : undefined}
          onMouseLeave={canHover ? () => setOpen(false) : undefined}
        >
          <button
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={open}
            onClick={() => setOpen((prev) => !prev)}
            className={`flex items-center justify-center w-12 h-12 rounded-full text-[#1a4a47] ${pillBg}`}
          >
            <MenuToggleIcon open={open} />
          </button>

          <motion.div
            initial={false}
            animate={{
              opacity: open ? 1 : 0,
              y: open ? 0 : -8,
              pointerEvents: open ? "auto" : "none",
            }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
            className="absolute right-0 top-full pt-[10px] origin-top-right"
          >
            <div className="flex flex-col items-start bg-white rounded-2xl shadow-xl shadow-black/15 p-2 min-w-[210px]">
              {links.map((link, i) => (
                <a
                  key={link}
                  href={hrefs[i]}
                  onClick={() => setOpen(false)}
                  className="nav-link self-start px-4 py-2.5 text-sm font-medium text-[#1a4a47] transition-colors duration-200"
                >
                  {link}
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Donate */}
        <a
          href={DONATE_HREF}
          className="inline-flex items-center rounded-full bg-[#0e3431] px-5 sm:px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-white shadow-lg shadow-black/15 transition-colors duration-300 hover:bg-[#15403b]"
        >
          Donate
        </a>
      </div>
    </>
  );
}
