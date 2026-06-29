import { useEffect, useRef } from "react";
import { Renderer, Triangle, Program, Mesh, Texture } from "ogl";

const MAX_RIPPLES = 18;

const vertex = `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragment = `
  precision highp float;
  uniform sampler2D tMap;
  uniform sampler2D tText;
  uniform vec2 uResolution;
  uniform float uVideoAspect;
  uniform float uTime;
  uniform float uTextAlpha;
  uniform vec3 uRipples[${MAX_RIPPLES}];
  varying vec2 vUv;

  const vec3 TINT = vec3(0.0706, 0.1804, 0.1725); // #122e2c
  const float TINT_A = 0.55;

  void main() {
    float screenAspect = uResolution.x / uResolution.y;
    vec2 ratio = vec2(
      min(screenAspect / uVideoAspect, 1.0),
      min(uVideoAspect / screenAspect, 1.0)
    );
    vec2 coverUv = vec2(
      vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );

    vec2 pixel = vUv * uResolution;
    vec2 displacement = vec2(0.0);

    for (int i = 0; i < ${MAX_RIPPLES}; i++) {
      vec3 r = uRipples[i];
      if (r.z <= 0.0) continue;
      float age = uTime - r.z;
      if (age < 0.0 || age > 1.9) continue;

      vec2 diff = pixel - r.xy;
      float dist = max(length(diff), 0.5);
      vec2 dir = diff / dist;

      float speed = 340.0;
      float ringRadius = age * speed;
      float band = exp(-pow((dist - ringRadius) / 45.0, 2.0));
      float decay = exp(-age * 1.7);
      float amp = 16.0 * band * decay;

      displacement += dir * amp;
    }

    vec2 disp = displacement / uResolution;

    // video (cover-fit) with ripple displacement
    vec3 col = texture2D(tMap, coverUv + disp).rgb;

    // teal tint
    col = mix(col, TINT, TINT_A);

    // gradient vignette (top + bottom darkening)
    float top = (1.0 - smoothstep(0.0, 0.45, vUv.y)) * 0.20;
    float bot = smoothstep(0.55, 1.0, vUv.y) * 0.40;
    col = mix(col, vec3(0.0), top + bot);

    // wordmark + headline, displaced by the same ripple field, composited on top
    vec4 textTex = texture2D(tText, vUv + disp);
    col = mix(col, vec3(1.0), textTex.a * uTextAlpha);

    gl_FragColor = vec4(col, 1.0);
  }
