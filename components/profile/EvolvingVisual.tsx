"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "framer-motion";
import styles from "./EvolvingProfile.module.css";

// A fixed population of strokes, not seven independent scenes. Every stroke
// keeps its identity and interpolates its anchors, size and form throughout.
type Form = { x: number; y: number; w: number; h: number; angle: number; round: number };
const TAU = Math.PI * 2;
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => t * t * (3 - 2 * t);
const words = ["OBSERVE", "FRAME", "STORY", "BRAND", "CONTENT", "PEOPLE", "SYSTEM", "AI / NOW"];

function form(state: number, i: number, count: number): Form {
  const a = i / count * TAU;
  const sector = i % 8;
  const row = Math.floor(i / 8);
  const rows = count / 8;
  const ring = (radius: number) => ({ x: Math.cos(a) * radius, y: Math.sin(a) * radius, w: 2, h: 2, angle: a, round: 1 });
  switch (state) {
    case 0: return { ...ring(7 + (i % 3) * 3), w: 1.2, h: 1.2 };
    case 1: return { ...ring(140 + (i % 3) * 22), w: 14 + (i % 3) * 4, h: 2, angle: a + Math.PI / 2 };
    case 2: return { x: (sector - 3.5) * 49, y: (row - (rows - 1) / 2) * 35, w: 36, h: 22, angle: 0, round: 0 };
    case 3: return { x: (sector - 3.5) * 48, y: (row - (rows - 1) / 2) * 25 + Math.sin(sector * .7 + row) * 13, w: 18 + i % 4 * 5, h: 1.5, angle: 0, round: 0 };
    case 4: return { x: (sector - 3.5) * 48, y: (row - (rows - 1) / 2) * 34, w: 39, h: i % 3 === 0 ? 27 : 5, angle: 0, round: 0 };
    case 5: return { x: (sector - 3.5) * 51, y: (row - (rows - 1) / 2) * 39 + (sector % 2) * 11, w: 37, h: 24, angle: 0, round: 0 };
    case 6: {
      const cluster = sector / 8 * TAU;
      return { x: Math.cos(cluster) * 154 + Math.cos(row / rows * TAU) * 28, y: Math.sin(cluster) * 154 + Math.sin(row / rows * TAU) * 28, w: 6, h: 6, angle: 0, round: 1 };
    }
    case 7: return { x: (sector - 3.5) * 52, y: (row - (rows - 1) / 2) * 43, w: i % 8 === 3 ? 9 : 4, h: i % 8 === 3 ? 9 : 4, angle: 0, round: 1 };
    default: {
      const radius = 75 + Math.floor(i / 8) * (135 / rows);
      const theta = sector / 8 * TAU - Math.PI / 2;
      return { x: Math.cos(theta) * radius, y: Math.sin(theta) * radius, w: row === 0 ? 10 : 4, h: row === 0 ? 10 : 4, angle: 0, round: 1 };
    }
  }
}

