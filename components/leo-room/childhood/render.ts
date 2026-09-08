import { ChildhoodEngine } from "./engine";
import { GROUND, npcs, scenes, smallInteractions, type Actor, type SceneId } from "./world";
import { drawAmbient, drawNearLife } from "./lifeRender";
import spriteBounds from "./spriteBounds.json";
import propBounds from "./propBounds.json";
import { swimPose } from "./swimming";
import { drawPlaceBackground, drawWayfinding, drawWoodSign } from './placeRender';

export type Art = Record<"countryside" | "town" | "interiors" | "characters" | "father-memory" | "props" | "reservoir" | "nature-places" | "outskirts" | "town-block" | "market-block" | "arcade-room" | "heng-room" | "gandong-room" | "grandpa-kitchen", HTMLImageElement>;
const isOutdoor = (scene: SceneId) => !!scenes[scene].outdoor;
const actorIndex: Record<Actor, number> = { leo: 0, father: 6, grandfather: 7, grandmother: 8, friend: 9, friend2: 10, dog: 11 };
const actorHeight: Record<Actor, number> = { leo: 66, father: 88, grandfather: 83, grandmother: 77, friend: 63, friend2: 64, dog: 33 };
const noise = (n: number) => { const k = Math.sin(n * 127.1 + 311.7) * 43758.5453; return k - Math.floor(k); };

function rect(c: CanvasRenderingContext2D, color: string, x: number, y: number, w: number, h: number) {
  c.fillStyle = color; c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}
