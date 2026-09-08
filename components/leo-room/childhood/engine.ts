import { acts, available, doors, GROUND, memoryEvents, placeReturns, routeLinks, scenes, smallInteractions, type Door, type MemoryEvent, type SceneId, type SmallInteraction } from "./world";
import { worldX } from "./layout";
import { DialogueTrack, dialogueFor } from "./dialogue";
import { IdleDirector } from "./idle";
import { AmbientLife } from "./ambient";
import { swimPose } from "./swimming";

export type Input = { left: boolean; right: boolean; jump: boolean };
export type Progress = { version: 1; layoutVersion?: 2 | 3; completed: string[]; scene: SceneId; x: number };
export type Encounter = { event: MemoryEvent; elapsed: number; origin: SceneId };
export type Nearby = { type: "event"; value: MemoryEvent } | { type: "door"; value: Door } | { type: "small"; value: SmallInteraction };
export const SAVE_KEY = "leo-childhood-world-v1";
export function readProgress(raw: string | null): Progress {
  const base: Progress = { version: 1, layoutVersion: 3, completed: [], scene: "street", x: 165 };
  if (!raw) return base;
  try {
    const v = JSON.parse(raw);
    if (v.version !== 1) return base;
    let scene: SceneId = Object.prototype.hasOwnProperty.call(scenes, v.scene) ? v.scene : "street";
    const savedX = typeof v.x === "number" && Number.isFinite(v.x) ? v.x : 165;
    let x = scene === "street" && ![2, 3].includes(v.layoutVersion) ? worldX(Math.max(0, Math.min(4800, savedX))) : savedX;
    if (scene === 'street' && v.layoutVersion !== 3) {
      if (x >= 6720) { scene = 'schoolroad'; x = (x - 6720) / 1680 * 1800; }
      else if (x >= 4940) { scene = 'market'; x = (x - 4940) / 1780 * 1800; }
      else if (x >= 3240) { scene = 'town'; x = (x - 3240) / 1700 * 1800; }
      else if (x >= 2760) { scene = 'outskirts'; x = (x - 2760) / 480 * 1800; }
      else x = x < 510 ? x : 750 + (x - 510) / 2250 * 2700;
    }
    return { version: 1, layoutVersion: 3, scene, x: Math.max(30, Math.min(scenes[scene].width - 30, x)),
      completed: Array.isArray(v.completed) ? [...new Set<string>(v.completed.filter((id: unknown) => memoryEvents.some(e => e.id === id)))] : [] };
  } catch { return base; }
}

