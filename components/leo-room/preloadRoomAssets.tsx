"use client";

import { useEffect } from "react";
import { useLoader } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import { TextureLoader } from "three";

// Match the exact individual loader keys used by the visible Room components.
// No photo-wall array, reading pages, lightbox images or full My World assets.
const bottle = "/room/models/runtian-500ml-water-bottle.glb";
const textures = [
  "/room/leo-cosmic-galaxy.png",
  "/room/leo-central-console-desk.webp",
  "/room/childhood-wall/childhood-entry.png",
  "/room/world/textures/earth-color-2k.webp", // Existing small wall preview only.
] as const;

export function preloadRoomAssets(retry = false) {
  if (retry) {
    useGLTF.clear(bottle);
    textures.forEach(src => useTexture.clear(src));
  }
  useGLTF.preload(bottle);
  textures.forEach(src => useTexture.preload(src));
}

// Suspense reads the SAME R3F loader cache; it creates no Canvas, controls or GPU work.
export function RoomCoreAssetsReady({ onReady }: { onReady: () => void }) {
  useGLTF(bottle);
  useLoader(TextureLoader, textures[0]);
  useLoader(TextureLoader, textures[1]);
  useLoader(TextureLoader, textures[2]);
  useLoader(TextureLoader, textures[3]);
  useEffect(onReady, [onReady]);
  return null;
}