export function EvolvingVisual({ progress, reduced }: { progress: MotionValue<number>; reduced: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    const media = matchMedia("(max-width: 767px)");
    let mobile = media.matches;
    let count = mobile ? 48 : 80;
    let width = 0, height = 0, scale = 1;
    let displayed = progress.get(), target = displayed;
    let raf = 0, disposed = false, visible = true;
    let pointer = { x: 9999, y: 9999 };
    // All nine formations share the same point topology. Cached on resize only.
    let formations = Array.from({ length: 9 }, (_, state) => Array.from({ length: count }, (_, i) => form(state, i, count)));

    const render = (now: number) => {
      raf = 0;
      if (disposed || !visible || document.hidden) return;
      displayed = reduced ? target : mix(displayed, target, .14);
      const p = Math.min(8, displayed * 8.7);
      const state = Math.min(7, Math.floor(p));
      const t = smooth(Math.min(1, p - state));
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.scale(scale, scale);
      // Quiet drafting field remains present from the first focus to the system.
      ctx.lineWidth = .5;
      ctx.strokeStyle = "rgba(186,178,158,.08)";
      for (let x = -240; x <= 240; x += 40) { ctx.beginPath(); ctx.moveTo(x, -230); ctx.lineTo(x, 230); ctx.stroke(); }
      for (let y = -200; y <= 200; y += 40) { ctx.beginPath(); ctx.moveTo(-250, y); ctx.lineTo(250, y); ctx.stroke(); }

      const points = formations[state].map((a, i) => {
        const b = formations[state + 1][i];
        return { x: mix(a.x, b.x, t), y: mix(a.y, b.y, t), w: mix(a.w, b.w, t), h: mix(a.h, b.h, t), angle: mix(a.angle, b.angle, t), round: mix(a.round, b.round, t) };
      });
      // A single trace gradually gains branches. Connections use the same anchors.
      const connected = Math.max(0, Math.min(1, (p - 4.6) / 2));
      ctx.lineWidth = .65;
      for (let i = 0; i < count; i++) {
        const a = points[i], b = points[(i + 1) % count];
        ctx.strokeStyle = `rgba(193,175,139,${.07 + connected * .12})`;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        if (i + 8 < count && connected > 0) {
          const c = points[i + 8];
          ctx.strokeStyle = `rgba(182,177,163,${connected * .2})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(c.x, c.y); ctx.stroke();
          if (!reduced && i % 8 === 0) {
            const flow = (now * .00007 + i * .043) % 1;
            ctx.fillStyle = `rgba(214,190,140,${connected * .65})`;
            ctx.beginPath(); ctx.arc(mix(a.x, c.x, flow), mix(a.y, c.y, flow), 1.4, 0, TAU); ctx.fill();
          }
        }
        ctx.save(); ctx.translate(a.x, a.y); ctx.rotate(a.angle);
        const nearby = !mobile && !reduced && Math.hypot(pointer.x - a.x, pointer.y - a.y) < 40;
        ctx.strokeStyle = i % 8 === 0 ? "rgba(211,185,133,.8)" : `rgba(222,217,202,${nearby ? .95 : .5})`;
        ctx.fillStyle = i % 8 === 0 ? "#c0a674" : "#bbb8ac";
        ctx.lineWidth = nearby ? 1.3 : .8;
        ctx.beginPath();
        ctx.roundRect(-a.w / 2, -a.h / 2, a.w, a.h, Math.min(a.w, a.h) * a.round / 2);
        if (a.w < 11) ctx.fill(); else ctx.stroke();
        // Characters emerge from the line strokes, not a replacement scene.
        const textAlpha = Math.max(0, 1 - Math.abs(p - 3));
        if (textAlpha > .01 && i % 3 === 0) {
          ctx.fillStyle = `rgba(223,217,199,${textAlpha * .55})`;
          ctx.font = "9px monospace"; ctx.fillText(["Aa", "—", "&", "/", "01"][i % 5], -8, -6);
        }
        ctx.restore();
      }
      // The viewfinder unfolds from the focal point, later persisting as faint
      // crop marks around the complete system instead of being unmounted.
      const extent = 20 + smooth(Math.min(1, p / 2)) * 218;
      ctx.strokeStyle = `rgba(199,183,151,${p < 3 ? .45 : .16})`;
      for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
        ctx.beginPath(); ctx.moveTo(sx * (extent - 18), sy * extent); ctx.lineTo(sx * extent, sy * extent); ctx.lineTo(sx * extent, sy * (extent - 18)); ctx.stroke();
      }
      ctx.font = "9px monospace"; ctx.textAlign = "center";
      const finalAlpha = Math.max(0, Math.min(1, p - 7));
      if (finalAlpha > 0) {
        words.forEach((word, i) => {
          const a = i / 8 * TAU - Math.PI / 2;
          ctx.fillStyle = `rgba(210,198,173,${finalAlpha * .65})`;
          ctx.fillText(word, Math.cos(a) * 246, Math.sin(a) * 246 + 3);
        });
        ctx.fillStyle = `rgba(226,216,193,${finalAlpha * .8})`;
        ctx.fillText("LEO SYSTEM", 0, 3);
      }
      ctx.restore();
      if (!reduced && (Math.abs(target - displayed) > .00005 || connected > 0)) raf = requestAnimationFrame(render);
    };
    const wake = () => { if (!raf && !disposed) raf = requestAnimationFrame(render); };
    const measure = () => {
      const rect = canvas.getBoundingClientRect(); width = rect.width; height = rect.height;
      mobile = media.matches; count = mobile ? 48 : 80;
      formations = Array.from({ length: 9 }, (_, state) => Array.from({ length: count }, (_, i) => form(state, i, count)));
      const dpr = Math.min(devicePixelRatio || 1, mobile ? 1.25 : 1.75);
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      scale = Math.min(width / 590, height / 600); wake();
    };
    const unsub = progress.on("change", value => { target = value; wake(); });
    const observer = new ResizeObserver(measure); observer.observe(canvas);
    const visibility = () => { if (!document.hidden) wake(); };
    const intersection = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; if (visible) wake(); });
    intersection.observe(canvas);
    const move = (event: PointerEvent) => { const r = canvas.getBoundingClientRect(); pointer = { x: (event.clientX - r.left - width / 2) / scale, y: (event.clientY - r.top - height / 2) / scale }; wake(); };
    const leave = () => { pointer = { x: 9999, y: 9999 }; wake(); };
    canvas.addEventListener("pointermove", move, { passive: true }); canvas.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", visibility);
    measure();
    return () => { disposed = true; cancelAnimationFrame(raf); unsub(); observer.disconnect(); intersection.disconnect(); document.removeEventListener("visibilitychange", visibility); canvas.removeEventListener("pointermove", move); canvas.removeEventListener("pointerleave", leave); };
  }, [progress, reduced]);
  return <canvas ref={ref} className={styles.canvas} />;
}
