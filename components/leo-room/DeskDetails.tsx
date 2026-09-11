"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { CENTRAL_WORKSPACE, DESK_OBJECT_DIMENSIONS } from "@/data/leoRoomWorkspace";

function usePrintedTexture(draw: (ctx: CanvasRenderingContext2D) => void, width = 512, height = 256) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = width; canvas.height = height;
    draw(canvas.getContext("2d")!);
    const result = new THREE.CanvasTexture(canvas);
    result.colorSpace = THREE.SRGBColorSpace;
    return result;
  }, [draw, width, height]);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

const printCamera = (ctx: CanvasRenderingContext2D) => {
  ctx.fillStyle = "#d8d9d3";
  ctx.font = "bold 62px Arial";
  ctx.textAlign = "center";
  ctx.fillText("FUJIFILM", 256, 83);
  ctx.font = "32px Arial";
  ctx.fillText("X-T5", 425, 175);
};

/** Bespoke beveled silhouette, stepped optical barrel and mechanical controls.
 * Procedural mesh, not a downloaded or manufacturer CAD model. Units: metres. */
export function DetailedFujiCamera() {
  const { size } = useThree();
  const mobile = size.width < 768;
  const dim = DESK_OBJECT_DIMENSIONS.fujiXT5;
  const mark = usePrintedTexture(printCamera);
  const body = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-.062, .005);
    shape.quadraticCurveTo(-.065, .001, -.059, .001);
    shape.lineTo(.059, .001); shape.quadraticCurveTo(.064, .001, .064, .007);
    shape.lineTo(.064, .063); shape.quadraticCurveTo(.064, .069, .057, .069);
    shape.lineTo(.025, .071); shape.lineTo(.017, .084); shape.lineTo(-.019, .084);
    shape.lineTo(-.027, .071); shape.lineTo(-.058, .071);
    shape.quadraticCurveTo(-.064, .071, -.064, .063); shape.closePath();
    return new THREE.ExtrudeGeometry(shape, { depth: .049, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: .0015, bevelThickness: .0015, curveSegments: 8 });
  }, []);
  const barrel = useMemo(() => new THREE.LatheGeometry([
    [.026,0],[.030,.003],[.0325,.006],[.0325,.013],[.030,.015],
    [.030,.037],[.031,.04],[.031,.05],[.029,.053],[.029,.065],
    [.032,.068],[.032,.07],[.024,.07],[.024,.063],
  ].map(([x,y]) => new THREE.Vector2(x,y)), mobile ? 32 : 48), [mobile]);
  useEffect(() => () => body.dispose(), [body]);
  useEffect(() => () => barrel.dispose(), [barrel]);
  return <group>
    <mesh geometry={body} position={[0, .0005, -.025]} castShadow receiveShadow><meshStandardMaterial color="#202429" roughness={.46} metalness={.6} /></mesh>
    <RoundedBox args={[.123, .051, .052]} radius={.006} smoothness={3} position={[0, .031, 0]} castShadow><meshStandardMaterial color="#141619" roughness={.87} metalness={.03} /></RoundedBox>
    <mesh position={[-.055, .033, .023]} scale={[.012, .031, .022]} castShadow><sphereGeometry args={[1, 16, 12]} /><meshStandardMaterial color="#161819" roughness={.84} /></mesh>
    <mesh geometry={barrel} position={[0, .035, .027]} rotation={[Math.PI / 2, 0, 0]} castShadow><meshStandardMaterial color="#16191d" roughness={.38} metalness={.65} /></mesh>
    {[.011,.016,.023,.029,.035,.042,.049,.057,.067].map((z) => <mesh key={z} position={[0,.035,.027+z]}><torusGeometry args={[z>.052?.030:.031, .0007, 4, mobile?32:48]} /><meshStandardMaterial color="#454a4b" roughness={.52} metalness={.63} /></mesh>)}
    <mesh position={[0,.035,.027+dim.lensDepth-.006]}><circleGeometry args={[.0235,32]} /><meshPhysicalMaterial color="#142c34" roughness={.075} metalness={.45} clearcoat={1} /></mesh>
    <mesh position={[0,.035,.027+dim.lensDepth-.005]}><ringGeometry args={[.018,.021,32]} /><meshStandardMaterial color="#243544" roughness={.16} metalness={.6} /></mesh>
    <mesh position={[0,.035,.027+dim.lensDepth-.004]}><circleGeometry args={[.009,7]} /><meshStandardMaterial color="#060a10" roughness={.18} /></mesh>
    {[-.043,.045].map((x) => <group key={x} position={[x,.075,0]}>
      <mesh castShadow><cylinderGeometry args={[.0115,.012,.009,32]} /><meshStandardMaterial color="#2e3335" roughness={.43} metalness={.7} /></mesh>
      {!mobile && Array.from({length:16},(_,i) => <mesh key={i} position={[Math.cos(i*Math.PI/8)*.0115,0,Math.sin(i*Math.PI/8)*.0115]}><boxGeometry args={[.001,.007,.001]} /><meshStandardMaterial color="#626566" roughness={.56} metalness={.6} /></mesh>)}
      <mesh position={[0,.0055,0]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[.0075,.008,24]} /><meshStandardMaterial color="#a8a8a0" roughness={.6} /></mesh>
    </group>)}
    <mesh position={[-.047,.075,.02]}><cylinderGeometry args={[.004,.005,.004,16]} /><meshStandardMaterial color="#a8a39b" metalness={.8} roughness={.26} /></mesh>
    <RoundedBox args={[.027,.018,.013]} radius={.003} smoothness={2} position={[0,.075,-.03]}><meshStandardMaterial color="#101113" roughness={.78} /></RoundedBox>
    <mesh position={[0,.075,-.037]} rotation={[0,Math.PI,0]}><planeGeometry args={[.017,.01]} /><meshPhysicalMaterial color="#25323a" roughness={.1} metalness={.5} /></mesh>
    <mesh position={[0,.059,.028]}><planeGeometry args={[.116,.058]} /><meshBasicMaterial map={mark} transparent depthWrite={false} /></mesh>
    <RoundedBox args={[.08,.046,.005]} radius={.003} smoothness={2} position={[0,.032,-.029]}><meshStandardMaterial color="#080b10" roughness={.22} metalness={.2} /></RoundedBox>
    {!mobile && <Cable points={[[-.063,.046,.005],[-.097,.014,.045],[-.082,.003,.13],[.035,.003,.14],[.08,.014,.06],[.063,.048,.005]]} radius={.0025} color="#342c24" grounded />}
  </group>;
}

