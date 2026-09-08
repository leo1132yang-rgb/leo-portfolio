import type { ChildhoodEngine } from './engine';
import { GROUND, scenes, parallaxLayers } from './world';
const dot = (c: CanvasRenderingContext2D, color: string, x: number, y: number, w=2, h=2) => { c.fillStyle=color; c.fillRect(Math.round(x),Math.round(y),w,h); };
const exterior = (g: ChildhoodEngine) => scenes[g.scene].outdoor && !['arcade','heng','gandong'].includes(g.scene);
export function drawAmbient(c: CanvasRenderingContext2D,g: ChildhoodEngine,reduced:boolean) {
 const t=reduced?0:g.time;
 if(g.scene==='street') {
  for(let i=0;i<10;i++){const rise=(t*7+i*5)%62;c.globalAlpha=(1-rise/62)*.16;dot(c,'#eee4bd',120+Math.sin(t*.3+i)*9,282-rise,5,6)}c.globalAlpha=1;
  for(let i=0;i<3;i++){const x=340+i*31+Math.sin(t*.27+i)*45,y=GROUND-8;dot(c,'#af713d',x,y-3,9,6);dot(c,'#d5b776',x+7,y-7,5,5);dot(c,'#8c3c2a',x+8,y-9,3,2);dot(c,'#e0ba7a',x+2+Math.sin(t*4+i),y+3,1,4)}
 }
 if(exterior(g)&&g.scene!=='schoolroad') for(let i=0;i<4;i++) {
  const x=((t*11+i*420)%1800)+g.camera*(1-parallaxLayers.midground),y=125+i%3*30,wing=Math.sin(t*5+i)*3;
  c.strokeStyle='#334c49';c.lineWidth=1;c.beginPath();c.moveTo(x-4,y-wing);c.lineTo(x,y);c.lineTo(x+4,y-wing);c.stroke();
 }
 if(['playground','orchard','grove'].includes(g.scene)) for(let i=0;i<8;i++)dot(c,i%2?'#dac895aa':'#8cafabaa',200+i*180+Math.sin(t*.8+i)*32,396+Math.cos(t*.7+i)*25,Math.sin(t*9+i)>0?5:2,2);
 if(['outskirts','town','market'].includes(g.scene)) {
  const phase=t%42;
  if(phase<12){const x=phase*160-30,y=GROUND-32;c.strokeStyle='#454e46';c.lineWidth=2;for(const dx of[-12,12]){c.beginPath();c.arc(x+dx,y,8,0,Math.PI*2);c.stroke()}c.beginPath();c.moveTo(x-12,y);c.lineTo(x-2,y-15);c.lineTo(x+12,y);c.lineTo(x-12,y);c.stroke();dot(c,'#787860',x-3,y-33,8,16);dot(c,'#b49a78',x-1,y-42,6,7)}
 }
 if(g.scene==='arcade')for(let i=0;i<5;i++){c.globalAlpha=.055+Math.sin(t*3+i)*.02;dot(c,i%2?'#acc8a5':'#e5be82',200+i*290,330,36,26)}c.globalAlpha=1;
 if(['heng','gandong'].includes(g.scene))for(const x of[350,850,1400]){const sway=Math.sin(t*.8+x)*2;c.strokeStyle='#d1c49c66';c.beginPath();c.moveTo(x,344);c.lineTo(x+sway-6,359);c.lineTo(x+sway+6,359);c.lineTo(x,344);c.stroke()}
}
export function drawNearLife(c:CanvasRenderingContext2D,g:ChildhoodEngine,reduced:boolean){
 if(!exterior(g))return;const t=reduced?0:g.time;
 for(let i=Math.floor(g.camera*parallaxLayers.foreground/150)-1;i<(g.camera*parallaxLayers.foreground+g.viewWidth)/150+1;i++){
  const x=i*150-g.camera*(parallaxLayers.foreground-1);
  for(let j=0;j<3;j++){c.strokeStyle='#263f32a0';c.lineWidth=2;c.beginPath();c.moveTo(x+j*4,516);c.lineTo(x+j*4+Math.sin(t+j+i)*3,501+j);c.stroke()}
 }
 if(['street','orchard','grove'].includes(g.scene))for(let i=0;i<5;i++){const p=(t+i*3.7)%26;if(p<4)dot(c,'#b2a15c99',400+i*370+Math.sin(p*2+i)*22,317+p*45,3,2)}
}