function text(c: CanvasRenderingContext2D, value: string, x: number, y: number, size = 16, color = "#f6e8c5") {
  c.font = `600 ${size}px "Microsoft YaHei", monospace`; c.fillStyle = color; c.textAlign = "center"; c.fillText(value, Math.round(x), Math.round(y));
}
function actor(c: CanvasRenderingContext2D, art: Art, who: Actor, x: number, feet: number, facing = 1, pose = 0, alpha = 1, scale = 1) {
  const b = spriteBounds[who === "leo" ? pose : actorIndex[who]];
  const h = actorHeight[who] * scale * (who === "leo" && pose === 4 ? .66 : 1), w = b.w / b.h * h;
  c.save(); c.globalAlpha = alpha;
  c.translate(Math.round(x), Math.round(feet)); c.scale(facing, 1);
  c.drawImage(art.characters, b.x, b.y, b.w, b.h, -w / 2, -h, w, h);
  c.restore();
}
function prop(c: CanvasRenderingContext2D, art: Art, index: number, x: number, bottom: number, width: number, height?: number) {
  const b = propBounds[index], h = height ?? width * b.h / b.w;
  c.drawImage(art.props, b.x, b.y, b.w, b.h, x - width / 2, bottom - h, width, h);
}
function renderLeoDetail(c: CanvasRenderingContext2D, art: Art, g: ChildhoodEngine) {
  const scale = isOutdoor(g.scene) ? 1 : 2;
  if (g.smallAction) {
    const { interaction: item, elapsed: t } = g.smallAction;
    const pose = ["sit", "water", "pet"].includes(item.kind) ? 4 : item.kind === "stone" ? 1 : 5;
    actor(c, art, "leo", g.x, g.y, g.facing, pose, 1, scale);
    if (item.kind === "stone") prop(c, art, 4, item.x + g.facing * Math.min(42, t * 28), GROUND - Math.abs(Math.sin(t * 8)) * Math.max(0, 4 - t * 2), 12, 6);
    if (item.kind === "tree") for (let i = 0; i < 5; i++) rect(c, "#b3a262", item.x + Math.sin(t * 2 + i) * 24, GROUND - 95 + ((t * 45 + i * 13) % 94), 3, 2);
    if (item.kind === "water") { c.strokeStyle = "#d1d9be77"; c.beginPath(); c.ellipse(item.x + 20, GROUND - 22, 4 + t * 9, 2 + t * 2, 0, 0, Math.PI * 2); c.stroke(); }
    return true;
  }
  const action = g.idle.action;
  if (!action) return false;
  const progress = action.elapsed / action.duration;
  if (action.kind === "crouch") { actor(c, art, "leo", g.x, g.y, g.facing, 4, 1, scale); return true; }
  const envelope = Math.min(1, progress / .24, (1 - progress) / .28);
  const ease = Math.max(0, envelope) ** 2 * (3 - 2 * Math.max(0, envelope));
  const b = spriteBounds[0], h = 66 * scale, w = b.w / b.h * h;
  const split = Math.floor(b.h * .37), headH = split / b.h * h;
  c.save(); c.translate(Math.round(g.x), Math.round(g.y)); c.scale(action.facing, 1);
  // Torso, legs and feet keep their original facing. Only the head glances behind.
  if (action.kind === "toe-tap") {
    const foot = Math.floor(b.h * .87), topH = foot / b.h * h;
    c.drawImage(art.characters, b.x, b.y, b.w, foot, -w / 2, -h, w, topH);
    c.drawImage(art.characters, b.x, b.y + foot, b.w, b.h - foot, -w / 2 + Math.sin(progress * Math.PI) * 2.2 * scale, -h + topH, w, h - topH);
  } else {
    c.drawImage(art.characters, b.x, b.y + split, b.w, b.h - split, -w / 2, -h + headH, w, h - headH);
    c.save();
    c.translate(-ease * .7 * scale, -h + headH * .9 + (action.kind === "look-down" ? ease * 1.3 * scale : 0));
    const turn = action.kind === "look-back" ? 1 - 2 * ease : 1 - .12 * ease;
    c.scale(turn, 1); c.rotate(action.kind === "look-down" ? ease * .055 : 0);
    c.drawImage(art.characters, b.x, b.y, b.w, split, -w / 2, -headH * .9, w, headH);
    c.restore();
  }
  c.restore(); return true;
}
function steam(c: CanvasRenderingContext2D, x: number, y: number, t: number) {
  for (let i = 0; i < 10; i++) {
    const rise = (t * 15 + i * 5) % 48;
    c.globalAlpha = (1 - rise / 48) * .48;
    rect(c, "#fff1ce", x + Math.sin(i + t * .8) * 7, y - rise, 3, 6);
  } c.globalAlpha = 1;
}
function school(c: CanvasRenderingContext2D) {
  rect(c, "#c7ad88", 3680, 260, 415, 232); rect(c, "#526064", 3670, 251, 435, 14);
  for (let i = 0; i < 100; i++) rect(c, "#a18b74", 3685 + noise(i) * 400, 270 + noise(i + 200) * 216, 5, 2);
  for (let i = 0; i < 5; i++) { rect(c, "#3c4e50", 3700 + i * 75, 318, 52, 60); rect(c, "#d6bc95", 3725 + i * 75, 318, 3, 60); rect(c, "#d6bc95", 3700 + i * 75, 347, 52, 3); }
  rect(c, "#813b2d", 3720, 278, 328, 28); text(c, "二 二 三 队 学 校", 3884, 299, 19);
  rect(c, "#253d3b", 3827, 408, 100, 84);
  for (let i = 0; i < 20; i++) rect(c, "#8d8d72", 3675 + i * 23, 428, 3, 63);
  rect(c, "#a4987c", 3675, 436, 440, 3); rect(c, "#818781", 4065, 167, 3, 257);
  c.fillStyle = "#a14531"; c.beginPath(); c.moveTo(4068, 171); c.lineTo(4110, 180); c.lineTo(4068, 197); c.fill();
}
function environment(c: CanvasRenderingContext2D, art: Art, g: ChildhoodEngine) {
  drawPlaceBackground(c, art, g);
  if (g.scene === 'schoolroad') {
    c.save(); c.translate(-3360, 0); school(c); c.restore();
    const fade = c.createLinearGradient(1050, 0, 1500, 0); fade.addColorStop(0, '#0c1c2500'); fade.addColorStop(1, '#0c1c25f5');
    c.fillStyle = fade; c.fillRect(1050, 0, 750, 600);
    for (let i = 0; i < 75; i++) {
      const a = i * .39 + g.time * .035, radius = 14 + i * 1.25;
      c.globalAlpha = .08 + noise(i) * .32; rect(c, '#c8c6b1', 1540 + Math.cos(a) * radius, 345 + Math.sin(a) * radius, 2, 2);
    } c.globalAlpha = 1;
  }
  if (g.scene === 'grove') { prop(c, art, 5, 1350, GROUND, 68); steam(c, 1350, GROUND - 38, g.time); }
  if (g.scene === 'orchard') for (const p of [{x:350,w:90,y:453},{x:980,w:80,y:454}]) prop(c, art, 4, p.x+p.w/2, GROUND+2, p.w+6, GROUND-p.y+5);
  if (g.scene === 'station') prop(c, art, 2, 830, GROUND, 150, 180);
  for (const item of smallInteractions.filter(i => i.scene === g.scene)) {
    if (item.kind === 'stone') prop(c, art, 4, item.x, GROUND, 15, 8);
    if (item.kind === 'sit') prop(c, art, 4, item.x, GROUND, 38, 10);
  }
}
function interior(c: CanvasRenderingContext2D, art: Art, g: ChildhoodEngine) {
  if (g.scene === "home") {
    c.drawImage(art["grandpa-kitchen"], 0, 0, 720, 600);
    steam(c, 133, 238, g.time); return;
  }
  const index = g.scene === "shop" ? 0 : g.scene === "bedroom" ? 2 : 1;
  c.drawImage(art.interiors, index * 724, 0, 724, 724, 0, -30, 720, 630);

  if (g.scene === "kitchen") steam(c, 149, 252, g.time);
}

