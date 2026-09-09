"use client";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

/** A real screen surface: furniture and the TV bezel now occlude the cover. */
export function TelevisionScreen() {
  const texture=useMemo(()=>{
    const canvas=document.createElement("canvas");canvas.width=1280;canvas.height=610;
    const c=canvas.getContext("2d")!;c.scale(2,2);
    c.fillStyle="#111a20";c.fillRect(0,0,640,305);
    const glow=c.createRadialGradient(320,390,0,320,390,300);
    glow.addColorStop(0,"#60533d");glow.addColorStop(1,"rgba(96,83,61,0)");
    c.fillStyle=glow;c.fillRect(0,0,640,305);
    c.fillStyle="#bda77f";c.font="10px Arial, sans-serif";c.textAlign="left";
    c.fillText("LEO / DIGITAL WORKSPACE",40,43);
    c.textAlign="right";c.fillText("ONLINE",600,43);
    c.textAlign="center";c.fillStyle="#eee6d6";
    c.font='36px "Songti SC", "SimSun", "Noto Serif CJK SC", serif';
    c.fillText("真的做不过来了，",320,119);c.fillText("持续更新中",320,169);
    c.strokeStyle="#bda77f40";c.beginPath();c.moveTo(40,214);c.lineTo(600,214);c.stroke();
    ["AI","VIDEO","DESIGN","SYSTEM"].forEach((label,i)=>{
      const x=177+i*91;c.textAlign="left";c.fillStyle="#897957";c.font="8px Arial";c.fillText(`0${i+1}`,x,244);
      c.fillStyle="#d3c5aa";c.font="11px Arial";c.fillText(label,x+20,244);
    });
    const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;map.anisotropy=4;return map;
  },[]);
  useEffect(()=>()=>texture.dispose(),[texture]);
  return <mesh name="television-cover" position={[0,0,.145]}>
    <planeGeometry args={[6.08,2.8975]} />
    <meshBasicMaterial map={texture} toneMapped={false} depthTest depthWrite />
  </mesh>;
}
