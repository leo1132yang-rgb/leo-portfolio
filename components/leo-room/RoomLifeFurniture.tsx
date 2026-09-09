"use client";
import { useRoomMobile } from "./useRoomMobile";
import { RoomHover } from "./RoomHover";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { CENTRAL_WORKSPACE } from "@/data/leoRoomWorkspace";
import { useRoomLife } from "./RoomLifeContext";
import styles from "./RoomNavigation.module.css";

export function ChairMotion({children}:{children:ReactNode}) {
  const mobile=useRoomMobile();
  const life=useRoomLife(), latest=useRef(life);latest.current=life;
  const ref=useRef<THREE.Group>(null), {camera,size,gl}=useThree();
  const drag=useRef<{id:number;px:number;x:number;pixels:number}|null>(null);
  const initial=CENTRAL_WORKSPACE.chair.position[0];
  useFrame((_,delta)=>{
    if(!ref.current||!life)return;
    const before=ref.current.position.x;
    ref.current.position.x=THREE.MathUtils.damp(before,life.chairX-initial,14,delta);
    // Rotate the chair itself about its centre, not about the room origin.
    const model=ref.current.children[0];
    if(model){const yaw=-.15+THREE.MathUtils.clamp((ref.current.position.x-before)/Math.max(delta,.001)*.025,-.045,.045);model.rotation.y=THREE.MathUtils.damp(model.rotation.y,yaw,9,delta);}
  });
  useEffect(()=>{
    const move=(e:PointerEvent)=>{const d=drag.current;if(!d||d.id!==e.pointerId)return;latest.current?.moveChair(d.x+(e.clientX-d.px)/d.pixels);};
    const up=(e:PointerEvent)=>{if(drag.current?.id!==e.pointerId)return;drag.current=null;latest.current?.endChairDrag();if(gl.domElement.hasPointerCapture(e.pointerId))gl.domElement.releasePointerCapture(e.pointerId);};
    const cancel=()=>{drag.current=null;latest.current?.endChairDrag();};
    window.addEventListener("pointermove",move);window.addEventListener("pointerup",up);window.addEventListener("pointercancel",up);window.addEventListener("blur",cancel);
    return()=>{window.removeEventListener("pointermove",move);window.removeEventListener("pointerup",up);window.removeEventListener("pointercancel",up);window.removeEventListener("blur",cancel);};
  },[gl]);
  useEffect(()=>{if(!life?.chairDragging)drag.current=null;},[life?.chairDragging]);
  const down=(e:ThreeEvent<PointerEvent>)=>{
    e.stopPropagation();if(!life?.objectsEnabled||mobile||e.nativeEvent.pointerType==="touch")return;
    const x=life.chairX, z=CENTRAL_WORKSPACE.chair.position[2]+CENTRAL_WORKSPACE.position[2];
    const a=new THREE.Vector3(x,.7,z).project(camera), b=new THREE.Vector3(x+1,.7,z).project(camera);
    const pixels=(b.x-a.x)*size.width/2;
    if(Math.abs(pixels)<8||!life.beginChairDrag())return;
    gl.domElement.setPointerCapture(e.pointerId);drag.current={id:e.pointerId,px:e.nativeEvent.clientX,x,pixels};
  };
  return <group ref={ref} name="office-chair-rail" onPointerDown={down}
    onPointerOver={e=>e.stopPropagation()}
    onClick={e=>{e.stopPropagation();if(mobile&&e.delta<=8)life?.showMicroHint("chair");}}>
    <RoomHover>{children}</RoomHover>
  </group>;
}

export function LoungeSeat({children}:{children:ReactNode}){
  const life=useRoomLife();
  return <group name="lounge-seat-interaction" onPointerOver={e=>{e.stopPropagation();if(life?.objectsEnabled)life.showMicroHint("seat");}} onPointerOut={()=>life?.showMicroHint(null)}
    onPointerDown={e=>e.stopPropagation()} onClick={e=>{e.stopPropagation();if(e.delta<=8&&life?.objectsEnabled)life.sitDown();}}>
    <RoomHover>{children}</RoomHover>
  </group>;
}

export function BookshelfInteraction({children}:{children:ReactNode}) {
  const life=useRoomLife();
  const start=useRef<{x:number;y:number}|null>(null);
  return <group name="bookshelf-interaction"
    onPointerDown={e=>{e.stopPropagation();start.current={x:e.nativeEvent.clientX,y:e.nativeEvent.clientY};}}
    onClick={e=>{
      e.stopPropagation();
      if(!start.current||!life?.objectsEnabled||e.delta>8)return;
      if(Math.hypot(e.nativeEvent.clientX-start.current.x,e.nativeEvent.clientY-start.current.y)>8)return;
      start.current=null;life.focusHotspot("bookshelf");
    }}>
    <RoomHover>{children}</RoomHover>
  </group>;
}
