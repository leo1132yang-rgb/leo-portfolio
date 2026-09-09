"use client";
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
export function SculptedDeskPlant({soft=false}:{soft?:boolean}){
 const leaf=useMemo(()=>{const g=new THREE.BufferGeometry(),p:number[]=[],uv:number[]=[],index:number[]=[];const rows=12,cols=6;for(let y=0;y<=rows;y++){const t=y/rows,w=Math.pow(Math.sin(Math.PI*t),soft?.62:.9)*(soft?.31:.22);for(let x=0;x<=cols;x++){const u=x/cols*2-1;p.push(u*w,t,Math.sin(t*Math.PI)*.12-u*u*.085+Math.pow(t,3)*.1);uv.push(x/cols,t);}}for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){const i=y*(cols+1)+x;index.push(i,i+1,i+cols+1,i+1,i+cols+2,i+cols+1);}g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(index);g.computeVertexNormals();return g;},[soft]);
 const stems=useMemo(()=>Array.from({length:soft?10:7},(_,i)=>{const a=i*2.399,r=soft?.13:.085,h=.27+(i%3)*.07;return {a,h,r,geometry:new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(new THREE.Vector3(0,.14,0),new THREE.Vector3(Math.cos(a)*r*.4,h*.8,Math.sin(a)*r*.4),new THREE.Vector3(Math.cos(a)*r,h,Math.sin(a)*r)),8,.006,5,false)};}),[soft]);
 useEffect(()=>()=>{leaf.dispose();stems.forEach(s=>s.geometry.dispose());},[leaf,stems]);
 const merged=useMemo(()=>mergeGeometries(stems.map(s=>s.geometry)),[stems]);
 const leaves=useRef<THREE.InstancedMesh>(null);
 useLayoutEffect(()=>{const dummy=new THREE.Object3D();stems.forEach((s,i)=>{dummy.position.set(Math.cos(s.a)*s.r,s.h,Math.sin(s.a)*s.r);dummy.rotation.set(soft?.65:.42,s.a,(i%2?1:-1)*.28);dummy.scale.set(soft?.6:.5,.23+(i%3)*.055,.65);dummy.updateMatrix();leaves.current!.setMatrixAt(i,dummy.matrix);leaves.current!.setColorAt(i,new THREE.Color(['#34563b','#486549','#294c36'][i%3]));});leaves.current!.instanceMatrix.needsUpdate=true;if(leaves.current!.instanceColor)leaves.current!.instanceColor.needsUpdate=true;},[stems,soft]);
 useEffect(()=>()=>merged.dispose(),[merged]);
 const profile=useMemo(()=>[new THREE.Vector2(.112,-.13),new THREE.Vector2(.13,-.12),new THREE.Vector2(.157,.09),new THREE.Vector2(.16,.128),new THREE.Vector2(.153,.141),new THREE.Vector2(.143,.135),new THREE.Vector2(.139,.09)],[]);
 return <group name={soft?'desk-pothos':'desk-sculptural-foliage'}>
  <mesh castShadow receiveShadow><latheGeometry args={[profile,32]}/><meshStandardMaterial color={soft?'#9b8c7c':'#d8d0bd'} roughness={.94} metalness={0}/></mesh>
  <mesh position={[0,.107,0]}><cylinderGeometry args={[.141,.14,.01,24]}/><meshStandardMaterial color="#28261d" roughness={1}/></mesh>
  <mesh position={[0,-.129,0]}><cylinderGeometry args={[.115,.115,.012,24]}/><meshStandardMaterial color={soft?'#766d61':'#b7b0a0'} roughness={.96}/></mesh>
  <mesh geometry={merged}><meshStandardMaterial color="#4b6040" roughness={.85}/></mesh>
  <instancedMesh ref={leaves} args={[leaf,undefined,stems.length]} castShadow><meshStandardMaterial side={THREE.DoubleSide} roughness={.62} metalness={0}/></instancedMesh>
 </group>;
}
