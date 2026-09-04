"use client";

import { Html, type CameraControlsImpl } from "@react-three/drei";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import * as THREE from "three";
import { deskItems, type DeskItemId, type DeskSelection } from "@/data/deskItems";
import { useLanguage } from "@/components/LanguageProvider";
import styles from "./DeskInteraction.module.css";

type Gesture = { id: number; x: number; y: number; cancelled: boolean };
const DeskContext = createContext<{ gesture: RefObject<Gesture | null>; pointers: RefObject<Set<number>>; select: (selection: DeskSelection) => void; enabled: boolean } | null>(null);

export function DeskInteractionScope({ children, onSelect, enabled }: { children: ReactNode; onSelect: (selection: DeskSelection) => void; enabled: boolean }) {
  const gesture = useRef<Gesture | null>(null);
  const pointers = useRef(new Set<number>());
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
  const { language } = useLanguage();
  const { gl } = useThree();
  const [hovered, setHovered] = useState(false);
  const [labelY, setLabelY] = useState(.15);
  const id = meta.interactiveId as DeskItemId;
  const item = deskItems[id];
  useFrame((_, delta) => {
    const visual = visualRef.current;
    if (!visual) return;
    const target = hovered ? 1.025 : 1;
    if (Math.abs(visual.scale.x - target) < .0001) return;
    visual.scale.setScalar(THREE.MathUtils.damp(visual.scale.x, target, 18, delta));
  });
  useEffect(() => {
    if (!hovered) return;
    const previous = gl.domElement.style.cursor;
    gl.domElement.style.cursor = "pointer";
    return () => { gl.domElement.style.cursor = previous; };
  }, [gl, hovered]);
  const over = (event: ThreeEvent<PointerEvent>) => {
    if (!context?.enabled || event.pointerType === "touch" || !ref.current) return;
    event.stopPropagation();
    const bounds = new THREE.Box3().setFromObject(ref.current);
    const top = bounds.getCenter(new THREE.Vector3());
    top.y = bounds.max.y;
    ref.current.worldToLocal(top);
    setLabelY(top.y + .08);
    setHovered(true);
  };
  return (
    <group ref={ref} position={position} rotation={rotation} scale={scale} userData={{ ...meta, deskItem: true }}
      onPointerOver={over} onPointerOut={() => setHovered(false)}
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
        const box = new THREE.Box3().setFromObject(ref.current);
        context.select({ id, center: box.getCenter(new THREE.Vector3()).toArray(), size: box.getSize(new THREE.Vector3()).toArray() });
      }}>
      <group ref={visualRef}>{children}</group>
      {hovered && <Html center position={[0, labelY, 0]} style={{ pointerEvents: "none" }} zIndexRange={[22, 20]}><div className={styles.hover}><b>{language === "cn" ? item.title : item.en}</b><span>{item.tag}</span></div></Html>}
    </group>
  );
}

// Uses the existing CameraControls instance. Nothing is re-created or mounted
// for an item focus, and the exact pre-click orbit is saved, not a preset.
export function DeskFocusController({ selection, focusToken }: { selection: DeskSelection | null; focusToken: unknown }) {
  const { controls, size } = useThree();
  const saved = useRef<{ position: THREE.Vector3; target: THREE.Vector3; min: number; smooth: number; token: unknown } | null>(null);
  useEffect(() => {
    const orbit = controls as unknown as CameraControlsImpl | null;
    if (!orbit?.setLookAt) return;
    if (!selection) {
      const original = saved.current;
      if (!original) return;
      saved.current = null;
      orbit.minDistance = original.min;
      if (original.token === focusToken) void orbit.setLookAt(...original.position.toArray(), ...original.target.toArray(), true);
      orbit.smoothTime = original.smooth;
      return;
    }
    if (!saved.current) saved.current = { position: orbit.getPosition(new THREE.Vector3(), false), target: orbit.getTarget(new THREE.Vector3(), false), min: orbit.minDistance, smooth: orbit.smoothTime, token: focusToken };
    const mobile = size.width < 768;
    const center = new THREE.Vector3(...selection.center);
    const extent = Math.max(...selection.size);
    const distance = Math.max(mobile ? .85 : .52, extent * (mobile ? 2.4 : 1.7));
    const direction = saved.current.position.clone().sub(saved.current.target).normalize();
    direction.y = Math.max(direction.y, .48);
    const position = center.clone().add(direction.normalize().multiplyScalar(distance));
    const lookTarget = center.clone();
    if (mobile) lookTarget.y -= distance * .17;
    orbit.minDistance = Math.min(saved.current.min, distance * .8);
    orbit.smoothTime = .6;
    void orbit.setLookAt(...position.toArray(), ...lookTarget.toArray(), true);
  }, [selection, controls, focusToken, size.width]);
  return null;
}
