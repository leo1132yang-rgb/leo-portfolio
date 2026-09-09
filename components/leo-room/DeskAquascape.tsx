"use client";
import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useRoomLife } from './RoomLifeContext';

const independent={independentPractical:true};
function AquaticPlants(){
 const ref=useRef<THREE.InstancedMesh>(null);
 useEffect(()=>{const m=new THREE.Object3D();for(let i=0;i<72;i++){const clump=Math.floor(i/12),j=i%12;const x=clump<3?-.32+clump*.1:.16+(clump-3)*.09;const h=.055+(j%5)*.019;m.position.set(x+Math.sin(j*2.4)*.045,.075+h*.6,.09+Math.cos(j*2.4)*.045);m.rotation.set(.2*Math.cos(j),j*.7,Math.sin(j*2.4)*.5);m.scale.set(.015,h,.008);m.updateMatrix();ref.current!.setMatrixAt(i,m.matrix);ref.current!.setColorAt(i,new THREE.Color(['#426b44','#71944a','#355d47','#8a9c58'][i%4]));}ref.current!.instanceMatrix.needsUpdate=true;if(ref.current!.instanceColor)ref.current!.instanceColor.needsUpdate=true;(ref.current!.material as THREE.Material).needsUpdate=true;},[]);
 return <instancedMesh ref={ref} args={[undefined,undefined,72]}><sphereGeometry args={[1,7,5]}/><meshStandardMaterial color="#28533b" roughness={.85}/></instancedMesh>;
}
function Driftwood(){
 const geometries=useMemo(()=>[
 [[-.25,.08,.07],[-.13,.15,.04],[-.06,.3,.02],[.06,.35,.04]],
 [[-.15,.13,.04],[-.02,.16,.01],[.13,.24,.06],[.21,.27,.1]],
 [[-.07,.26,.02],[-.16,.29,0],[-.2,.34,-.01]]
 ].map((points,i)=>new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),12,.013-i*.003,5,false)),[]);
 useEffect(()=>()=>geometries.forEach(g=>g.dispose()),[geometries]);
 return <group>{geometries.map((g,i)=><mesh key={i} geometry={g}><meshStandardMaterial color="#534230" roughness={.95}/></mesh>)}</group>;
}
function Fish({index}:{index:number}){
 const ref=useRef<THREE.Group>(null),tail=useRef<THREE.Mesh>(null);
 useFrame(({clock})=>{const t=clock.elapsedTime*.22+index*1.9;if(!ref.current)return;ref.current.position.set(Math.sin(t)*.3,.24+Math.sin(t*.8+index)*.085,Math.cos(t)*.115);ref.current.rotation.y=Math.atan2(-Math.sin(t)*.115,Math.cos(t)*.3)*-1;if(tail.current)tail.current.rotation.y=Math.sin(clock.elapsedTime*5+index)*.25;});
 return <group ref={ref}>
 <mesh userData={independent} scale={[.048,.017,.012]}><sphereGeometry args={[1,12,8]}/><meshStandardMaterial color={index===1?'#c2b276':'#9aaeb1'} roughness={.35} metalness={.18} emissive="#3e655f" emissiveIntensity={.28}/></mesh>
 <mesh position={[-.051,0,0]} ref={tail} rotation={[0,0,Math.PI/2]}><coneGeometry args={[.021,.035,3]}/><meshStandardMaterial color="#a87550" side={THREE.DoubleSide} roughness={.65}/></mesh>
 <mesh position={[.013,.018,0]} rotation={[0,0,-.3]}><coneGeometry args={[.015,.018,3]}/><meshStandardMaterial color="#a9aba0" transparent opacity={.65} side={THREE.DoubleSide}/></mesh>
 <mesh position={[.032,.004,.011]}><sphereGeometry args={[.003,6,4]}/><meshBasicMaterial color="#161b18"/></mesh>
 </group>;
}
export function DeskAquascape({surfaceY}:{surfaceY:number}){
 const life=useRoomLife(),[hover,setHover]=useState(false),light=useRef<THREE.PointLight>(null),strip=useRef<THREE.MeshStandardMaterial>(null),water=useRef<THREE.Mesh>(null),last=useRef(-Infinity);
 const glass=<meshPhysicalMaterial color="#c9e2d9" transparent opacity={hover?.1:.055} roughness={.07} metalness={.08} clearcoat={.75} depthWrite={false} side={THREE.DoubleSide}/>;
 useFrame(({clock},dt)=>{const target=life?.aquariumBright?.18:.055;if(light.current)light.current.intensity=THREE.MathUtils.damp(light.current.intensity,target,6,dt);if(strip.current)strip.current.emissiveIntensity=THREE.MathUtils.damp(strip.current.emissiveIntensity,life?.aquariumBright?1.5:.45,6,dt);if(water.current)water.current.position.y=.468+Math.sin(clock.elapsedTime*.7)*.001;});
 return <group name="desk-aquascape" position={[-1.36,surfaceY,-.59]} onPointerDown={e=>e.stopPropagation()} onPointerOver={e=>{e.stopPropagation();if(e.nativeEvent.pointerType!=='touch')setHover(true);}} onPointerOut={()=>setHover(false)} onClick={e=>{e.stopPropagation();if(e.delta>8||!life?.objectsEnabled||performance.now()-last.current<400)return;last.current=performance.now();life.toggleAquarium();}}>
 <mesh position={[0,.014,0]}><boxGeometry args={[.94,.028,.45]}/><meshStandardMaterial color="#252c2a" metalness={.3} roughness={.65}/></mesh>
 <mesh position={[0,.046,0]}><boxGeometry args={[.9,.045,.41]}/><meshStandardMaterial color="#665741" roughness={1}/></mesh>
 <mesh position={[.04,.071,-.07]} rotation={[-Math.PI/2,0,.15]} scale={[1.8,.65,1]}><circleGeometry args={[.17,24]}/><meshStandardMaterial color="#c6ba95" roughness={1}/></mesh>
 {[[-.26,.13,.04,.11],[-.11,.16,.09,.14],[.26,.115,.04,.085],[.09,.09,.12,.055]].map(([x,y,z,r],i)=><mesh key={i} position={[x,y,z]} rotation={[.1,i*.8,.25]} scale={[1,.85,.65]}><dodecahedronGeometry args={[r,0]}/><meshStandardMaterial color={i%2?'#5d6862':'#7d8170'} roughness={.95}/></mesh>)}
 <Driftwood/><AquaticPlants/>{[0,1,2].map(i=><Fish key={i} index={i}/>)}
 <mesh ref={water} position={[0,.468,0]} rotation={[-Math.PI/2,0,0]} renderOrder={2}><planeGeometry args={[.904,.414]}/><meshPhysicalMaterial color="#adc9bb" transparent opacity={.12} roughness={.18} metalness={.2} depthWrite={false} side={THREE.DoubleSide}/></mesh>
 {[-1,1].map(side=><group key={side}><mesh position={[0,.27,side*.218]} renderOrder={3}><boxGeometry args={[.928,.49,.007]}/>{glass}</mesh><mesh position={[side*.461,.27,0]} renderOrder={3}><boxGeometry args={[.007,.49,.432]}/>{glass}</mesh><mesh position={[side*.461,.27,.219]}><boxGeometry args={[.006,.49,.007]}/><meshBasicMaterial color="#c5d5c4" transparent opacity={.38}/></mesh></group>)}
 <mesh position={[0,.526,.055]}><boxGeometry args={[.82,.018,.052]}/><meshStandardMaterial color="#363c37" roughness={.4} metalness={.7}/></mesh>
 <mesh position={[0,.515,.055]} userData={independent}><boxGeometry args={[.76,.004,.038]}/><meshStandardMaterial ref={strip} color="#e4edcf" emissive="#e4edcf" emissiveIntensity={1.5}/></mesh>
 {[-.36,.36].map(x=><mesh key={x} position={[x,.503,.08]}><boxGeometry args={[.012,.044,.013]}/><meshStandardMaterial color="#515c53" metalness={.7} roughness={.35}/></mesh>)}
 <pointLight ref={light} userData={independent} position={[0,.42,.025]} color="#dbe8bc" intensity={.18} distance={1.25} decay={2} castShadow={false}/>
 </group>;
}
