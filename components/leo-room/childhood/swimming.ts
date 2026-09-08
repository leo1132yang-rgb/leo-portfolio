/** Shared visual path and camera target; the saved player position stays on the bank. */
export function swimPose(t: number, bankX = 285) {
  if (t < 1.3) { const p = t / 1.3; return { phase: 'walk', x: bankX - 55 * p, y: 504 - 60 * p, facing: -1 }; }
  if (t < 2.1) { const p = (t - 1.3) / .8; return { phase: 'dive', x: bankX - 55 + 140 * p, y: 444 + 24 * p - Math.sin(p * Math.PI) * 55, facing: 1 }; }
  if (t < 7.8) { const p = (t - 2.1) / 5.7; return { phase: 'swim', x: bankX + 85 + Math.sin(p * Math.PI) * 270, y: 417 + Math.sin(t * 2.4) * 1.5, facing: p < .5 ? 1 : -1 }; }
  if (t < 9.3) { const p = (t - 7.8) / 1.5; return { phase: 'return', x: bankX + 85 * (1 - p), y: 461 + 43 * p, facing: -1 }; }
  return { phase: 'done', x: bankX, y: 504, facing: 1 };
}
