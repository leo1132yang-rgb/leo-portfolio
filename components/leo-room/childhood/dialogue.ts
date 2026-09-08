import type { MemoryEvent } from "./world";
export type DialogueLine = { speaker: string; text: string; at: number };
export type DialogueView = { speaker: string; text: string; fullText: string; complete: boolean; canAdvance: boolean } | null;
export function characterDelay(character: string, index: number) {
  const base = .035 + ((index * 7 + 3) % 21) / 1000;
  return base + (/[，,、；;：:]/u.test(character) ? .13 : /[。！？!?]/u.test(character) ? .22 : /[…]/u.test(character) ? .34 : 0);
}
export function dialogueFor(event: MemoryEvent): DialogueLine[] {
  if (event.kind === "ending") return [{ speaker: "", text: "童年就这样慢慢结束了。", at: 0 }, { speaker: "", text: "但那些日子，一直都在。", at: 6 }];
  if (!event.line) return [];
  const match = event.line.match(/^([^：]{1,8})：(.*)$/u);
  const speaker = match?.[1] || "", text = match?.[2] || event.line;
  return (text.match(/[^。！？!?]+[。！？!?]?/gu) || [text]).map((line, index) => ({ speaker, text: line, at: event.kind === "breakfast" && index > 0 ? 5 : 0 }));
}
/** Advanced by the existing game loop: no per-line timers or detached RAFs. */
export class DialogueTrack {
  lines: DialogueLine[] = []; index = 0; count = 0; clock = 0; revision = 0;
  private characters: string[] = []; private remaining = .045; private blockedUntil = .3;
  start(lines: DialogueLine[]) { this.lines = lines; this.index = 0; this.clock = 0; this.blockedUntil = .3; this.prepare(); }
  clear() { this.start([]); }
  private prepare() {
    this.characters = Array.from(this.lines[this.index]?.text || ""); this.count = 0; this.remaining = .045; this.revision++;
  }
  get done() { return this.index >= this.lines.length; }
  get view(): DialogueView {
    const line = this.lines[this.index];
    return !line || this.clock < line.at ? null : { speaker: line.speaker, text: this.characters.slice(0, this.count).join(""), fullText: line.text,
      complete: this.count === this.characters.length, canAdvance: this.clock >= (this.lines[this.index + 1]?.at || 0) && this.clock >= this.blockedUntil };
  }
  update(dt: number) {
    this.clock += dt;
    if (this.done || this.clock < this.lines[this.index].at || this.count >= this.characters.length) return;
    this.remaining -= dt;
    // At most one glyph per render frame, even after a slow frame.
    if (this.remaining <= 0) { this.remaining += characterDelay(this.characters[this.count], this.count); this.count++; this.revision++; }
  }
  advance() {
    if (this.done || this.clock < this.blockedUntil || this.clock < this.lines[this.index].at) return;
    this.blockedUntil = this.clock + .32;
    if (this.count < this.characters.length) { this.count = this.characters.length; this.revision++; return; }
    if (this.clock < (this.lines[this.index + 1]?.at || 0)) return;
    this.index++; this.prepare();
  }
}
