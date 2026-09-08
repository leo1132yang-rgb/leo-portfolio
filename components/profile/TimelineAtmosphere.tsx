"use client";

import { useEffect, useRef, type RefObject } from "react";
import { advanceCloud, breathAt, clamp, CLOUD_CYCLE_SECONDS, createCloud, type CloudParticle } from "./particleCloud";
import styles from "./TimelineArchive.module.css";

type Ink = { left: number; right: number; top: number; bottom: number };
// Warm particle cloud; keep the reading surface transparent.
const CLOUD_LIGHT = .76;

export function TimelineAtmosphere(_props: { currentStage: RefObject<HTMLLIElement | null> }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current, layer = canvas?.parentElement;
    if (!canvas || !layer) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    const main = layer.parentElement?.querySelector("main");
    const intro = main?.querySelector<HTMLElement>('[aria-labelledby="profile-title"]');
    if (!main || !intro) return;
    const halo = document.createElement("canvas");
    halo.width = halo.height = 64;
    const haloCtx = halo.getContext("2d");
    if (!haloCtx) return;
    const glow = haloCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
    glow.addColorStop(0, "rgba(249,235,208,.9)");
    glow.addColorStop(.22, "rgba(234,213,178,.3)");
    glow.addColorStop(.6, "rgba(215,190,147,.055)");
    glow.addColorStop(1, "rgba(215,190,147,0)");
    haloCtx.fillStyle = glow; haloCtx.fillRect(0, 0, 64, 64);
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const small = window.matchMedia("(max-width: 767px)");
    let points: CloudParticle[] = [], ink: Ink[] = [], readingAreas: Ink[] = [];
    let width = 0, height = 0, centerX = 0, centerY = 0, spread = 0;
    let frame = 0, last = 0, elapsed = 0, disposed = false;
    let needsResize = true, needsLayout = true;
    let quality = 1, measuredFrames = 0, measuredTime = 0, drawTime = 0, slowWindows = 0;
    const resize = () => {
      const box = layer.getBoundingClientRect();
      width = Math.max(1, box.width); height = Math.max(1, box.height);
      const ratio = Math.min(window.devicePixelRatio || 1, small.matches ? 1 : 1.5);
      canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = small.matches ? clamp(Math.round(width * .86), 200, 450) : clamp(Math.round(width * .98), 800, 1600);
      points = createCloud(Math.max(small.matches ? 200 : 600, Math.round(count * quality)));
      layer.dataset.particles = String(points.length);
      layer.dataset.reduced = String(motion.matches);
      needsResize = false; needsLayout = true;
    };
    const measure = () => {
      const box = intro.getBoundingClientRect();
      // Bias the same cloud toward the open margin instead of the centre of the articles.
      centerX = small.matches ? width * .22 : box.left + box.width * .18;
      // Keep the cloud in the viewport throughout the archive; scrolling only refreshes text masks.
      centerY = height * (small.matches ? .42 : .38);
      spread = small.matches ? width * .65 : Math.min(410, box.width * .36);
      ink = [];
      readingAreas = [];
      main.querySelectorAll("article, #current-focus, [aria-labelledby='capabilities-title']").forEach(e => {
        const r = e.getBoundingClientRect();
        if (r.bottom >= 0 && r.top <= height) readingAreas.push({ left: r.left, right: r.right, top: r.top, bottom: r.bottom });
      });
      main.querySelectorAll("h1,h2,h3,p,ul[aria-label]").forEach(e => {
        const range = document.createRange(); range.selectNodeContents(e);
        for (const rect of Array.from(range.getClientRects())) {
          if (rect.bottom < 0 || rect.top > height) continue;
          ink.push({ left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom });
        }
      });
      needsLayout = false;
    };
    const readability = (x: number, y: number) => {
      let factor = 1;
      for (const r of readingAreas) {
        const d = Math.max(r.left - x, x - r.right, r.top - y, y - r.bottom, 0);
        if (d < 48) factor = Math.min(factor, .2 + d / 48 * .8);
      }
      for (const r of ink) {
        const d = Math.max(r.left - x, x - r.right, r.top - y, y - r.bottom, 0);
        if (d < 18) factor = Math.min(factor, .38 + d / 18 * .62);
      }
      return factor;
    };
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of points) {
        const perspective = .84 + p.depth * .23;
        const x = centerX + p.x * spread * perspective, y = centerY + p.y * spread * perspective;
        if (x < -12 || x > width + 12 || y < -12 || y > height + 12) continue;
        const alpha = p.alpha * CLOUD_LIGHT * readability(x, y), size = p.size * (.8 + p.depth * .2);
        if (p.glow) {
          const radius = size * 5.5;
          ctx.globalAlpha = alpha * .54;
          ctx.drawImage(halo, x - radius, y - radius, radius * 2, radius * 2);
        }
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.depth > .82 ? "#f5e9d1" : "#d9c9ab";
        ctx.beginPath(); ctx.arc(x, y, size, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
    };
    const render = (now: number) => {
      frame = 0;
      if (disposed || document.hidden) return;
      if (needsResize) resize();
      if (needsLayout) measure();
      const interval = 1000 / (small.matches ? 30 : 60), gap = last ? now - last : interval;
      if (!last || gap >= interval - 1 || motion.matches) {
        const start = performance.now(), dt = Math.min(gap / 1000, .05);
        if (!motion.matches) {
          elapsed += dt;
          const steps = Math.ceil(dt / (1 / 60));
          for (let i = 0; i < steps; i++) advanceCloud(points, elapsed - dt + dt * (i + 1) / steps, dt / steps);
        }
        draw();
        drawTime += performance.now() - start; measuredFrames++; measuredTime += gap; last = now;
        if (measuredTime >= 1000) {
          const cost = drawTime / measuredFrames;
          layer.dataset.fps = (measuredFrames * 1000 / measuredTime).toFixed(1);
          layer.dataset.frameMs = cost.toFixed(2);
          layer.dataset.breath = breathAt(elapsed).toFixed(3);
          layer.dataset.time = elapsed.toFixed(2);
          slowWindows = cost > (small.matches ? 16 : 11) ? slowWindows + 1 : 0;
          if (slowWindows >= 3 && points.length > (small.matches ? 200 : 600)) {
            quality *= .84;
            points.length = Math.max(small.matches ? 200 : 600, Math.round(points.length * .84));
            layer.dataset.particles = String(points.length); slowWindows = 0;
          }
          measuredFrames = measuredTime = drawTime = 0;
        }
      }
      layer.dataset.running = String(!motion.matches);
      if (!motion.matches) frame = requestAnimationFrame(render);
    };
    const wake = () => { if (!disposed && !document.hidden && !frame) frame = requestAnimationFrame(render); };
    const stop = () => {
      cancelAnimationFrame(frame); frame = 0; last = 0;
      measuredFrames = measuredTime = drawTime = 0; layer.dataset.running = "false";
    };
    const onResize = () => { needsResize = true; wake(); };
    const onScroll = () => { needsLayout = true; wake(); };
    const onVisibility = () => { if (document.hidden) stop(); else { needsLayout = true; wake(); } };
    const onMotion = () => { stop(); elapsed = 0; needsResize = true; wake(); };
    // Language changes can move individual lines without changing the section height.
    const language = new MutationObserver(onScroll);
    if (layer.parentElement) language.observe(layer.parentElement, { attributes: true, attributeFilter: ["data-language"] });
    const bounds = new ResizeObserver(onResize); bounds.observe(layer); bounds.observe(intro);
    const contents = new ResizeObserver(onScroll); contents.observe(main);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    motion.addEventListener("change", onMotion); small.addEventListener("change", onResize);
    wake();
    return () => {
      disposed = true; stop();
      window.removeEventListener("resize", onResize); window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      motion.removeEventListener("change", onMotion); small.removeEventListener("change", onResize);
      bounds.disconnect(); contents.disconnect(); language.disconnect(); points.length = 0; ink.length = 0; readingAreas.length = 0;
      canvas.width = canvas.height = halo.width = halo.height = 0;
    };
  }, []);
  return <div className={styles.atmosphere} aria-hidden="true" data-profile-background="breathing-cloud-v3" data-cycle-seconds={CLOUD_CYCLE_SECONDS}>
    <canvas ref={ref} className={styles.particleCloud} />
  </div>;
}
