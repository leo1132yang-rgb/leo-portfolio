import * as THREE from 'three/webgpu';
import { leo } from '../data/leo.js';
export function careerTexture(index){
  const entry=leo.experiences[Math.min(index,leo.experiences.length-1)];
  const c=document.createElement('canvas');c.width=2048;c.height=256;
  const ctx=c.getContext('2d');ctx.fillStyle='#000';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.font='bold 88px "Microsoft YaHei",sans-serif';ctx.fillText(entry.title.cn,1024,98,1940);ctx.font='46px "Microsoft YaHei",sans-serif';ctx.fillText(entry.date.replace('NOW','至今'),1024,193);
  const t=new THREE.CanvasTexture(c);t.flipY=false;t.generateMipmaps=false;t.minFilter=THREE.LinearFilter;return t;
}
