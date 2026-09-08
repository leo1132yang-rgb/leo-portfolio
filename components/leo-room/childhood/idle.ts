export type IdleKind = "look-back" | "look-around" | "look-down" | "toe-tap" | "crouch";
export type IdleAction = { kind: IdleKind; elapsed: number; duration: number; facing: number; entrance: boolean };
/** Cosmetic only. Never changes x, velocity, facing, input or encounter state. */
export class IdleDirector {
  action: IdleAction | null = null; still = 0; cooldown = 0; entranceSeen = false;
  private attemptAt: number;
  constructor(private random: () => number = Math.random) { this.attemptAt = this.delay(); }
  private delay() { return 3 + this.random() * 3; }
  interrupt() { this.action = null; this.still = 0; this.attemptAt = this.delay(); }
  update(dt: number, stationary: boolean, facing: number, endingAct: boolean, nearEntrance: boolean) {
    this.cooldown = Math.max(0, this.cooldown - dt);
    if (!stationary) { this.interrupt(); return; }
    this.still += dt;
    if (this.action) {
      this.action.elapsed += dt;
      if (this.action.elapsed >= this.action.duration) { this.action = null; this.still = 0; this.attemptAt = this.delay(); }
      return;
    }
    if (nearEntrance && !this.entranceSeen) {
      if (this.still >= 3.8 && this.cooldown <= 0) {
        this.entranceSeen = true; this.begin("look-back", facing, true);
      }
      return;
    }
    if (this.still < this.attemptAt || this.cooldown > 0) return;
    this.still = 0; this.attemptAt = this.delay(); this.cooldown = 14 + this.random() * 14;
    if (this.random() > .48) return;
    const choice = this.random();
    const kind: IdleKind = choice < (endingAct ? .28 : .08) ? "look-back" : choice < .45 ? "look-down" : choice < .67 ? "look-around" : choice < .88 ? "toe-tap" : "crouch";
    this.begin(kind, facing, false);
  }
  private begin(kind: IdleKind, facing: number, entrance: boolean) {
    this.action = { kind, facing, entrance, elapsed: 0, duration: kind === "look-back" ? (entrance ? 1.45 : 1.1) : kind === "crouch" ? 1.7 : 1.2 };
    this.cooldown = 20 + this.random() * 14;
  }
}
