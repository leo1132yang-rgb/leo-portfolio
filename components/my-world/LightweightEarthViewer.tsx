"use client";

import { OrbitControls, useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { travelWorldPlaces, type TravelWorldPlace } from "@/data/travelWorld";

const HOME_ID = "hong-kong";
const EARTH_RADIUS = 1.55;
const TEXTURES = {
  color: "/room/world/textures/earth-nasa-blue-marble-2k.webp",
  night: "/room/world/textures/earth-night-2k.webp",
  bump: "/room/world/textures/earth-bump-2k.webp",
  boundaries: "/room/world/textures/country-boundaries-aligned.png",
};

const COUNTRY_LABELS = [
  { en: "RUSSIA", zh: "俄罗斯", lat: 60.0, lng: 92.0 },
  { en: "MONGOLIA", zh: "蒙古", lat: 46.8, lng: 103.8 },
  { en: "CHINA", zh: "中国", lat: 35.8, lng: 104.2 },
  { en: "JAPAN", zh: "日本", lat: 37.5, lng: 138.2 },
  { en: "THAILAND", zh: "泰国", lat: 15.8, lng: 101.0 },
  { en: "INDIA", zh: "印度", lat: 21.1, lng: 78.9 },
  { en: "MALAYSIA", zh: "马来西亚", lat: 4.2, lng: 102.0 },
  { en: "MALDIVES", zh: "马尔代夫", lat: 3.2, lng: 73.2 },
  { en: "INDONESIA", zh: "印尼", lat: -2.5, lng: 118.0 },
  { en: "AUSTRALIA", zh: "澳大利亚", lat: -25.2, lng: 133.8 },
  { en: "UNITED STATES", zh: "美国", lat: 39.4, lng: -98.5 },
];

function latLngToVector3(lat: number, lng: number, radius = EARTH_RADIUS) {
  // Standard equirectangular: u=(lng+180)/360, v=(lat+90)/180.
  // Matches unmodified SphereGeometry UVs: Greenwich +X, east toward -Z.
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lng);
  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    -radius * Math.sin(phi) * Math.sin(theta),
  );
}

// Bring a longitude to the +Z camera using the group, never texture offsets.
const longitudeFacingCamera = (lng: number) => THREE.MathUtils.degToRad(-90 - lng);

function createLabelTexture(en: string, zh: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 92;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.shadowColor = "rgba(0,0,0,.62)";
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 2;
  ctx.fillStyle = "rgba(246,248,244,.82)";
  ctx.font = "500 24px Arial, sans-serif";
  ctx.fillText(en, 18, 34);
  ctx.fillStyle = "rgba(246,248,244,.62)";
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
  interactionVersion,
  onSelect,
}: {
  selected: TravelWorldPlace | null;
  language: "cn" | "en";
  interactionVersion: number;
  onSelect: (place: TravelWorldPlace) => void;
}) {
  const [colorMap, nightMap, bumpMap, boundaryMap] = useTexture([
    TEXTURES.color,
    TEXTURES.night,
    TEXTURES.bump,
    TEXTURES.boundaries,
  ]);
  const groupRef = useRef<THREE.Group>(null);
  const targetRotationRef = useRef({ x: THREE.MathUtils.degToRad(-8), y: longitudeFacingCamera(114) });
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
      texture.flipY = true;
      texture.offset.set(0, 0);
      texture.repeat.set(1, 1);
      texture.rotation = 0;
      texture.needsUpdate = true;
    });
  }, [colorMap, nightMap, bumpMap, boundaryMap]);

  useEffect(() => {
    const focus = selected ?? travelWorldPlaces.find((place) => place.id === HOME_ID);
    if (!focus) return;
    targetRotationRef.current = {
      x: THREE.MathUtils.degToRad(Math.max(-14, Math.min(10, -focus.lat * 0.14))),
      y: longitudeFacingCamera(focus.lng),
    };
    autoUntilRef.current = performance.now() + 4200;
  }, [selected]);

  useEffect(() => {
    if (interactionVersion > 0) {
      autoUntilRef.current = performance.now() + 4200;
    }
  }, [interactionVersion]);

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
      rotation={[THREE.MathUtils.degToRad(-8), longitudeFacingCamera(114), 0]}
      onPointerDown={() => {
        autoUntilRef.current = performance.now() + 4200;
      }}
    >
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
        <meshStandardMaterial
          map={colorMap}
          bumpMap={bumpMap}
          bumpScale={0.018}
          emissiveMap={nightMap}
          emissive={new THREE.Color("#d6b46a")}
          emissiveIntensity={0.035}
          roughness={0.54}
          metalness={0.015}
          color="#ffffff"
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[EARTH_RADIUS + 0.006, 64, 64]} />
        <meshBasicMaterial map={boundaryMap} transparent opacity={0.34} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[EARTH_RADIUS + 0.046, 64, 64]} />
        <meshBasicMaterial color="#b8e4ff" transparent opacity={0.13} blending={THREE.AdditiveBlending} side={THREE.BackSide} depthWrite={false} />
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
      <ambientLight intensity={0.82} />
      <hemisphereLight color="#e9f6ff" groundColor="#121824" intensity={1.05} />
      <directionalLight position={[-3.2, 2.8, 3.8]} intensity={2.65} color="#fff8ea" />
      <directionalLight position={[3.8, 1.1, -3.2]} intensity={1.05} color="#9ed7ff" />
      <pointLight position={[-2.4, -1.8, 2.2]} intensity={0.42} color="#d6b46a" distance={5.4} />
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
  const [interactionVersion, setInteractionVersion] = useState(0);
  const noteInteraction = () => setInteractionVersion((value) => value + 1);

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
          <TexturedEarth selected={selected} language={language} interactionVersion={interactionVersion} onSelect={onSelect} />
          <OrbitControls
            enablePan={false}
            enableDamping
            dampingFactor={0.075}
            rotateSpeed={0.56}
            zoomSpeed={0.55}
            minDistance={2.65}
            maxDistance={5.2}
            onStart={noteInteraction}
            onEnd={noteInteraction}
          />
        </Canvas>
      </Suspense>
      <div className="earth-lightweight-caption">TEXTURED EARTH · HONG KONG AS ORIGIN</div>
    </div>
  );
}
