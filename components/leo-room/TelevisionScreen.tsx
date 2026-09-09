"use client";
import { useEffect } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

/** Keep the cover on the physical TV surface so the bezel and furniture occlude it. */
export function TelevisionScreen() {
  const texture = useTexture("/room/leo-open-world-cover.webp");
  useEffect(() => {
    const image = texture.image as { width: number; height: number };
    const imageAspect = image.width / image.height;
    const screenAspect = 6.08 / 2.8975;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
    // Center-crop the cover to the existing wide television without stretching it.
    if (imageAspect < screenAspect) {
      const height = imageAspect / screenAspect;
      texture.repeat.set(1, height);
      texture.offset.set(0, (1 - height) / 2);
    } else {
      const width = screenAspect / imageAspect;
      texture.repeat.set(width, 1);
      texture.offset.set((1 - width) / 2, 0);
    }
    texture.anisotropy = 4;
    texture.needsUpdate = true;
  }, [texture]);
  return <mesh name="television-cover" position={[0, 0, .145]}>
    <planeGeometry args={[6.08, 2.8975]} />
    <meshBasicMaterial map={texture} toneMapped={false} depthTest depthWrite />
  </mesh>;
}
