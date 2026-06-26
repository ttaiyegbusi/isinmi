import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";

const links = ["Home", "About Us", "The Data", "Our Reach", "Values", "Testimonials"];
const hrefs = ["#home", "#about", "#data", "#reach", "#values", "#testimonials"];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState(0);
  const [canHover, setCanHover] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useLayoutEffect(() => {
    const measure = () => {
      if (contentRef.current) {
        setContentWidth(Math.ceil(contentRef.current.scrollWidth) + 12);
      }
    };
    measure();
    document.fonts?.ready?.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onOutsideClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", onOutsideClick);
    return () => document.removeEventListener("click", onOutsideClick);
  }, [open]);

  return (
    <nav
      ref={navRef}
      className="fixed top-5 right-5 z-50"
      onMouseEnter={canHover ? () => setOpen(true) : undefined}
      onMouseLeave={canHover ? () => setOpen(false) : undefined}
    >
      <div
        className={`flex items-center rounded-full text-sm font-medium overflow-hidden p-[6px] transition-colors duration-300 ${
          scrolled
            ? "bg-white shadow-lg shadow-black/10 text-[#1a4a47]"
            : "bg-white/95 backdrop-blur-md shadow-lg shadow-black/10 text-[#1a4a47]"
        }`}
      >
        {/* Desktop: links expand horizontally to the LEFT of the MENU button */}
        <motion.div
          initial={false}
          animate={{
            width: open ? contentWidth : 0,
            opacity: open ? 1 : 0,
          }}
          transition={{
            width: { duration: open ? 0.5 : 0.35, ease: [0.32, 0.72, 0, 1] },
            opacity: { duration: open ? 0.35 : 0.2, ease: "easeInOut" },
          }}
          style={{ overflow: "hidden" }}
          className="hidden sm:flex items-center"
        >
          <div ref={contentRef} className="flex items-center">
            {links.map((link, i) => (
              <a
                key={link}
                href={hrefs[i]}
                onClick={() => setOpen(false)}
                className="nav-link px-3 py-2 whitespace-nowrap text-xs sm:text-sm transition-colors duration-200 hover:text-[#1a4a47]"
              >
                {link}
              </a>
            ))}
          </div>
        </motion.div>

        <button
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
          className="flex-shrink-0 h-9 pl-3 pr-2 rounded-full flex items-center gap-2 text-xs font-semibold tracking-[0.15em] uppercase"
        >
          Menu
          <Menu size={16} strokeWidth={2} />
        </button>
      </div>

      {/* Mobile: links drop down vertically below the pill */}
      <motion.div
        initial={false}
        animate={{
          opacity: open ? 1 : 0,
          y: open ? 0 : -8,
          pointerEvents: open ? "auto" : "none",
        }}
        transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
        className="sm:hidden absolute right-0 top-[calc(100%+10px)] origin-top-right"
      >
        <div className="flex flex-col bg-white rounded-2xl shadow-xl shadow-black/15 p-2 min-w-[200px]">
          {links.map((link, i) => (
            <a
              key={link}
              href={hrefs[i]}
              onClick={() => setOpen(false)}
              className="px-4 py-3 rounded-xl text-sm font-medium text-[#1a4a47] hover:bg-[#1a4a47]/10 transition-colors duration-200"
            >
              {link}
            </a>
          ))}
        </div>
      </motion.div>
    </nav>
  );
}