function swimmer(c: CanvasRenderingContext2D, art: Art, who: Actor, x: number, waterline: number, facing: number, t: number, scale = 1) {
  // Only the head breaks the water: no standing pose or backpack floating above it.
  const h = actorHeight[who] * scale;
  c.save(); c.beginPath(); c.rect(x - 50, waterline - 45, 100, 44); c.clip();
  actor(c, art, who, x, waterline + h * .68, facing, 0, 1, scale); c.restore();
  c.strokeStyle = '#cea17a'; c.lineWidth = 3 * scale;
  c.beginPath(); c.moveTo(x - 5, waterline - 2); c.lineTo(x - 15 - Math.sin(t * 5) * 5, waterline + Math.cos(t * 5) * 2);
  c.moveTo(x + 5, waterline - 2); c.lineTo(x + 15 + Math.sin(t * 5) * 5, waterline - Math.cos(t * 5) * 2); c.stroke();
  for (let i = 0; i < 3; i++) { c.strokeStyle = i ? '#acd4cf88' : '#d7e2c3bb'; c.lineWidth = 1; c.beginPath(); c.ellipse(x - facing * i * 6, waterline + 3 + i * 3, 16 + i * 10 + Math.sin(t * 3 + i) * 3, 2 + i, 0, 0, Math.PI * 2); c.stroke(); }
}

function reservoir(c: CanvasRenderingContext2D, art: Art, g: ChildhoodEngine, reduced: boolean) {
  c.drawImage(art.reservoir, 0, 0, 1200, 600);
  const t = reduced ? 0 : g.time;
  for (let i = 0; i < 44; i++) {
    const x = 340 + noise(i) * 690, y = 305 + noise(i + 89) * 150;
    rect(c, i % 3 ? '#bfdbca45' : '#eed8a861', x + Math.sin(t * .6 + i) * 5, y, 5 + noise(i + 41) * 17, 1);
  }
  swimmer(c, art, 'friend2', 710 + Math.sin(t * .22) * 45, 355 + Math.sin(t * 2) * 1.5, -1, t, .8);
  swimmer(c, art, 'friend', 870 + Math.cos(t * .2) * 35, 333 + Math.sin(t * 2.2) * 1, 1, t + 1, .7);
  drawWoodSign(c, '下水处', 310, GROUND, 1);
}

