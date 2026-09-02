"use client";

import { OrbitControls, useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { travelWorldPlaces, type TravelWorldPlace } from "@/data/travelWorld";

const HOME_ID = "hong-kong";
const EARTH_RADIUS = 1.55;
const TEXTURES = {
  color: "/room/world/textures/earth-color-2k.webp",
  night: "/room/world/textures/earth-night-2k.webp",
  bump: "/room/world/textures/earth-bump-2k.webp",
  boundaries: "/room/world/textures/country-boundaries.png",
};

const COUNTRY_LABELS = [
  { en: "CHINA", zh: "中国", lat: 35.8, lng: 104.2 },
  { en: "JAPAN", zh: "日本", lat: 37.5, lng: 138.2 },
  { en: "THAILAND", zh: "泰国", lat: 15.8, lng: 101.0 },
  { en: "INDIA", zh: "印度", lat: 21.1, lng: 78.9 },
  { en: "AUSTRALIA", zh: "澳大利亚", lat: -25.2, lng: 133.8 },
  { en: "UNITED STATES", zh: "美国", lat: 39.4, lng: -98.5 },
  { en: "MALDIVES", zh: "马尔代夫", lat: 3.2, lng: 73.2 },
  { en: "INDONESIA", zh: "印尼", lat: -2.5, lng: 118.0 },
];

function latLngToVector3(lat: number, lng: number, radius = EARTH_RADIUS) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lng);
  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.sin(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.cos(theta),
  );
}

function createLabelTexture(en: string, zh: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 92;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(235,238,234,.64)";
  ctx.font = "500 24px Arial, sans-serif";
  ctx.letterSpacing = "2px";
  ctx.fillText(en, 18, 34);
  ctx.fillStyle = "rgba(235,238,234,.42)";
  ctx.font = "400 22px Arial, sans-serif";
  ctx.fillText(zh, 18, 66);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function VisibleSprite({
  position,
  texture,
  scale,
}: {
  position: THREE.Vector3;
  texture: THREE.Texture;
  scale: [number, number, number];
}) {
  const ref = useRef<THREE.Sprite>(null);
  const { camera } = useThree();

  useFrame(() => {
    const sprite = ref.current;
    if (!sprite) return;
    const worldPosition = sprite.getWorldPosition(new THREE.Vector3()).normalize();
    const cameraDirection = camera.position.clone().normalize();
    const visible = worldPosition.dot(cameraDirection) > 0.2;
    sprite.visible = visible;
    sprite.material.opacity = visible ? 0.72 : 0;
  });

  return (
    <sprite ref={ref} position={position} scale={scale}>
      <spriteMaterial map={texture} transparent depthTest depthWrite={false} opacity={0.72} />
    </sprite>
  );
}

function TravelDot({
  place,
  selected,
  onSelect,
}: {
  place: TravelWorldPlace;
  selected: boolean;
  onSelect: (place: TravelWorldPlace) => void;
}) {
  const ref = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const home = place.id === HOME_ID;
  const position = useMemo(() => latLngToVector3(place.lat, place.lng, EARTH_RADIUS + 0.022), [place.lat, place.lng]);

  useFrame(({ clock }) => {
    const group = ref.current;
    if (!group) return;
    const worldPosition = group.getWorldPosition(new THREE.Vector3()).normalize();
    const cameraDirection = camera.position.clone().normalize();
    group.visible = worldPosition.dot(cameraDirection) > 0.08;
    const pulse = home ? 1 + Math.sin(clock.elapsedTime * 1.8) * 0.14 : 1;
    group.scale.setScalar((selected ? 1.35 : 1) * pulse);
  });

  return (
    <group ref={ref} position={position}>
      {(home || selected) && (
        <mesh>
          <sphereGeometry args={[home ? 0.036 : 0.03, 18, 18]} />
          <meshBasicMaterial color="#dcc38a" transparent opacity={0.2} toneMapped={false} />
        </mesh>
      )}
      <mesh
        onClick={(event) => {
          event.stopPropagation();
          onSelect(place);
        }}
      >
        <sphereGeometry args={[home ? 0.018 : selected ? 0.017 : 0.0115, 16, 16]} />
        <meshBasicMaterial color={home || selected ? "#efd69a" : "#d6b46a"} toneMapped={false} />
      </mesh>
    </group>
  );
}

function TexturedEarth({
  selected,
  language,
  onSelect,
}: {
  selected: TravelWorldPlace | null;
  language: "cn" | "en";
  onSelect: (place: TravelWorldPlace) => void;
}) {
  const [colorMap, nightMap, bumpMap, boundaryMap] = useTexture([
    TEXTURES.color,
    TEXTURES.night,
    TEXTURES.bump,
    TEXTURES.boundaries,
  ]);
  const groupRef = useRef<THREE.Group>(null);
  const targetRotationRef = useRef({ x: THREE.MathUtils.degToRad(-8), y: THREE.MathUtils.degToRad(-114) });
  const autoUntilRef = useRef(0);

  const labels = useMemo(() => COUNTRY_LABELS.map((label) => ({
    ...label,
    texture: createLabelTexture(label.en, label.zh),
    position: latLngToVector3(label.lat, label.lng, EARTH_RADIUS + 0.055),
  })), []);

  useEffect(() => {
    [colorMap, nightMap].forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
    });
    [colorMap, nightMap, bumpMap, boundaryMap].forEach((texture) => {
      texture.anisotropy = 8;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
    });
  }, [colorMap, nightMap, bumpMap, boundaryMap]);

  useEffect(() => {
    const focus = selected ?? travelWorldPlaces.find((place) => place.id === HOME_ID);
    if (!focus) return;
    targetRotationRef.current = {
      x: THREE.MathUtils.degToRad(Math.max(-14, Math.min(10, -focus.lat * 0.14))),
      y: THREE.MathUtils.degToRad(-focus.lng),
    };
    autoUntilRef.current = performance.now() + 4200;
  }, [selected]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const target = targetRotationRef.current;
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, target.x, 0.035);
    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, target.y, 0.035);
    if (performance.now() > autoUntilRef.current) target.y += delta * 0.035;
  });

  return (
    <group
      ref={groupRef}
      rotation={[THREE.MathUtils.degToRad(-8), THREE.MathUtils.degToRad(-114), 0]}
      onPointerDown={() => {
        autoUntilRef.current = performance.now() + 4200;
      }}
    >
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
        <meshStandardMaterial
          map={colorMap}
          bumpMap={bumpMap}
          bumpScale={0.028}
          emissiveMap={nightMap}
          emissive={new THREE.Color("#d6b46a")}
          emissiveIntensity={0.06}
          roughness={0.76}
          metalness={0.03}
          color="#7a8078"
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[EARTH_RADIUS + 0.006, 64, 64]} />
        <meshBasicMaterial map={boundaryMap} transparent opacity={0.28} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[EARTH_RADIUS + 0.032, 64, 64]} />
        <meshBasicMaterial color="#7ca6b2" transparent opacity={0.075} blending={THREE.AdditiveBlending} side={THREE.BackSide} depthWrite={false} />
      </mesh>
      {labels.map((label) => (
        <VisibleSprite
          key={label.en}
          position={label.position}
          texture={label.texture}
          scale={[0.38, 0.14, 1]}
        />
      ))}
      {travelWorldPlaces.map((place) => (
        <TravelDot key={place.id} place={place} selected={selected?.id === place.id} onSelect={onSelect} />
      ))}
    </group>
  );
}

