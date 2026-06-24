import { useEffect, useRef } from "react";
import { Renderer, Triangle, Program, Mesh, Texture } from "ogl";

const MAX_RIPPLES = 12;

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
  uniform vec2 uResolution;
  uniform float uVideoAspect;
  uniform float uTime;
  uniform vec3 uRipples[${MAX_RIPPLES}];
  varying vec2 vUv;

  void main() {
    float screenAspect = uResolution.x / uResolution.y;
    vec2 ratio = vec2(
      min(screenAspect / uVideoAspect, 1.0),
      min(uVideoAspect / screenAspect, 1.0)
    );
    vec2 uv = vec2(
      vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );

    vec2 pixel = vUv * uResolution;
    vec2 displacement = vec2(0.0);

    for (int i = 0; i < ${MAX_RIPPLES}; i++) {
      vec3 r = uRipples[i];
      if (r.z <= 0.0) continue;
      float age = uTime - r.z;
      if (age < 0.0 || age > 1.6) continue;

      vec2 diff = pixel - r.xy;
      float dist = max(length(diff), 0.5);
      vec2 dir = diff / dist;

      float speed = 340.0;
      float ringRadius = age * speed;
      float band = exp(-pow((dist - ringRadius) / 45.0, 2.0));
      float decay = exp(-age * 2.0);
      float amp = 16.0 * band * decay;

      displacement += dir * amp;
    }

    vec2 distortedUv = uv + displacement / uResolution;
    vec3 color = texture2D(tMap, distortedUv).rgb;
    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function RippleVideo({ src, poster }: { src: string; poster?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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

    const ripples: number[] = new Array(MAX_RIPPLES * 3).fill(0);
    let rippleIndex = 0;

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        tMap: { value: texture },
        uResolution: { value: [1, 1] },
        uVideoAspect: { value: 16 / 9 },
        uTime: { value: 0 },
        uRipples: { value: ripples },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      program.uniforms.uResolution.value = [w, h];
    };
    resize();
    window.addEventListener("resize", resize);

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

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = rect.height - (e.clientY - rect.top);
      const now = performance.now() / 1000;

      const dx = x - lastX;
      const dy = y - lastY;
      const moved = lastX < 0 || Math.hypot(dx, dy) > 6;

      if (moved && now - lastPush > 0.035) {
        ripples[rippleIndex * 3 + 0] = x;
        ripples[rippleIndex * 3 + 1] = y;
        ripples[rippleIndex * 3 + 2] = now;
        rippleIndex = (rippleIndex + 1) % MAX_RIPPLES;
        lastPush = now;
        lastX = x;
        lastY = y;
      }
    };

    container.addEventListener("pointermove", onPointerMove);

    let raf = 0;
    const startTime = performance.now();
    const loop = () => {
      texture.image = video;
      texture.needsUpdate = true;
      program.uniforms.uTime.value = (performance.now() - startTime) / 1000;
      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      video.removeEventListener("loadedmetadata", setAspect);
      video.removeEventListener("canplay", tryPlay);
      container.removeEventListener("pointermove", onPointerMove);
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
