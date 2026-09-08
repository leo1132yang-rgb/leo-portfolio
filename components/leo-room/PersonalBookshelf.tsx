"use client";

import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { BOOK_SCALE, SHELF_BOOKS, SHELF_ROWS, type ShelfBook } from '@/data/leoRoomBookshelf';

const ATLAS = 2048, CELL_W = 256, CELL_H = 512;
const serif = '"Songti SC", "SimSun", "Noto Serif CJK SC", serif';
const sans = '"Microsoft YaHei", "PingFang SC", sans-serif';

/** Original typography, not scans of publishers' covers. One 2K atlas for all books. */
function makeAtlas() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = ATLAS;
  const c = canvas.getContext('2d')!;
  SHELF_BOOKS.forEach((b,i) => {
    c.save(); c.translate((i%8)*CELL_W,Math.floor(i/8)*CELL_H);
    c.fillStyle=b.color; c.fillRect(0,0,CELL_W,CELL_H);
    // Deliberately subtle, deterministic paper/cloth texture and worn edges.
    for(let n=0;n<360;n++) {
      const x=(n*73+i*31)%256,y=(n*137+i*19)%512;
      c.fillStyle=n%2?`rgba(250,238,211,${.025+b.wear*.07})`:'rgba(25,22,18,.025)';
      c.fillRect(x,y,1+(n%3),1);
    }
    c.fillStyle=`rgba(239,223,191,${b.wear*.35})`;c.fillRect(3,10,2,490);c.fillRect(59,12,2,488);
    c.fillStyle=b.accent;
    if(b.volume) { c.fillRect(7,22,50,5);c.fillRect(7,380,50,61); }
    else if(b.layout===1) {c.fillRect(4,35,56,63);c.fillRect(81,22,159,16);}
    else if(b.layout===2) {c.fillRect(4,354,56,68);c.fillRect(82,345,158,113);}
    else if(b.layout===3) {c.fillRect(4,20,8,472);c.fillRect(82,20,13,472);}
    else {c.fillRect(4,422,56,3);c.fillRect(85,388,149,2);}
    c.fillStyle=b.ink;
    const font=b.layout%2? sans:serif;
    const titleSize=Math.min(32,Math.floor(280/b.title.length));
    c.font=`${b.layout===3?600:500} ${titleSize}px ${font}`;c.textAlign='center';c.textBaseline='middle';
    if(b.stacked===undefined) [...b.title].forEach((char,n)=>c.fillText(char,33,114+n*(titleSize+3),53));
    c.font=`13px ${sans}`;
    // Author names are secondary and split into short lines, never oversized.
    const author=b.author.replace(' / ','·');
    if(b.stacked===undefined) for(let n=0;n<Math.ceil(author.length/4);n++)c.fillText(author.slice(n*4,n*4+4),33,450+n*14,54);
    else {
      c.save();c.translate(33,265);c.rotate(-Math.PI/2);
      c.font=`26px ${font}`;c.fillText(b.title,0,-8,350);
      c.font=`12px ${sans}`;c.fillText(b.author,0,15,330);c.restore();
    }
    if(b.volume){c.fillStyle='#eee1c2';c.font=`bold 31px ${serif}`;c.fillText(b.volume,32,411);}
    else {c.font=`10px ${sans}`;c.fillText(['文 学','小 说','影 像','阅 读'][b.row],33,35,48);}
    // Covers use a separate atlas region, also visible on horizontal stacks.
    c.fillStyle=b.ink;c.textAlign='left';
    if(b.faceOut){
      c.font=`24px ${serif}`;
      ['白色绵羊里的','黑色绵羊'].forEach((line,n)=>c.fillText(line,88,100+n*37,146));
      c.fillStyle=b.accent;
      for(let n=0;n<5;n++){c.beginPath();c.ellipse(107+n*25,286+(n%2)*16,10,17,-.25,0,Math.PI*2);c.fill();}
      c.fillStyle=b.ink;c.font=`18px ${sans}`;c.fillText(b.author,94,400,130);
    }else{
      c.font=`${b.layout%2?500:600} 26px ${font}`;
      const columns=Math.ceil(b.title.length/8);
      [...b.title].forEach((char,n)=>c.fillText(char,columns>1?188-Math.floor(n/8)*42:145,90+(n%8)*34,32));
      c.font=`13px ${sans}`;c.fillText(b.author,92,465,140);
      if(b.volume){c.font=`42px ${serif}`;c.fillText(b.volume,95,390);}
    }
    c.restore();
  });
  const texture=new THREE.CanvasTexture(canvas);
  texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=8;
  return texture;
}

function paperTexture() {
  const data=new Uint8Array(128*128*4);
  for(let y=0;y<128;y++)for(let x=0;x<128;x++) {
    const shade=y%3===0?-15:((x*13+y*17)%7)-3,offset=(y*128+x)*4;
    data.set([223+shade,213+shade,191+shade,255],offset);
  }
  const texture=new THREE.DataTexture(data,128,128);texture.colorSpace=THREE.SRGBColorSpace;texture.needsUpdate=true;
  return texture;
}

