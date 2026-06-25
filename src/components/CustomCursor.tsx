import { useEffect, useRef } from "react";
import { toggleOcean, isOceanOn, playToggleCue } from "../lib/oceanSound";

// Walk up from an element to find the first opaque-ish background color and
// return its perceived luminance (0 = dark, 1 = light).
function bgLuminance(el: Element | null): number {
  let node: Element | null = el;
  while (node && node !== document.documentElement) {
    const bg = getComputedStyle(node).backgroundColor;
    const m = bg.match(/rgba?\(([^)]+)\)/);
    if (m) {
      const parts = m[1].split(",").map((n) => parseFloat(n));
      const [r, g, b, a] = parts;
      if (a === undefined || a > 0.35) {
        return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      }
    }
    node = node.parentElement;
  }
  return 1; // default page background is white -> light
}

export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    document.body.classList.add("custom-cursor-active");

    const ring = ringRef.current;
    const dot = dotRef.current;
    const cta = ctaRef.current;
    if (!ring || !dot || !cta) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let ringX = x;
    let ringY = y;
    let overHero = false;

    const updateCta = () => {
      cta.textContent = isOceanOn() ? "Click to mute" : "Click to activate sound";
    };

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };

    const onDown = () => ring.classList.add("is-active");
    const onUp = () => ring.classList.remove("is-active");
    const onLeave = () => {
      ring.style.opacity = "0";
      dot.style.opacity = "0";
      cta.style.opacity = "0";
    };
    const onEnter = () => {
      ring.style.opacity = "1";
      dot.style.opacity = "1";
    };

    const onClick = () => {
      if (!overHero) return;
      const on = toggleOcean();
      playToggleCue(on);
      updateCta();
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("click", onClick);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    let raf = 0;
    const animate = () => {
      ringX += (x - ringX) * 0.18;
      ringY += (y - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

      const el = document.elementFromPoint(x, y);

      // adaptive color: green on light backgrounds, white on dark
      const light = bgLuminance(el) > 0.55;
      ring.classList.toggle("on-light", light);
      dot.classList.toggle("on-light", light);

      // hero CTA
      const nowOverHero = !!el?.closest("#home");
      if (nowOverHero !== overHero) {
        overHero = nowOverHero;
        ring.classList.toggle("is-hero", overHero);
        if (overHero) updateCta();
        cta.style.opacity = overHero ? "1" : "0";
      }
      if (overHero) {
        cta.style.transform = `translate3d(${ringX}px, ${ringY + 34}px, 0) translate(-50%, -50%)`;
      }

      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      document.body.classList.remove("custom-cursor-active");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("click", onClick);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
      <div ref={ctaRef} className="cursor-cta" />
    </>
  );
}