function renderEncounter(c: CanvasRenderingContext2D, art: Art, g: ChildhoodEngine) {
  const encounter = g.encounter;
  if (!encounter) return false;
  const { event: e, elapsed: t } = encounter;
  const p = Math.min(1, t / e.duration), x = e.x, leo = g.x;
  if (e.kind === "belly") {
    c.save(); c.globalAlpha = Math.min(.76, t / 5 * .76); rect(c, "#0b1826", g.camera, 0, g.viewWidth, 600); c.restore();
    // The shop shutter closes before the family settles onto the bamboo bed.
    rect(c, "#3a4144", 75, 270, 240, Math.min(220, t * 60));
    for (let y = 275; y < 270 + Math.min(220, t * 60); y += 7) rect(c, "#686656", 75, y, 240, 1);
    if (t < 4) {
      actor(c, art, "father", x - 20, GROUND); actor(c, art, "leo", x - 75, GROUND);
    } else {
      const frame = Math.floor((t - 4) * 1.3) % 2;
      const img = art["father-memory"];
      const zoom = 1 + Math.min(.12, (t - 4) * .02);
      const width = 285 * zoom;
      c.drawImage(img, frame * 887, 250, 887, 440, x - width / 2, GROUND - width * 440 / 887, width, width * 440 / 887);
    }
    return true;
  }
  if (e.kind === "breakfast") {
    if (t < 5) {
      const shade = Math.max(0, .7 - t * .15); c.save(); c.globalAlpha = shade; rect(c, "#071726", 0, 0, 720, 600); c.restore();
      actor(c, art, "leo", 360, 402, 1, 4, 1, 2);
      actor(c, art, "father", 210 + Math.min(t * 20, 80), GROUND, 1, 0, 1, 2);
    } else {
      actor(c, art, "father", 260, GROUND, 1, 0, 1, 2); actor(c, art, "leo", 510, 447, -1, 4, 1, 2);
      steam(c, 365, 324, g.time); steam(c, 449, 305, g.time + 2);
      if (t > 8) text(c, "桂圆鸡蛋汤  ·  小笼包", 418, 291, 15);
    }
    return true;
  }
  if (e.kind === "ending") {
    c.save(); c.globalAlpha = Math.min(.65, p); rect(c, "#0a161d", g.camera, 0, g.viewWidth, 600); c.restore();
    actor(c, art, "leo", leo, GROUND, 1, 0, 1 - p * .35);
    return true;
  }
  if (e.kind === "sleep") {
    actor(c, art, "leo", 360, 402, 1, 4, 1, 2);
    c.save(); c.globalAlpha = p * .5; rect(c, "#0c1728", 0, 0, 720, 600); c.restore(); return true;
  }
  if (e.kind === "dog") {
    actor(c, art, "leo", leo, GROUND, 1, 4);
    if (t > 2) { const bx = leo + Math.min(1, (t - 2) / 1.5) * 48; rect(c, "#e8d9aa", bx, GROUND - 13 - Math.sin(Math.min(1, (t - 2) / 1.5) * Math.PI) * 18, 10, 3); }
    return true;
  }
  if (e.kind === "climb") {
    const rise = Math.sin(p * Math.PI) * 102;
    actor(c, art, "leo", x, GROUND - rise, 1, rise > 15 ? 5 : 0);
    if (t > 2) { rect(c, e.id === "cicada" ? "#6e4f27" : "#d7a653", x + 27, GROUND - 120 + Math.min(110, (t - 2) * 42), 6, 5); }
    return true;
  }
  if (e.kind === "swim") {
    const pose = swimPose(t, leo);
    if (pose.phase === 'swim') swimmer(c, art, 'leo', pose.x, pose.y, pose.facing, g.time);
    else actor(c, art, 'leo', pose.x, pose.y, pose.facing, pose.phase === 'dive' ? 3 : pose.phase === 'done' ? 0 : Math.floor(g.time * 8) % 2 + 1);
    if (t > 1.9 && t < 2.8) for (let i = 0; i < 9; i++) { const p = (t - 1.9) / .9; rect(c, '#dce9d3', leo + 85 + (i - 4) * p * 10, 420 - Math.sin(p * Math.PI) * (18 + i % 3 * 8), 2, 4); }
    return true;
  }
  if (e.kind === "fish") {
    actor(c, art, "leo", leo, GROUND, 1, 4);
    c.strokeStyle = "#b49362"; c.lineWidth = 2; c.beginPath(); c.moveTo(leo + 10, GROUND - 25); c.lineTo(x + 54, GROUND - 78); c.stroke();
    c.strokeStyle = "#d8d5b7"; c.lineWidth = 1; c.beginPath(); c.moveTo(x + 54, GROUND - 78); c.lineTo(x + 60, GROUND - 17 - (t > 3 ? (t - 3) * 10 : 0)); c.stroke();
    if (t > 3) rect(c, "#a7492e", x + 57, GROUND - 18 - (t - 3) * 10, 8, 4); return true;
  }
  if (e.kind === "cook" || e.kind === "share") {
    actor(c, art, "leo", e.kind === "share" ? 510 : leo - 25, GROUND, 1, e.kind === "share" ? 4 : 0, 1, 2);
    actor(c, art, "grandfather", e.kind === "cook" ? 315 + Math.sin(p * Math.PI) * 12 : 445, GROUND, 1, 0, 1, 2);
    if (t > 2) steam(c, 550, 255, g.time);
    return true;
  }
  if (e.kind === "photo") {
    actor(c, art, "leo", x, GROUND, 1, 0);
    if (t > 2 && t < 2.2) { c.save(); c.globalAlpha = .16; rect(c, "#ffedbe", g.camera, 0, g.viewWidth, 600); c.restore(); }
    return true;
  }
  if (e.kind === "play") {
    const cards = e.id === "cards";
    actor(c, art, "leo", leo + Math.sin(t * 2) * 8, GROUND - (cards && t > 2 && t < 4 ? Math.abs(Math.sin(t * 4)) * 22 : 0), 1, cards ? (t > 4 ? 5 : 3) : 4);
    if (!cards) rect(c, "#eac071", leo + 10 + Math.min(40, t * 10), GROUND - 4, 4, 4);
    else if (t < 2) rect(c, "#d0b985", leo + 20, GROUND - Math.abs(Math.sin(t * 6)) * 18, 14, 3);
    return true;
  }
  if (e.kind === "harvest" || e.kind === "snack") {
    actor(c, art, "leo", leo, GROUND, 1, 4);
    rect(c, e.id === "spicy-strips" ? "#ad3b2c" : "#a56438", leo + 15, GROUND - 26, 13, 6); return true;
  }
  if (e.kind === "trade") {
    actor(c, art, "leo", leo + Math.sin(p * Math.PI) * 25, GROUND, 1, 5);
    return true;
  }
  return false;
}

