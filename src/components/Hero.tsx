import { useEffect, useRef } from "react";

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(70px) scale(0.92)";
    const t = setTimeout(() => {
      el.style.transition = "opacity 1.4s cubic-bezier(0.16,1,0.3,1), transform 1.4s cubic-bezier(0.16,1,0.3,1)";
      el.style.opacity = "1";
      el.style.transform = "translateY(0) scale(1)";
    }, 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const tryPlay = () => {
      video.play().catch(() => {});
    };
    tryPlay();
    video.addEventListener("loadedmetadata", tryPlay);
    video.addEventListener("canplay", tryPlay);
    return () => {
      video.removeEventListener("loadedmetadata", tryPlay);
      video.removeEventListener("canplay", tryPlay);
    };
  }, []);

  return (
    <section
      id="home"
      className="relative h-screen min-h-[600px] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background video - aerial ocean */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src="/videos/hero-ocean.mp4"
        poster="https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1800&q=85&fit=crop"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />
      {/* Dark teal overlay */}
      <div className="absolute inset-0 bg-[#122e2c]/55" />
      {/* Gradient vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

      {/* Wordmark */}
      <div className="relative z-10 text-center px-4">
        <h1
          ref={titleRef}
          className="font-display text-[clamp(5rem,18vw,16rem)] font-black text-white leading-none select-none"
          style={{ letterSpacing: "-0.01em" }}
        >
          ÌSINMI
        </h1>
        <p className="mt-4 text-white/70 text-sm sm:text-base tracking-[0.25em] uppercase font-light">
          Rest · Healing · Refuge
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/60">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/60 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