const keyRows = ["ESC F1 F2 F3 F4 F5 F6 F7 F8 F9 F10 F11 F12 DEL", "` 1 2 3 4 5 6 7 8 9 0 - = BACK:2", "TAB:1.5 Q W E R T Y U I O P [ ] \\:1.5", "CAP:1.75 A S D F G H J K L ; ' ENTER:2.25", "SHIFT:2.25 Z X C V B N M , . / SHIFT:1.75 UP", "CTRL:1.25 WIN:1.25 ALT:1.25 SPACE:6.25 ALT FN LEFT DOWN RIGHT"];
const keyboardKeys=keyRows.flatMap((row,r)=>{
  const entries=row.split(' ').map(token=>{const [label,width]=token.split(':');return {label,w:Number(width)||1};});
  const total=entries.reduce((sum,key)=>sum+key.w,0),unit=.92/total;let offset=-.46;
  return entries.map(key=>{const x=offset+key.w*unit/2;offset+=key.w*unit;return {...key,x,z:-.40+r*.158,width:key.w*unit-.01,row:r};});
});
const printKeys = (ctx: CanvasRenderingContext2D) => {
  ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='9px Arial';
  keyboardKeys.forEach(key=>{ctx.fillStyle=key.label==='ESC'||key.row===0?'#e8e2d3':'#3b4039';if(key.label!=='SPACE')ctx.fillText(key.label,(key.x+.5)*512,(key.z+.5)*256);});
};
export function Keycaps() {
  const ref=useRef<THREE.InstancedMesh>(null);
  const texture=usePrintedTexture(printKeys);
  const { keyboard:k }=DESK_OBJECT_DIMENSIONS;
  const geometry=useMemo(()=>{
    // Bevel rings preserve a soft keycap silhouette without subdividing flat faces.
    const outline=[[-.38,-.5],[.38,-.5],[.5,-.38],[.5,.38],[.38,.5],[-.38,.5],[-.5,.38],[-.5,-.38]];
    const p:number[]=[],index:number[]=[];
    [[-.5,1],[.27,1],[.5,.87]].forEach(([y,s])=>outline.forEach(([x,z])=>p.push(x*s,y,z*s)));
    for(let ring=0;ring<2;ring++)for(let i=0;i<8;i++){const a=ring*8+i,b=ring*8+(i+1)%8;index.push(a,a+8,b,b,a+8,b+8);}
    p.push(0,-.5,0,0,.5,0);for(let i=0;i<8;i++){index.push(24,i,(i+1)%8,25,16+(i+1)%8,16+i);}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setIndex(index);g.computeVertexNormals();return g;
  },[]);
  useEffect(()=>()=>geometry.dispose(),[geometry]);
  useLayoutEffect(()=>{
    const dummy=new THREE.Object3D();keyboardKeys.forEach((key,i)=>{dummy.position.set(key.x*k.width,k.height*.58,key.z*k.depth);dummy.scale.set(key.width*k.width,.006,k.depth*.135);dummy.updateMatrix();ref.current!.setMatrixAt(i,dummy.matrix);ref.current!.setColorAt(i,new THREE.Color(key.label==='ESC'?'#987454':key.row===0?'#555e52':key.label.length>1?'#a6aaa0':'#d2d0c2'));});ref.current!.instanceMatrix.needsUpdate=true;if(ref.current!.instanceColor)ref.current!.instanceColor.needsUpdate=true;
  },[k]);
  return <>
    <instancedMesh ref={ref} args={[geometry,undefined,keyboardKeys.length]} castShadow><meshStandardMaterial roughness={.72} /></instancedMesh>
    <mesh position={[0,k.height*.58+.0031,0]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[k.width,k.depth]} /><meshBasicMaterial map={texture} transparent depthWrite={false} opacity={.9} /></mesh>
  </>;
}

