"use client";
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ROOM_STRUCTURE } from '@/data/leoRoomDimensions';
const stencil={stencilWrite:true,stencilRef:1,stencilFunc:THREE.EqualStencilFunc,stencilFail:THREE.KeepStencilOp,stencilZFail:THREE.KeepStencilOp,stencilZPass:THREE.KeepStencilOp,depthWrite:false};
export function WindowVista(){
 const stars=useRef<THREE.Points>(null);
 const positions=useMemo(()=>{const a=new Float32Array(240*3);let seed=23;const rand=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};for(let i=0;i<240;i++){const x=(rand()-.5)*15;a[i*3]=x;a[i*3+1]=x*.18+(rand()-.5)*5;a[i*3+2]=-.7-rand()*2;}return a;},[]);
 useFrame(({clock})=>{if(stars.current)stars.current.rotation.z=Math.sin(clock.elapsedTime*.012)*.012;});
 return <group name="window-celestial-depth" position={[ROOM_STRUCTURE.halfWidth+4.4,ROOM_STRUCTURE.window.sill+ROOM_STRUCTURE.window.height/2,ROOM_STRUCTURE.window.centerZ]} rotation={[0,-Math.PI/2,0]}>
 <points ref={stars} renderOrder={8} raycast={()=>null}><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions,3]}/></bufferGeometry><pointsMaterial {...stencil} color="#d9d2ba" size={.022} transparent opacity={.65} sizeAttenuation blending={THREE.AdditiveBlending}/></points>
 <group position={[-.2,.9,0]} rotation={[0,0,.3]} scale={.65}>
 <mesh renderOrder={9} raycast={()=>null}><sphereGeometry args={[.62,32,20]}/><shaderMaterial {...stencil} depthWrite vertexShader={'varying vec3 vN; varying vec2 vUv; void main(){vN=normal;vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }'} fragmentShader={'varying vec3 vN;varying vec2 vUv;void main(){float bands=.5+.5*sin(vUv.y*95.+sin(vUv.y*31.)*2.);vec3 c=mix(vec3(.23,.28,.3),vec3(.56,.51,.39),bands*.22+.3);float light=.12+.88*max(0.,dot(normalize(vN),normalize(vec3(-.7,.5,1.))));gl_FragColor=vec4(c*light,1.);}'} /></mesh>
 <mesh rotation={[.9,.1,0]} renderOrder={10} raycast={()=>null}><ringGeometry args={[.76,1.08,64]}/><meshBasicMaterial {...stencil} color="#b7aa86" transparent opacity={.18} side={THREE.DoubleSide}/></mesh>
 <mesh rotation={[.9,.1,0]} renderOrder={10} raycast={()=>null}><ringGeometry args={[.91,.96,64]}/><meshBasicMaterial {...stencil} color="#ddd4ba" transparent opacity={.13} side={THREE.DoubleSide}/></mesh>
 </group>
 </group>;
}
