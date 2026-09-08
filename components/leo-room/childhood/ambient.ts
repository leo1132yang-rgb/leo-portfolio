import { worldX } from "./layout";
export class AmbientLife {
  dogX = worldX(375); dogFacing = -1; dogMode: "rest" | "sniff" | "follow" | "return" | "wag" = "sniff";
  dogTimer = 5; dogCooldown = 0; buddyRun = 0; frogJump = 0;
  private nearDog = false; private nearBuddy = false; private nearWater = false;
  constructor(private random: () => number = Math.random) {}
  pet() { this.dogMode = "wag"; this.dogTimer = 3; }
  update(dt: number, x: number, moving: boolean, allowEmergent: boolean, location = 'street') {
    this.dogCooldown = Math.max(0, this.dogCooldown - dt); this.dogTimer -= dt;
    this.buddyRun = Math.max(0, this.buddyRun - dt); this.frogJump = Math.max(0, this.frogJump - dt);
    const dogNear = location === 'street' && Math.abs(x - this.dogX) < 85, buddyNear = location === 'playground' && Math.abs(x - 480) < 75, waterNear = false;
    if (allowEmergent && moving) {
      if (dogNear && !this.nearDog && !this.dogCooldown && this.random() < .35) { this.dogMode = "follow"; this.dogTimer = 3 + this.random() * 2; this.dogCooldown = 28; }
      if (buddyNear && !this.nearBuddy && this.random() < .5) this.buddyRun = 3.5;
      if (waterNear && !this.nearWater) this.frogJump = 1.2;
    }
    this.nearDog = dogNear; this.nearBuddy = buddyNear; this.nearWater = waterNear;
    if (this.dogMode === "follow" || this.dogMode === "return") {
      const target = this.dogMode === "follow" ? Math.max(190, Math.min(580, x - 34)) : worldX(375);
      const distance = target - this.dogX;
      if (Math.abs(distance) > 7) { this.dogFacing = Math.sign(distance); this.dogX += Math.sign(distance) * Math.min(Math.abs(distance), dt * 125); }
    }
    if (this.dogTimer <= 0) {
      if (this.dogMode === "follow") { this.dogMode = "sniff"; this.dogTimer = 3; }
      else if (Math.abs(this.dogX - worldX(375)) > 10) { this.dogMode = "return"; this.dogTimer = 3; }
      else { this.dogMode = this.random() < .5 ? "rest" : "sniff"; this.dogTimer = 5 + this.random() * 7; }
    }
  }
}