export function drawWorld(c: CanvasRenderingContext2D, art: Art, g: ChildhoodEngine, width: number, height: number, reducedMotion: boolean) {
  c.clearRect(0, 0, width, height); c.imageSmoothingEnabled = false;
  const scale = height / 600; g.viewWidth = width / scale;
  c.save(); c.scale(scale, scale);
  const offset = Math.max(0, (g.viewWidth - scenes[g.scene].width) / 2);
  c.translate(Math.round(-g.camera + offset), 0);
  if (g.scene === 'reservoir') reservoir(c, art, g, reducedMotion); else if (isOutdoor(g.scene)) environment(c, art, g); else interior(c, art, g);
  drawWayfinding(c, g);
  drawAmbient(c, g, reducedMotion);
  const e = g.encounter?.event;
  for (const npc of npcs.filter(n => n.scene === g.scene)) {
    if (npc.id === 'swimmer') continue;
    if (e?.kind === "belly" && npc.actor === "father") continue;
    if ((e?.kind === "cook" || e?.kind === "share") && npc.actor === "grandfather") continue;
    if (e?.kind === "breakfast" && npc.actor === "father") continue;
    if (npc.id === "morning-father" && !g.completed.includes("warehouse")) continue;
    let x = npc.x, y = GROUND, facing = npc.facing || 1;
    if (npc.actor === "dog") { x = g.ambient.dogX; facing = g.ambient.dogFacing; if (e?.kind === "dog") { x = npc.x; facing = -1; } y += reducedMotion ? 0 : Math.sin(g.time * (g.ambient.dogMode === "follow" ? 9 : 2)) * .7; }
    if (npc.id === "friend-a" && g.ambient.buddyRun > 0 && !e) { const p = 1 - g.ambient.buddyRun / 3.5; x += Math.sin(p * Math.PI) * 140; facing = Math.cos(p * Math.PI) > 0 ? 1 : -1; y -= Math.abs(Math.sin(g.time * 9)) * 3; }
    if ((npc.actor === "friend" || npc.actor === "friend2") && e?.kind === "play") y -= Math.abs(Math.sin(g.time * 3 + npc.x)) * 8;
    c.save();
    const daily = !e && !reducedMotion;
    if (npc.actor === "dog" && g.ambient.dogMode === "rest" && !e) { c.translate(0, y); c.scale(1, .64); c.translate(0, -y); }
    if (daily && ["father", "grandfather", "grandmother"].includes(npc.actor)) { c.translate(x, y); c.rotate(Math.sin(g.time * .7 + x) * .012); c.translate(-x, -y); }
    actor(c, art, npc.actor, x, y, facing, 0, 1, isOutdoor(g.scene) ? 1 : 2);
    c.restore();
    if (daily && npc.actor === "dog" && ["wag", "sniff"].includes(g.ambient.dogMode)) { c.strokeStyle = "#28271e"; c.lineWidth = 3; c.beginPath(); c.moveTo(x - facing * 16, y - 12); c.quadraticCurveTo(x - facing * 27, y - 18, x - facing * 23 + Math.sin(g.time * 9) * 3, y - 26); c.stroke(); }
  }
  const hidden = renderEncounter(c, art, g);
  if (!hidden && !renderLeoDetail(c, art, g)) {
    const pose = !g.grounded ? 3 : g.moving ? (Math.floor(g.time * 9) % 2) + 1 : 0;
    c.save(); c.globalAlpha = .25; c.fillStyle = "#091915"; c.beginPath(); c.ellipse(g.x, GROUND + 2, 18, 4, 0, 0, Math.PI * 2); c.fill(); c.restore();
    actor(c, art, "leo", g.x, g.y + (g.moving && g.grounded ? Math.sin(g.time * 18) * 1.5 : 0), g.facing, pose, 1, isOutdoor(g.scene) ? 1 : 2);
  }
  drawNearLife(c, g, reducedMotion);
  if (g.nearby) {
    const x = g.nearby.value.x, y = GROUND - 104 + (reducedMotion ? 0 : Math.sin(g.time * 2) * 3);
    const done = g.nearby.type === "event" && g.completed.includes(g.nearby.value.id);
    c.fillStyle = done ? "#8fbaad" : "#eed28f"; c.beginPath(); c.moveTo(x, y - 5); c.lineTo(x + 4, y); c.lineTo(x, y + 5); c.lineTo(x - 4, y); c.fill();
  }
  c.restore();
  // Snow belongs to the bedroom/kitchen window, not an indoor particle shower.
  if (g.scene === "kitchen" || g.scene === "bedroom") {
    c.save(); c.scale(scale, scale); c.translate(-g.camera + offset, 0);
    const wx = g.scene === "kitchen" ? 293 : 207, wy = g.scene === "kitchen" ? 111 : 151;
    c.beginPath(); c.rect(wx, wy, 130, 132); c.clip();
    for (let i = 0; i < 32; i++) { c.globalAlpha = .4 + noise(i) * .4; rect(c, "#f4f0de", wx + (noise(i) * 130 + (reducedMotion ? 0 : g.time * 4)) % 130, wy + (noise(i + 45) * 132 + (reducedMotion ? 0 : g.time * 20)) % 132, 2, 2); }
    c.restore();
  }
  const vignette = c.createRadialGradient(width / 2, height * .48, height * .2, width / 2, height * .5, Math.max(width, height) * .68);
  vignette.addColorStop(0, "#09121700"); vignette.addColorStop(1, "#07101499"); c.fillStyle = vignette; c.fillRect(0, 0, width, height);
  if (g.transition) { c.save(); c.globalAlpha = g.transition; rect(c, "#0a151b", 0, 0, width, height); c.restore(); }
}