export class ChildhoodEngine {
  scene: SceneId = "street";
  x = 165; y = GROUND; vy = 0; facing = 1; moving = false; grounded = true;
  camera = 0; viewWidth = 1000; time = 0; encounter: Encounter | null = null;
  completed: string[] = []; nearby: Nearby | null = null; transition = 0; notice = ""; noticeTime = 0;
  dialogue = new DialogueTrack(); idle: IdleDirector; ambient: AmbientLife;
  smallAction: { interaction: SmallInteraction; elapsed: number } | null = null;
  private jumpHeld = false;
  crossing: { to: SceneId; spawn: number; elapsed: number } | null = null;
  constructor(progress: Progress, random: () => number = Math.random) { this.scene = progress.scene; this.x = progress.x; this.completed = [...progress.completed]; this.idle = new IdleDirector(random); this.ambient = new AmbientLife(random); }
  get progress(): Progress { return { version: 1, layoutVersion: 3, scene: this.scene, x: this.x, completed: [...this.completed] }; }
  get act() { return acts[this.scene === 'street' ? (this.x < 750 ? 0 : 1) : this.scene === 'schoolroad' && this.x > 1050 ? 4 : scenes[this.scene].act - 1]; }
  refreshNearby() {
    if (this.encounter) { this.nearby = null; return; }
    const candidates: Nearby[] = [
      ...doors.filter(d => d.scene === this.scene && available(d, this.completed)).map(value => ({ type: "door" as const, value })),
      ...memoryEvents.filter(e => e.scene === this.scene && available(e, this.completed)).map(value => ({ type: "event" as const, value })),
      ...smallInteractions.filter(e => e.scene === this.scene && available(e, this.completed)).map(e => ({ type: "small" as const, value: e.kind === "pet" ? { ...e, x: this.ambient.dogX } : e })),
    ];
    candidates.sort((a, b) => Math.abs(a.value.x - this.x) - Math.abs(b.value.x - this.x));
    this.nearby = candidates.length && Math.abs(candidates[0].value.x - this.x) < 32 && this.grounded ? candidates[0] : null;
  }
  interact() {
    if (this.crossing) return;
    if (this.encounter) { this.dialogue.advance(); return; }
    this.idle.interrupt();
    this.refreshNearby();
    if (!this.nearby || this.encounter) return;
    const { type, value } = this.nearby;
    if (type === "door") {
      const door = value as Door;
      this.changeScene(door.to, door.spawn);
    } else if (type === "small") {
      this.smallAction = { interaction: value as SmallInteraction, elapsed: 0 };
      if ((value as SmallInteraction).kind === "pet") this.ambient.pet();
    } else {
      const event = value as MemoryEvent;
      this.x = event.x - 25; this.y = GROUND; this.vy = 0; this.grounded = true;
      this.encounter = { event, elapsed: 0, origin: this.scene };
      this.smallAction = null; this.dialogue.start(dialogueFor(event));
      this.nearby = null; this.moving = false;
    }
  }
  changeScene(scene: SceneId, x: number, preserveEncounter = false) {
    this.crossing = null;
    this.idle.interrupt(); this.smallAction = null;
    if (!preserveEncounter) { this.encounter = null; this.dialogue.clear(); }
    this.scene = scene; this.x = x; this.y = GROUND; this.vy = 0; this.grounded = true;
    this.camera = Math.max(0, Math.min(scenes[scene].width - this.viewWidth, x - this.viewWidth * .4));
    this.transition = 1; this.nearby = null;
  }
  update(delta: number, input: Input) {
    const dt = Math.min(.04, Math.max(0, delta));
    this.time += dt; this.transition = Math.max(0, this.transition - dt * 2.5);
    this.noticeTime = Math.max(0, this.noticeTime - dt);
    if (this.crossing) {
      this.crossing.elapsed += dt; this.transition = Math.min(1, this.crossing.elapsed / .18);
      if (this.crossing.elapsed >= .18) this.changeScene(this.crossing.to, this.crossing.spawn);
      return;
    }
    if (this.scene === "street" || this.scene === 'playground') this.ambient.update(dt, this.x, input.left || input.right, !this.encounter, this.scene);
    if (this.encounter) {
      const encounter = this.encounter;
      this.idle.interrupt(); encounter.elapsed = Math.min(encounter.event.duration, encounter.elapsed + dt);
      this.dialogue.update(dt);
      if (encounter.event.kind === "breakfast" && encounter.elapsed > 5 && this.scene !== "kitchen") this.changeScene("kitchen", 425, true);
      if (encounter.elapsed >= encounter.event.duration && this.dialogue.done) {
        if (!this.completed.includes(encounter.event.id)) this.completed.push(encounter.event.id);
        this.notice = encounter.event.title; this.noticeTime = 4;
        this.encounter = null; this.dialogue.clear();
      }
    } else {
      const axis = Number(input.right) - Number(input.left);
      if (axis || input.jump) { this.smallAction = null; this.idle.interrupt(); }
      if (this.smallAction) { this.smallAction.elapsed += dt; if (this.smallAction.elapsed > 2.5) this.smallAction = null; }
      this.moving = axis !== 0;
      if (axis) this.facing = axis;
      this.x = Math.max(28, Math.min(scenes[this.scene].width - 28, this.x + axis * 190 * dt));
      if (input.jump && !this.jumpHeld && this.grounded) { this.vy = -385; this.grounded = false; }
      const oldY = this.y;
      this.vy += 1080 * dt; this.y += this.vy * dt; this.grounded = false;
      let floor = GROUND;
      if (this.scene === "orchard") for (const platform of [{ x: 350, y: 453, w: 90 }, { x: 980, y: 454, w: 80 }]) {
        if (this.x >= platform.x && this.x <= platform.x + platform.w && oldY <= platform.y + 1 && this.y >= platform.y && this.vy >= 0) floor = Math.min(floor, platform.y);
      }
      if (this.y >= floor) { this.y = floor; this.vy = 0; this.grounded = true; }
      this.idle.update(dt, !axis && !input.jump && this.grounded && !this.smallAction, this.facing, this.scene === "schoolroad" && this.x >= 1050,
        this.scene === "schoolroad" && this.x >= 1450 && this.x <= 1545);
      this.refreshNearby();
      const next = axis > 0 && this.x >= scenes[this.scene].width - 30 ? routeLinks[this.scene]?.right : axis < 0 && this.x <= 30 ? routeLinks[this.scene]?.left : null;
      if (next) { this.idle.interrupt(); this.nearby = null; this.crossing = { to: next, spawn: axis > 0 ? 70 : scenes[next].width - 70, elapsed: 0 }; }
      else if ((axis > 0 && this.x >= scenes[this.scene].width - 30) || (axis < 0 && this.x <= 30)) {
        const back = placeReturns[this.scene];
        if (back && available(back, this.completed)) {
          this.idle.interrupt(); this.nearby = null;
          this.crossing = { to: back.to, spawn: back.spawn, elapsed: 0 };
        }
      }
    }
    this.jumpHeld = input.jump;
    const screenX = this.x - this.camera;
    let target = this.camera;
    if (this.encounter) target = (this.encounter.event.kind === 'swim' ? swimPose(this.encounter.elapsed, this.x).x : this.x + (this.encounter.event.kind === "photo" ? 28 : 0)) - this.viewWidth * .48;
    else if (screenX < this.viewWidth * .35) target = this.x - this.viewWidth * .35;
    else if (screenX > this.viewWidth * .65) target = this.x - this.viewWidth * .65;
    target = Math.max(0, Math.min(scenes[this.scene].width - this.viewWidth, target));
    this.camera += (target - this.camera) * (1 - Math.exp(-dt * 6));
  }
}