`;

type Props = {
  src: string;
  poster?: string;
  textRefs?: React.RefObject<HTMLElement | null>[];
  textVisible?: boolean;
};

export default function RippleVideo({ src, poster, textRefs, textVisible }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const textVisibleRef = useRef(!!textVisible);
  const textRefsRef = useRef(textRefs);
  textRefsRef.current = textRefs;

  useEffect(() => {
    textVisibleRef.current = !!textVisible;
  }, [textVisible]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!container || !canvas || !video) return;

    const renderer = new Renderer({ canvas, alpha: false, antialias: true, dpr: Math.min(window.devicePixelRatio, 2) });
    const gl = renderer.gl;

    const texture = new Texture(gl, {
      generateMipmaps: false,
      minFilter: gl.LINEAR,
      magFilter: gl.LINEAR,
    });

    // Offscreen canvas that mirrors the hero text for compositing into the scene.
    const textCanvas = document.createElement("canvas");
    const textCtx = textCanvas.getContext("2d")!;
    const textTexture = new Texture(gl, {
      generateMipmaps: false,
      minFilter: gl.LINEAR,
      magFilter: gl.LINEAR,
      image: textCanvas,
    });

    const drawText = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      const dpr = Math.min(window.devicePixelRatio, 2);
      textCanvas.width = Math.max(1, Math.floor(w * dpr));
      textCanvas.height = Math.max(1, Math.floor(h * dpr));
      textCtx.setTransform(1, 0, 0, 1, 0, 0);
      textCtx.clearRect(0, 0, textCanvas.width, textCanvas.height);
      textCtx.scale(dpr, dpr);

      const cRect = container.getBoundingClientRect();
      const refs = textRefsRef.current || [];
      for (const ref of refs) {
        const el = ref.current;
        if (!el || !w || !h) continue;
        const cs = getComputedStyle(el);
        const eRect = el.getBoundingClientRect();

        let raw = el.innerText || el.textContent || "";
        if (cs.textTransform === "uppercase") raw = raw.toUpperCase();
        const lines = raw.split("\n").map((s) => s.trim()).filter(Boolean);
        if (!lines.length) continue;

        const align =
          cs.textAlign === "center" ? "center" : cs.textAlign === "right" ? "right" : "left";
        textCtx.fillStyle = "#ffffff";
        textCtx.textBaseline = "middle";
        textCtx.textAlign = align as CanvasTextAlign;
        textCtx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        try {
          (textCtx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing =
            cs.letterSpacing;
        } catch {
          /* letterSpacing not supported - ignore */
        }

        const left = eRect.left - cRect.left;
        const topY = eRect.top - cRect.top;
        const x = align === "center" ? left + eRect.width / 2 : align === "right" ? left + eRect.width : left;
        const lineH = eRect.height / lines.length;
        lines.forEach((line, i) => {
          textCtx.fillText(line, x, topY + lineH * (i + 0.5));
        });
      }

      textTexture.image = textCanvas;
      textTexture.needsUpdate = true;
    };

    const ripples: number[] = new Array(MAX_RIPPLES * 3).fill(0);
    let rippleIndex = 0;

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        tMap: { value: texture },
        tText: { value: textTexture },
        uResolution: { value: [1, 1] },
        uVideoAspect: { value: 16 / 9 },
        uTime: { value: 0 },
        uTextAlpha: { value: 0 },
        uRipples: { value: ripples },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      program.uniforms.uResolution.value = [w, h];
      drawText();
    };
    resize();
    window.addEventListener("resize", resize);

    // redraw the text once webfonts are ready and after layout settles
    if (document.fonts?.ready) document.fonts.ready.then(drawText);
    const t1 = window.setTimeout(drawText, 400);
    const t2 = window.setTimeout(drawText, 1200);

    const setAspect = () => {
      if (video.videoWidth && video.videoHeight) {
        program.uniforms.uVideoAspect.value = video.videoWidth / video.videoHeight;
      }
    };
    video.addEventListener("loadedmetadata", setAspect);
    setAspect();

    video.play().catch(() => {});
    const tryPlay = () => video.play().catch(() => {});
    video.addEventListener("canplay", tryPlay);

    let lastPush = 0;
    let lastX = -1;
    let lastY = -1;

    const pushRipple = (x: number, y: number) => {
      const now = performance.now() / 1000;
      if (now - lastPush > 0.02) {
        ripples[rippleIndex * 3 + 0] = x;
        ripples[rippleIndex * 3 + 1] = y;
        ripples[rippleIndex * 3 + 2] = now;
        rippleIndex = (rippleIndex + 1) % MAX_RIPPLES;
        lastPush = now;
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = rect.height - (e.clientY - rect.top);

      const dx = x - lastX;
      const dy = y - lastY;
      const moved = lastX < 0 || Math.hypot(dx, dy) > 2;

      if (moved) {
        pushRipple(x, y);
        lastX = x;
        lastY = y;
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = rect.height - (e.clientY - rect.top);
      pushRipple(x, y);
    };

    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerdown", onPointerDown);

    let raf = 0;
    const startTime = performance.now();
    const loop = () => {
      texture.image = video;
      texture.needsUpdate = true;
      program.uniforms.uTime.value = (performance.now() - startTime) / 1000;

      // ease the text alpha toward its target for a soft reveal
      const target = textVisibleRef.current ? 1 : 0;
      const cur = program.uniforms.uTextAlpha.value as number;
      program.uniforms.uTextAlpha.value = cur + (target - cur) * 0.05;

      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      video.removeEventListener("loadedmetadata", setAspect);
      video.removeEventListener("canplay", tryPlay);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
        src={src}
        poster={poster}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