const printWatch=(ctx:CanvasRenderingContext2D)=>{
  ctx.fillStyle="#19232a";ctx.fillRect(0,0,256,256);ctx.translate(128,128);ctx.strokeStyle="#d0c1a0";
  for(let i=0;i<12;i++){ctx.save();ctx.rotate(i*Math.PI/6);ctx.lineWidth=i%3===0?5:2;ctx.beginPath();ctx.moveTo(0,-104);ctx.lineTo(0,-91);ctx.stroke();ctx.restore()}
  ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(-39,-40);ctx.lineTo(0,0);ctx.lineTo(62,-64);ctx.stroke();ctx.fillStyle="#c4a269";ctx.beginPath();ctx.arc(0,0,7,0,Math.PI*2);ctx.fill();
};
export function WatchFace({radius}:{radius:number}) {
  const texture=usePrintedTexture(printWatch,256,256);
  return <mesh position={[0,0,.0025]}><circleGeometry args={[radius,32]} /><meshStandardMaterial map={texture} roughness={.22} metalness={.12} /></mesh>;
}

function Cable({points,radius=.006,color="#17191a",grounded=false}:{points:number[][];radius?:number;color?:string;grounded?:boolean}) {
  const geometry=useMemo(()=>{const g=new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p as [number,number,number]))),24,radius,5,false);if(grounded){const p=g.attributes.position;for(let i=0;i<p.count;i++)p.setY(i,Math.max(.00015,p.getY(i)));g.computeVertexNormals();}return g;},[points,radius,grounded]);
  useEffect(()=>()=>geometry.dispose(),[geometry]);
  return <mesh geometry={geometry}><meshStandardMaterial color={color} roughness={.85} /></mesh>;
}

export function DeskCables({surfaceY}:{surfaceY:number}) {
  const {desk,monitor}=CENTRAL_WORKSPACE;
  const {size}=useThree();
  if(size.width<768)return null;
  return <group>
    <Cable radius={.0035} points={[[0,monitor.centerY-.1,monitor.z-.045],[.032,surfaceY+.055,-.11],[.04,surfaceY+.008,-.125],[0,surfaceY+.003,(-desk.depth*.4+.35)/2],[0,surfaceY-.12,(-desk.depth*.4+.35)/2]]} />
  </group>;
}

export function DeskFoliage() {
  const geometry=useMemo(()=>{
    const points:number[]=[],uv:number[]=[],indices:number[]=[];
    for(let i=0;i<=10;i++){const t=i/10,w=Math.sin(Math.PI*t)*.052;for(let side=0;side<3;side++){points.push((side-1)*w,t*.38,Math.sin(t*Math.PI*.8)*.065+(side===1?.015:0));uv.push(side/2,t)}}
    for(let i=0;i<10;i++)for(let j=0;j<2;j++){const a=i*3+j;indices.push(a,a+3,a+1,a+1,a+3,a+4)}
    const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(points,3));g.setAttribute("uv",new THREE.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();return g;
  },[]);
  useEffect(()=>()=>geometry.dispose(),[geometry]);
  return <group>{Array.from({length:11},(_,i)=><mesh key={i} geometry={geometry} position={[0,.14,0]} rotation={[.4+(i%3)*.24,i*2.4,.1]}><meshStandardMaterial color={i%2?"#537444":"#718550"} roughness={.77} side={THREE.DoubleSide} /></mesh>)}</group>;
}