function atlasUV(g:THREE.BufferGeometry,index:number,spine:boolean) {
  const uv=g.getAttribute('uv'), x=index%8*CELL_W+(spine?4:82), y=Math.floor(index/8)*CELL_H+12;
  const w=spine?56:158,h=488;
  for(let i=0;i<uv.count;i++)uv.setXY(i,(x+uv.getX(i)*w)/ATLAS,1-(y+(1-uv.getY(i))*h)/ATLAS);
}

export function bookMatrix(b:ShelfBook) {
  const h=b.height*BOOK_SCALE,t=b.thickness*BOOK_SCALE;
  const rotation=new THREE.Euler(0,b.faceOut?-Math.PI/2:0,b.stacked!==undefined?Math.PI/2:(b.lean??0));
  const halfY=b.stacked!==undefined?t/2:Math.abs(Math.cos(b.lean??0))*h/2+Math.abs(Math.sin(b.lean??0))*t/2;
  return new THREE.Matrix4().compose(new THREE.Vector3(b.x,SHELF_ROWS[b.row]+(b.stacked??0)+halfY,.045),new THREE.Quaternion().setFromEuler(rotation),new THREE.Vector3(1,1,1));
}

/** Merge static books into four cover-finish batches plus one page batch. */
export function buildBookGeometry() {
  const covers:THREE.BufferGeometry[][]=[[],[],[],[]],pages:THREE.BufferGeometry[]=[],details:THREE.BufferGeometry[]=[];
  const appendBox=(list:THREE.BufferGeometry[],size:number[],at:number[],matrix:THREE.Matrix4,index?:number,spine=false)=>{
    const g=new THREE.BoxGeometry(size[0],size[1],size[2]);
    if(index!==undefined)atlasUV(g,index,spine);
    g.translate(at[0],at[1],at[2]);g.applyMatrix4(matrix);list.push(g);
  };
  SHELF_BOOKS.forEach((b,i)=>{
    const h=b.height*BOOK_SCALE,t=b.thickness*BOOK_SCALE,d=b.depth*BOOK_SCALE,m=bookMatrix(b);
    const skin=b.finish>=2?.0035:.002;
    // The block is recessed from the two actual covers and the curved spine.
    appendBox(pages,[t-skin*2,h-.008,d-.01],[0,0,-.003],m);
    const page=pages[pages.length-1], pageColor=new THREE.Color('#ffffff').lerp(new THREE.Color('#c8bb9c'),b.wear*.5);
    const colors=new Float32Array(page.getAttribute('position').count*3);
    for(let n=0;n<colors.length;n+=3)pageColor.toArray(colors,n);
    page.setAttribute('color',new THREE.BufferAttribute(colors,3));
    for(const side of [-1,1])appendBox(covers[b.finish],[skin,h,d],[side*(t-skin)/2,0,0],m,i);
    const spine=new THREE.PlaneGeometry(t,h,6,1),position=spine.getAttribute('position');
    for(let n=0;n<position.count;n++)position.setZ(n,d/2+.002*Math.cos(position.getX(n)/t*Math.PI));
    spine.computeVertexNormals();atlasUV(spine,i,true);spine.applyMatrix4(m);covers[b.finish].push(spine);
    if(i===9||i===23)appendBox(details,[.012,.033,.0015],[0,h/2+.013,d*.1],m);
  });
  const merge=(parts:THREE.BufferGeometry[])=>{const g=mergeGeometries(parts,false)!;parts.forEach(p=>p.dispose());return g;};
  // A pair of small dark bookends, with their feet resting on existing shelves.
  const ends:THREE.BufferGeometry[]=[];
  for(const [x,row] of [[-.535,0],[.063,0],[.395,3]]) {
    const m=new THREE.Matrix4().makeTranslation(x,SHELF_ROWS[row],.045);
    appendBox(ends,[.012,.19,.18],[0,.095,0],m);
    appendBox(ends,[.07,.008,.18],[x<0?-.029:.029,.004,0],m);
  }
  return {covers:covers.map(merge),pages:merge(pages),details:merge(details),ends:merge(ends)};
}

export function PersonalBookshelf() {
  const resources=useMemo(()=>({atlas:makeAtlas(),paper:paperTexture(),geometry:buildBookGeometry()}),[]);
  useEffect(()=>()=>{resources.atlas.dispose();resources.paper.dispose();resources.geometry.covers.forEach(g=>g.dispose());resources.geometry.pages.dispose();resources.geometry.details.dispose();resources.geometry.ends.dispose();},[resources]);
  return <group name="leo-personal-bookshelf-content">
    {resources.geometry.covers.map((g,i)=><mesh key={i} geometry={g} castShadow receiveShadow><meshStandardMaterial map={resources.atlas} roughness={[.87,.48,.68,.76][i]} metalness={0} /></mesh>)}
    <mesh geometry={resources.geometry.pages} castShadow receiveShadow><meshStandardMaterial map={resources.paper} vertexColors roughness={.97} /></mesh>
    <mesh geometry={resources.geometry.details} castShadow><meshStandardMaterial color="#976c4b" roughness={.95} /></mesh>
    <mesh geometry={resources.geometry.ends} castShadow receiveShadow><meshStandardMaterial color="#454b45" metalness={.6} roughness={.5} /></mesh>
  </group>;
}
