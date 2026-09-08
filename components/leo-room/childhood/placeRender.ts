import type { Art } from './render';
import type { ChildhoodEngine } from './engine';
import { doors, GROUND, placeReturns, routeLinks, scenes, type SceneId } from './world';

const panels: Record<string, ['nature-places', number]> = {
  playground: ['nature-places', 0], orchard: ['nature-places', 1], grove: ['nature-places', 2],
};
function label(c: CanvasRenderingContext2D, value: string, x: number, y: number, size: number, color = '#ede2ba') {
  c.font = `600 ${size}px "Microsoft YaHei",sans-serif`; c.textAlign = 'center'; c.fillStyle = color; c.fillText(value, x, y);
}
function sign(c: CanvasRenderingContext2D, value: string, x: number, y: number, w: number, size: number) {
  c.save(); c.shadowColor = '#25160f'; c.shadowOffsetY = 2; label(c, value, x, y + 37, size); c.restore();
}
export function drawWoodSign(c: CanvasRenderingContext2D, value: string, x: number, ground: number, direction = 1) {
  const w = Math.max(62, value.length * 11 + 28), y = ground - 53;
  c.save(); c.translate(Math.round(x), Math.round(ground));
  c.fillStyle = '#18251b40'; c.beginPath(); c.ellipse(5, 1, w * .43, 3, -.05, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#473d2c'; c.fillRect(-3, -57, 6, 57);
  c.fillStyle = '#827153'; c.fillRect(-2, -56, 2, 54);
  c.translate(0, y - ground); c.rotate(-.025 * direction);
  c.beginPath(); c.moveTo(-w / 2 + 2, -15); c.lineTo(w / 2 - 4, -16);
  c.lineTo(w / 2, -10); c.lineTo(w / 2 - 2, 10); c.lineTo(-w / 2 + 4, 11); c.lineTo(-w / 2, 6); c.closePath();
  c.fillStyle = '#66563c'; c.fill(); c.strokeStyle = '#392f24'; c.lineWidth = 2; c.stroke();
  c.save(); c.clip();
  for (let i = 0; i < 9; i++) {
    c.strokeStyle = i % 2 ? '#b59a6b32' : '#332b2340'; c.lineWidth = 1;
    c.beginPath(); c.moveTo(-w / 2 + i % 3 * 7, -13 + i * 3); c.lineTo(w / 2 - i % 4 * 6, -14 + i * 3); c.stroke();
  } c.restore();
  c.fillStyle = '#baa379'; c.fillRect(-w / 2 + 5, -10, 2, 2); c.fillRect(w / 2 - 8, 6, 2, 2);
  c.shadowColor = '#24271e'; c.shadowOffsetY = 1;
  label(c, value, -direction * 7, 2, 10, '#d5c8a5');
  c.shadowOffsetY = 0; c.strokeStyle = '#c2b28c'; c.lineWidth = 1;
  const arrow = direction > 0 ? w / 2 - 14 : -w / 2 + 14;
  c.beginPath(); c.moveTo(arrow - direction * 4, -3); c.lineTo(arrow + direction * 3, -3);
  c.moveTo(arrow, -6); c.lineTo(arrow + direction * 3, -3); c.lineTo(arrow, 0); c.stroke();
  c.restore();
}
const placeNames: Partial<Record<SceneId, string>> = {
  home: '白马李家', street: '村间小路', playground: '伙伴空地', orchard: '后山果园',
  grove: '林间小路', station: '加油站旁', reservoir: '水库', outskirts: '郊外小路',
  town: '老街', market: '商城街', shop: '一楼店铺', kitchen: '二楼厨房', bedroom: '楼上的家',
};
export function drawWayfinding(c: CanvasRenderingContext2D, g: ChildhoodEngine) {
  if (['street', 'outskirts', 'playground', 'orchard', 'grove', 'station'].includes(g.scene)) {
    for (const door of doors.filter(d => d.scene === g.scene)) {
      const name = placeNames[door.to] || scenes[door.to].title.split(' · ')[0];
      drawWoodSign(c, name, Math.max(60, door.x), GROUND, door.id.endsWith('-out') ? -1 : 1);
    }
  }
  const back = placeReturns[g.scene];
  if (back) drawWoodSign(c, g.scene === 'shop' ? '离店回街道' : g.scene === 'kitchen' ? '下楼回店里' : '回到' + (placeNames[back.to] || '来时的小路'), scenes[g.scene].width - 82, GROUND, 1);
  else if (routeLinks[g.scene]?.right) {
    c.save(); c.shadowColor = '#15221d'; c.shadowBlur = 3;
    label(c, '继续往前 →', scenes[g.scene].width - 100, 477, 11, '#c5c3a7'); c.restore();
  }
  if (g.scene === 'shop' || g.scene === 'kitchen') {
    const door = doors.find(d => d.scene === g.scene && ['stairs-up', 'bedroom-in'].includes(d.id))!;
    const x = door.x, y = g.scene === 'shop' ? 187 : 121;
    c.save();
    c.fillStyle = '#291f19b8'; c.fillRect(x - 81, y - 4, 162, 61);
    c.fillStyle = '#796046'; c.fillRect(x - 78, y - 7, 156, 59);
    c.strokeStyle = '#bea171'; c.lineWidth = 1; c.strokeRect(x - 75, y - 4, 150, 53);
    label(c, g.scene === 'shop' ? '↑ 二楼 · 厨房与家' : '木门后 · 床铺与仓库', x, y + 15, 13, '#f0d59c');
    label(c, '走近后按 E / 点互动', x, y + 37, 10, '#d7c5a5');
    c.restore();
  }
}
export function drawPlaceBackground(c: CanvasRenderingContext2D, art: Art, g: ChildhoodEngine) {
  if (['arcade', 'heng', 'gandong'].includes(g.scene)) {
    const key = g.scene === 'arcade' ? 'arcade-room' : g.scene === 'heng' ? 'heng-room' : 'gandong-room';
    c.drawImage(art[key], 0, 0, 1800, 600); return;
  }
  const panel = panels[g.scene];
  if (g.scene === 'outskirts' || g.scene === 'town' || g.scene === 'market') {
    c.drawImage(art[g.scene === 'outskirts' ? 'outskirts' : g.scene === 'town' ? 'town-block' : 'market-block'], 0, 0, 1800, 600);
  } else if (panel) {
    const image = art[panel[0]], bounds = [[1, 412], [416, 819], [824, 1253]][panel[1]];
    const ratio = image.height / 1254;
    c.drawImage(image, 0, bounds[0] * ratio, image.width, (bounds[1] - bounds[0]) * ratio, 0, 0, 1800, 600);
  } else if (g.scene === 'street') {
    const ratio = art.countryside.width / 1800;
    c.drawImage(art.countryside, 0, 0, 1350 * ratio, art.countryside.height, 0, 0, 1350, 600);
    for (let x = 1350, i = 0; x < 3600; x += 750, i++) {
      c.save(); c.translate(x + (i % 2 ? 0 : 750), 0); c.scale(i % 2 ? 1 : -1, 1);
      c.drawImage(art.countryside, 600 * ratio, 0, 750 * ratio, art.countryside.height, 0, 0, 750, 600); c.restore();
    }
  } else if (g.scene === 'station') c.drawImage(art.countryside, 724, 0, 1448, 724, 0, 0, 1200, 600);
  else if (g.scene === 'schoolroad') c.drawImage(art.countryside, 0, 0, 1800, 600);

  if (g.scene === 'town') { sign(c, '游戏厅', 265, 203, 300, 30); sign(c, '恒源祥', 1530, 198, 320, 32); }
  if (g.scene === 'market') { sign(c, '赣东商城', 340, 125, 350, 32); sign(c, '鸭鸭羽绒服', 1540, 183, 370, 32); }
}
