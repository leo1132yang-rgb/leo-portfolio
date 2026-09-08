/** A continuous cloud-local field, with deterministic seeds and no per-frame randomness. */
export type CloudParticle = {
  x: number; y: number; vx: number; vy: number; baseX: number; baseY: number;
  depth: number; size: number; alpha: number; glow: boolean;
};
export const CLOUD_CYCLE_SECONDS = 9.8;
const TAU = Math.PI * 2;
export const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
const seed = (i: number, salt: number) => {
  const n = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return n - Math.floor(n);
};
export function breathAt(time: number) {
  const phase = time * TAU / CLOUD_CYCLE_SECONDS + .11 * Math.sin(time * .19) + .065 * Math.sin(time * .41);
  const wave = .5 - .5 * Math.cos(phase);
  return wave * wave * (3 - 2 * wave);
}
export function createCloud(count: number): CloudParticle[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = seed(i, 1) * TAU;
    const radius = Math.min(2.35, Math.sqrt(-2 * Math.log(Math.max(.015, seed(i, 2))))) * .49;
    const depth = seed(i, 3), tail = seed(i, 4) > .93, accent = seed(i, 6);
    const fold = 1 + .17 * Math.sin(angle * 3 + radius * 2);
    const ribbon = seed(i, 8) < .58;
    const u = (seed(i, 9) + seed(i, 10) - 1) * 1.15;
    const band = Math.floor(seed(i, 11) * 3) - 1;
    const baseX = ribbon ? u : Math.cos(angle) * radius * fold + .13 * Math.sin(radius * 4);
    const baseY = (ribbon ? .22 * Math.sin(u * 3.5 + band * .6) + band * .16 + (seed(i, 12) - .5) * .2 : Math.sin(angle) * radius * .72)
      + (tail ? .65 + seed(i, 5) * 1.2 : 0);
    return { x: baseX, y: baseY, vx: 0, vy: 0, baseX, baseY, depth,
      size: accent > .989 ? 2 + depth * .5 : accent > .88 ? 1 + depth * .65 : .4 + depth * .72,
      alpha: (.29 + depth * .5) * (tail ? .48 : 1), glow: accent > .94 };
  });
}
export function advanceCloud(points: CloudParticle[], time: number, dt: number) {
  for (const p of points) {
    const radius = Math.hypot(p.baseX, p.baseY);
    const breath = breathAt(time - p.depth * .34 - radius * .16);
    const expansion = 1 + (.19 + p.depth * .07) * breath;
    const targetX = p.baseX * expansion + .055 * Math.sin(p.baseY * 3 + time * .24);
    const targetY = p.baseY * expansion + .045 * Math.sin(p.baseX * 3 - time * .19);
    const dx = targetX - p.x, dy = targetY - p.y;
    const spring = (3.6 + p.depth * 1.4) * (1 + Math.min(1, Math.hypot(dx, dy)) * .7);
    // Curl of a smooth potential: (dψ/dy, -dψ/dx).
    const a = p.x * 1.7 + time * .17, b = p.y * 1.4 - time * .13;
    const curlX = -1.4 * Math.sin(a) * Math.sin(b), curlY = -1.7 * Math.cos(a) * Math.cos(b);
    const flow = .075 + p.depth * .035, tangent = .024 * Math.sin(time * .16 + radius * 2);
    p.vx += (dx * spring + curlX * flow - p.y * tangent) * dt;
    p.vy += (dy * spring + curlY * flow + p.x * tangent) * dt;
    const damping = Math.exp(-(2.8 + (1 - p.depth) * .5) * dt);
    p.vx *= damping; p.vy *= damping;
    p.x += p.vx * dt; p.y += p.vy * dt;
  }
}
