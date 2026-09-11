"use client";
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/** Two deliberately different plants: upright lanceolate foliage / soft radial peperomia. */
export function SculptedDeskPlant({soft=false}:{soft?:boolean}) {
 const asset=useMemo(()=>{
  const leaf=new THREE.BufferGeometry(),p:number[]=[],colors:number[]=[],uv:number[]=[],index:number[]=[];
  const rows=10,cols=4;
  for(let y=0;y<=rows;y++){
   const t=y/rows,w=Math.pow(Math.sin(Math.PI*t),soft?.55:.95)*(soft?.35:.18);
   for(let x=0;x<=cols;x++){
    const u=x/cols*2-1;
    p.push(u*w*(1+.06*Math.sin(t*18)),t,Math.sin(t*Math.PI)*.15-u*u*.10-t*t*.16);
    uv.push(x/cols,t);
    const vein=Math.abs(u)<.05,fade=.74+.2*Math.sin(t*Math.PI);
    colors.push(vein?.74:fade,vein?.87:fade,vein?.58:fade*.88);
   }
  }
  for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){const i=y*(cols+1)+x;index.push(i,i+1,i+cols+1,i+1,i+cols+2,i+cols+1);}
  leaf.setAttribute('position',new THREE.Float32BufferAttribute(p,3));leaf.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));leaf.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));leaf.setIndex(index);leaf.computeVertexNormals();
  const growth=Array.from({length:soft?12:9},(_,i)=>{
   const a=i*2.399+.3,r=soft?.07+(i%3)*.02:.025+(i%3)*.017;
   const h=soft?.20+(i%3)*.055:.24+(i%4)*.075;
   const end=new THREE.Vector3(Math.cos(a)*r,h,Math.sin(a)*r);
   return {a,h,end,length:soft?.19+(i%3)*.025:.21+(i%3)*.035,
    geometry:new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(new THREE.Vector3(0,.11,0),new THREE.Vector3(end.x*.35,h*.82,end.z*.35),end),6,.004,5,false)};
  });
  const stems=mergeGeometries(growth.map(s=>s.geometry));growth.forEach(s=>s.geometry.dispose());
  return {leaf,stems,growth};
 },[soft]);
 useEffect(()=>()=>{asset.leaf.dispose();asset.stems.dispose();},[asset]);
 const leaves=useRef<THREE.InstancedMesh>(null);
 useLayoutEffect(()=>{
  const dummy=new THREE.Object3D();asset.growth.forEach((s,i)=>{
   dummy.position.copy(s.end);dummy.rotation.set(soft?.95+(i%3)*.18:.32+(i%3)*.2,s.a,(i%2?1:-1)*.13);
   dummy.scale.set(s.length,s.length,s.length);dummy.updateMatrix();leaves.current!.setMatrixAt(i,dummy.matrix);
   leaves.current!.setColorAt(i,new THREE.Color((soft?['#627e48','#859455','#4d703f']:['#42673f','#657d47','#34583a'])[i%3]));
  });leaves.current!.instanceMatrix.needsUpdate=true;if(leaves.current!.instanceColor)leaves.current!.instanceColor.needsUpdate=true;
 },[asset,soft]);
 const profile=useMemo(()=> (soft?
  [[0,-.13],[.115,-.13],[.145,-.10],[.166,.06],[.162,.125],[.153,.137],[.145,.131],[.148,.07],[.12,-.1]]:
  [[0,-.13],[.108,-.13],[.119,-.115],[.144,.114],[.145,.132],[.14,.14],[.132,.135],[.133,.113],[.11,-.1]]
 ).map(([r,y])=>new THREE.Vector2(r,y)),[soft]);
 return <group name={soft?'desk-peperomia':'desk-sculptural-foliage'}>
  <mesh castShadow receiveShadow><latheGeometry args={[profile,32]}/><meshPhysicalMaterial color={soft?'#9c8068':'#d8cfb8'} roughness={soft?.79:.63} clearcoat={soft?.03:.12} clearcoatRoughness={.6}/></mesh>
  <mesh position={[0,.107,0]}><cylinderGeometry args={[soft?.145:.131,.12,.01,24]}/><meshStandardMaterial color="#302920" roughness={1}/></mesh>
  <mesh position={[0,-.129,0]}><cylinderGeometry args={[.115,.115,.012,24]}/><meshStandardMaterial color={soft?'#77604c':'#b5aa90'} roughness={.93}/></mesh>
  <mesh geometry={asset.stems}><meshStandardMaterial color="#647443" roughness={.85}/></mesh>
  <instancedMesh ref={leaves} args={[asset.leaf,undefined,asset.growth.length]} castShadow><meshStandardMaterial vertexColors side={THREE.DoubleSide} roughness={.72} metalness={0}/></instancedMesh>
 </group>;
}