function EarthLights() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <hemisphereLight color="#d7e4e3" groundColor="#050607" intensity={0.68} />
      <directionalLight position={[-3.2, 2.6, 3.6]} intensity={2.2} color="#f1f2ed" />
      <directionalLight position={[3.8, 0.8, -3.2]} intensity={0.85} color="#7aa1b4" />
      <pointLight position={[-2.4, -1.8, 2.2]} intensity={0.55} color="#d6b46a" distance={5.4} />
    </>
  );
}

export default function LightweightEarthViewer({
  selected,
  language,
  onSelect,
}: {
  selected: TravelWorldPlace | null;
  language: "cn" | "en";
  onSelect: (place: TravelWorldPlace) => void;
}) {
  return (
    <div className="earth-lightweight-stage" aria-label={language === "cn" ? "Leo 的轻量真实纹理地球" : "Leo's lightweight textured Earth"}>
      <Suspense
        fallback={
          <div className="earth-lightweight-loading">
            <span>MY WORLD</span>
            <b>LOADING EARTH...</b>
          </div>
        }
      >
        <Canvas
          className="earth-lightweight-canvas"
          camera={{ position: [0, 0.16, 4.35], fov: 36, near: 0.1, far: 80 }}
          dpr={[1, 1.7]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        >
          <color attach="background" args={["#020405"]} />
          <EarthLights />
          <TexturedEarth selected={selected} language={language} onSelect={onSelect} />
          <OrbitControls
            enablePan={false}
            enableDamping
            dampingFactor={0.075}
            rotateSpeed={0.56}
            zoomSpeed={0.55}
            minDistance={2.65}
            maxDistance={5.2}
          />
        </Canvas>
      </Suspense>
      <div className="earth-lightweight-caption">TEXTURED EARTH · HONG KONG AS ORIGIN</div>
    </div>
  );
}
