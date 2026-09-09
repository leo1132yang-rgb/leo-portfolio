"use client";

import { LivingShelf } from "./LivingShelf";
import { useFrame } from "@react-three/fiber";
import { useRoomLife } from "./RoomLifeContext";
import { ROOM_LIFE } from "@/data/leoRoomLife";
import { BookshelfInteraction, LoungeSeat } from "./RoomLifeFurniture";
import { PersonalBookshelf } from "./PersonalBookshelf";

import { RoundedBox } from "@react-three/drei";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

type Vec = [number, number, number];

// One small, shared surface atlas; all new furniture remains procedural.
function useStudioSurfaces() {
  const surfaces = useMemo(() => {
    const make = (fabric: boolean) => {
      const data = new Uint8Array(256 * 256 * 4);
      for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
        const i = (y * 256 + x) * 4;
        const grain = fabric
          ? Math.sin(x * Math.PI / 2) * 9 + Math.sin(y * Math.PI / 2) * 7
          : Math.sin(y * .32 + Math.sin(x * .025) * 2) * 12 + Math.sin(y * 1.7) * 4;
        const base = fabric ? [212, 200, 176] : [110, 72, 46];
        base.forEach((value, channel) => { data[i + channel] = value + grain * (fabric ? 1 : 1 - channel * .3); });
        data[i + 3] = 255;
      }
      const texture = new THREE.DataTexture(data, 256, 256);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.anisotropy = 4;
      texture.needsUpdate = true;
      return texture;
    };
    return { wood: make(false), fabric: make(true) };
  }, []);
  useEffect(() => () => { surfaces.wood.dispose(); surfaces.fabric.dispose(); }, [surfaces]);
  return surfaces;
}

export function Block({ size, at, color = "#171919", wood, radius = .02 }: { size: Vec; at: Vec; color?: string; wood?: THREE.Texture; radius?: number }) {
  return <RoundedBox args={size} position={at} radius={Math.min(radius, Math.min(...size) * .4)} smoothness={2} bevelSegments={2} castShadow receiveShadow>
    <meshStandardMaterial color={wood ? "#eee0cd" : color} map={wood} roughness={wood ? .48 : .46} metalness={wood ? .02 : .55} />
  </RoundedBox>;
}

export function Books({ at, count = 7 }: { at: Vec; count?: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const dummy = new THREE.Object3D();
    const palette = ["#b9ab8d", "#39403a", "#8c533b", "#252a2b", "#c9bea5"];
    for (let i = 0; i < count; i++) {
      const height = .29 + (i % 3) * .055;
      dummy.position.set(i * .105, height / 2, 0);
      dummy.rotation.set(0, 0, i === count - 1 ? -.14 : 0);
      dummy.scale.set(.083, height, .26);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
      ref.current!.setColorAt(i, new THREE.Color(palette[i % palette.length]));
    }
    ref.current!.instanceMatrix.needsUpdate = true;
    if (ref.current!.instanceColor) ref.current!.instanceColor.needsUpdate = true;
  }, [count]);
  return <instancedMesh ref={ref} position={at} args={[undefined, undefined, count]} castShadow receiveShadow><boxGeometry /><meshStandardMaterial roughness={.88} /></instancedMesh>;
}

export function Plant({ at, scale = 1, living = false }: { at: Vec; scale?: number; living?: boolean }) {
  const life=useRoomLife(), sway=useRef<THREE.Group>(null), time=useRef(0), pulse=useRef(10);
  useEffect(()=>{if(living && life?.plantTouch) pulse.current=0;},[living,life?.plantTouch]);
  useFrame((_,dt)=>{if(!living || !sway.current)return;time.current+=dt;pulse.current+=dt;const response=pulse.current<2?Math.sin(pulse.current*9)*Math.pow(1-pulse.current/2,2)*.065:0;sway.current.rotation.z=Math.sin(time.current*.65)*.006+response;});
  const leaves = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const dummy = new THREE.Object3D();
    for (let i = 0; i < 30; i++) {
      const angle = i * 2.399;
      const tier = Math.floor(i / 6);
      const spread = .29 - tier * .027;
      dummy.position.set(Math.cos(angle) * spread, .55 + tier * .16, Math.sin(angle) * spread);
      dummy.rotation.set(.5, -angle, -.55);
      dummy.scale.set(.085, .29, .012);
      dummy.updateMatrix();
      leaves.current!.setMatrixAt(i, dummy.matrix);
      leaves.current!.setColorAt(i, new THREE.Color(i % 3 ? "#29472b" : "#4b6535"));
    }
    leaves.current!.instanceMatrix.needsUpdate = true;
    if (leaves.current!.instanceColor) leaves.current!.instanceColor.needsUpdate = true;
  }, []);
  return <group position={at} scale={scale}>
    <mesh position={[0, .19, 0]} castShadow receiveShadow><cylinderGeometry args={[.23, .17, .38, 20]} /><meshStandardMaterial color="#7c7764" roughness={.92} /></mesh>
    <mesh position={[0, .385, 0]}><cylinderGeometry args={[.21, .21, .012, 20]} /><meshStandardMaterial color="#252017" roughness={1} /></mesh>
    <mesh position={[0, .72, 0]}><cylinderGeometry args={[.016, .03, .72, 8]} /><meshStandardMaterial color="#57452b" roughness={.9} /></mesh>
    <group ref={sway}><instancedMesh ref={leaves} args={[undefined, undefined, 30]} castShadow><sphereGeometry args={[1, 12, 8]} /><meshStandardMaterial roughness={.82} /></instancedMesh></group>
  </group>;
}

