"use client";

import { RoomHover } from "./RoomHover";
import { useThree, type ThreeEvent } from "@react-three/fiber";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import * as THREE from "three";
import { useRoomLife } from "./RoomLifeContext";
import { type DeskItemId, type DeskSelection } from "@/data/deskItems";

type Gesture = { id: number; x: number; y: number; cancelled: boolean };
const DeskContext = createContext<{ gesture: RefObject<Gesture | null>; pointers: RefObject<Set<number>>; select: (selection: DeskSelection) => void; enabled: boolean } | null>(null);

export function DeskInteractionScope({ children, onSelect, enabled }: { children: ReactNode; onSelect: (selection: DeskSelection) => void; enabled: boolean }) {
  const gesture = useRef<Gesture | null>(null);
  const pointers = useRef(new Set<number>());
  useEffect(() => { gesture.current = null; pointers.current.clear(); }, [enabled]);
  useEffect(() => {
    const down = (event: PointerEvent) => {
      pointers.current.add(event.pointerId);
      if (pointers.current.size > 1 && gesture.current) gesture.current.cancelled = true;
    };
    const move = (event: PointerEvent) => {
      const start = gesture.current;
      if (start && (event.pointerId !== start.id || Math.hypot(event.clientX - start.x, event.clientY - start.y) > 8)) start.cancelled = true;
    };
    const up = (event: PointerEvent) => pointers.current.delete(event.pointerId);
    const cancel = (event: PointerEvent) => { up(event); if (gesture.current) gesture.current.cancelled = true; };
    window.addEventListener("pointerdown", down, true);
    window.addEventListener("pointermove", move, true);
    window.addEventListener("pointerup", up, true);
    window.addEventListener("pointercancel", cancel, true);
    return () => {
      window.removeEventListener("pointerdown", down, true);
      window.removeEventListener("pointermove", move, true);
      window.removeEventListener("pointerup", up, true);
      window.removeEventListener("pointercancel", cancel, true);
    };
  }, []);
  return <DeskContext.Provider value={{ gesture, pointers, select: onSelect, enabled }}>{children}</DeskContext.Provider>;
}

export function DeskInteractiveItem({ meta, children, position, rotation, scale = 1, groupRef }: {
  meta: { interactiveId: string }; children: ReactNode; position?: [number, number, number]; rotation?: [number, number, number]; scale?: number; groupRef?: RefObject<THREE.Group | null>;
}) {
  const localRef = useRef<THREE.Group>(null);
  const visualRef = useRef<THREE.Group>(null);
  const ref = groupRef ?? localRef;
  const context = useContext(DeskContext);
  const life = useRoomLife();
  const lamp = meta.interactiveId === "desk-lamp" && !!life;
  const { gl } = useThree();
  const [hovered, setHovered] = useState(false);
  useEffect(() => { if (!context?.enabled) setHovered(false); }, [context?.enabled]);
  const id = meta.interactiveId as DeskItemId;
  useEffect(() => {
    if (!hovered) return;
    const previous = gl.domElement.style.cursor;
    gl.domElement.style.cursor = "pointer";
    return () => { gl.domElement.style.cursor = previous; };
  }, [gl, hovered]);
  const over = (event: ThreeEvent<PointerEvent>) => {
    if (!context?.enabled || event.pointerType === "touch" || !ref.current) return;
    event.stopPropagation();
    setHovered(true);
    if(lamp) life?.showMicroHint("lamp");
  };
  return (
    <group ref={ref} position={position} rotation={rotation} scale={scale} userData={{ ...meta, deskItem: true }}
      onPointerOver={over} onPointerOut={() => { setHovered(false); if(lamp) life?.showMicroHint(null); }}
      onPointerDown={(event) => {
        if (!context?.enabled) return;
        event.stopPropagation();
        context.gesture.current = { id: event.pointerId, x: event.nativeEvent.clientX, y: event.nativeEvent.clientY, cancelled: context.pointers.current.size > 1 };
      }}
      onClick={(event) => {
        event.stopPropagation();
        const start = context?.gesture.current;
        if (!context?.enabled || !start || start.cancelled || event.delta > 8 || !ref.current) return;
        context.gesture.current = null;
        setHovered(false);
        if(lamp) { life?.toggleLighting(); return; }
        const box = new THREE.Box3().setFromObject(ref.current);
        context.select({ id, center: box.getCenter(new THREE.Vector3()).toArray(), size: box.getSize(new THREE.Vector3()).toArray() });
      }}>
      <group ref={visualRef}><RoomHover>{children}</RoomHover></group>
    </group>
  );
}