function GlobeLamp({ at, floor = false }: { at: Vec; floor?: boolean }) {
  const height = floor ? 1.3 : .32;
  return <group position={at}>
    <mesh position={[0, .025, 0]} castShadow><cylinderGeometry args={[.19, .21, .05, 24]} /><meshStandardMaterial color="#22211d" metalness={.72} roughness={.35} /></mesh>
    <mesh position={[0, height / 2, 0]} castShadow><cylinderGeometry args={[.018, .018, height, 12]} /><meshStandardMaterial color="#8c7044" metalness={.78} roughness={.3} /></mesh>
    <mesh position={[0, height, 0]}><sphereGeometry args={[.17, 24, 16]} /><meshStandardMaterial color="#fff0ce" emissive="#ffd098" emissiveIntensity={1.7} roughness={.36} /></mesh>
    <pointLight position={[0, height + .08, .08]} color="#ffcf96" intensity={floor ? 3.5 : 1.7} distance={floor ? 4 : 2.5} decay={2} />
  </group>;
}

function Shelf({ wood }: { wood: THREE.Texture }) {
  return <group position={[5.35, 0, -3.45]}><BookshelfInteraction>
    {[-.65, .65].map(x => <Block key={x} size={[.055, 3.25, .55]} at={[x, 1.625, 0]} />)}
    {[.16, .85, 1.55, 2.25, 3.05].map((y, index) => <group key={y}>
      <Block size={[1.38, .065, .57]} at={[0, y, 0]} wood={wood} />
      {index > 1 && <mesh position={[0, y - .045, .17]}><boxGeometry args={[1.15, .016, .02]} /><meshStandardMaterial color="#ffe5b7" emissive="#ffca88" emissiveIntensity={2} /></mesh>}
    </group>)}
    <GlobeLamp at={[.38, 1.59, .02]} />
    <PersonalBookshelf />
    <Plant at={[.46, .883, 0]} scale={.25} />
    <mesh position={[0,1.625,.285]}><planeGeometry args={[1.38,3.25]} /><meshBasicMaterial transparent opacity={0} depthWrite={false} /></mesh>
  </BookshelfInteraction></group>;
}

function Lounge({ wood, fabric }: { wood: THREE.Texture; fabric: THREE.Texture }) {
  const cushion = (size: Vec, at: Vec, rotation: Vec = [0, 0, 0]) => <RoundedBox args={size} position={at} rotation={rotation} radius={.12} smoothness={3} bevelSegments={3} castShadow receiveShadow><meshStandardMaterial map={fabric} bumpMap={fabric} bumpScale={.008} color="#eee5d5" roughness={.96} /></RoundedBox>;
  return <group position={ROOM_LIFE.lounge.origin}>
    <mesh position={[-.1, .025, .3]} receiveShadow><cylinderGeometry args={[1.48, 1.48, .035, 64]} /><meshStandardMaterial color="#51483a" map={fabric} roughness={1} /></mesh>
    {[1.29, 1.36, 1.42].map(radius => <mesh key={radius} position={[-.1, .046, .3]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[radius, radius + .013, 64]} /><meshStandardMaterial color="#a58d64" roughness={1} /></mesh>)}
    <group position={ROOM_LIFE.lounge.chairOrigin} rotation={[0, ROOM_LIFE.lounge.yaw, 0]}><LoungeSeat>
      <Block size={[1.35, .14, 1.18]} at={[0, .27, 0]} wood={wood} radius={.06} />
      {[-.52, .52].flatMap(x => [-.42, .42].map(z => <Block key={`${x}-${z}`} size={[.07, .24, .07]} at={[x, .14, z]} />))}
      {cushion([1.12, .27, 1.02], [0, .48, -.02])}
      {cushion([1.24, .91, .3], [0, .88, -.48], [-.2, 0, 0])}
      {[-1, 1].map(side => <group key={side}>{cushion([.25, .5, 1.04], [side * .64, .65, -.06])}</group>)}
      {[-.36, 0, .36].map(x => <Block key={x} size={[.009, .57, .014]} at={[x, .92, -.286]} color="#a7977c" radius={.003} />)}
      {cushion([.48, .42, .18], [.26, .77, -.2], [0, 0, -.15])}
    </LoungeSeat></group>
    <group position={[-.65, .04, 1.13]}>
      <mesh position={[0, .49, 0]} castShadow receiveShadow><cylinderGeometry args={[.49, .49, .055, 48]} /><meshStandardMaterial map={wood} roughness={.42} /></mesh>
      <mesh position={[0, .25, 0]} castShadow><cylinderGeometry args={[.1, .27, .46, 24]} /><meshStandardMaterial color="#1d201d" roughness={.44} metalness={.6} /></mesh>
      <Block size={[.29, .035, .21]} at={[-.09, .54, .01]} color="#bfac88" />
      <mesh position={[.21, .58, -.04]} castShadow><cylinderGeometry args={[.055, .047, .12, 20]} /><meshStandardMaterial color="#b0a084" roughness={.85} /></mesh>
      <mesh position={[.21, .643, -.04]}><cylinderGeometry args={[.047, .047, .003, 20]} /><meshStandardMaterial color="#302015" roughness={.5} /></mesh>
    </group>
    <GlobeLamp at={[1.02, .02, -.64]} floor />
  </group>;
}

export function StudioInterior() {
  const surfaces = useStudioSurfaces();
  // Seat interaction wraps the existing chair without changing its model.
  return <group>
    <LivingShelf wood={surfaces.wood} />
    <Shelf wood={surfaces.wood} />
    <Lounge {...surfaces} />
    <Plant at={[-5.6, 0, -3.12]} scale={1.3} />
    <Plant at={[5.77, 0, 2.85]} scale={1.05} />
    <Plant at={[-5.7, 0, 2.7]} scale={.95} />
    <GlobeLamp at={[-5.1, 0, 2.65]} floor />
  </group>;
}
