"use client";

import { OrbitControls, useGLTF, useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { travelWorldPlaces, type TravelWorldPlace } from "@/data/travelWorld";

const EARTH_MODEL = "/room/world/earth.glb";
const EARTH_TEXTURES = {
  color: "/room/world/textures/earth-color.webp",
  night: "/room/world/textures/earth-night.webp",
  clouds: "/room/world/textures/earth-clouds.webp",
  bump: "/room/world/textures/earth-bump.webp",
};

const MODEL_RADIUS = 135;
const EARTH_RADIUS = 1.48;
const MODEL_SCALE = EARTH_RADIUS / MODEL_RADIUS;
const HOME_ID = "hong-kong";

function latLngToVector3(lat: number, lng: number, radius = EARTH_RADIUS + 0.035) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lng);
  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.sin(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.cos(theta),
  );
}

function EarthAsset({
  selected,
  onSelect,
}: {
  selected: TravelWorldPlace | null;
  onSelect: (place: TravelWorldPlace) => void;
}) {
  const gltf = useGLTF(EARTH_MODEL);
  const [colorMap, nightMap, cloudsMap, bumpMap] = useTexture([
    EARTH_TEXTURES.color,
    EARTH_TEXTURES.night,
    EARTH_TEXTURES.clouds,
    EARTH_TEXTURES.bump,
  ]);
  const groupRef = useRef<THREE.Group>(null);
  const pauseUntilRef = useRef(0);
  const targetRotationRef = useRef({
    x: THREE.MathUtils.degToRad(-4),
    y: THREE.MathUtils.degToRad(-114.1694),
  });

  const scene = useMemo(() => {
    const clone = gltf.scene.clone(true);
    colorMap.colorSpace = THREE.SRGBColorSpace;
    nightMap.colorSpace = THREE.SRGBColorSpace;
    cloudsMap.colorSpace = THREE.SRGBColorSpace;
    [colorMap, nightMap, cloudsMap, bumpMap].forEach((texture) => {
      texture.anisotropy = 8;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
    });

    clone.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.castShadow = true;
      child.receiveShadow = true;
      const name = child.name.toLowerCase();

      if (name.includes("cloud")) {
        child.material = new THREE.MeshStandardMaterial({
          name: "clouds",
          map: cloudsMap,
          alphaMap: cloudsMap,
          transparent: true,
          opacity: 0.18,
          roughness: 0.9,
          metalness: 0,
          depthWrite: false,
        });
        child.scale.multiplyScalar(1.006);
        return;
      }

      if (name.includes("atmosphere")) {
        child.material = new THREE.MeshBasicMaterial({
          name: "atmosphere",
          color: "#7aa7b5",
          transparent: true,
          opacity: 0.12,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          side: THREE.BackSide,
        });
        child.scale.multiplyScalar(1.018);
        return;
      }

      child.material = new THREE.MeshStandardMaterial({
        name: "earth",
        map: colorMap,
        bumpMap,
        bumpScale: 0.045,
        emissiveMap: nightMap,
        emissive: new THREE.Color("#d6b46a"),
        emissiveIntensity: 0.08,
        color: "#46504b",
        roughness: 0.72,
        metalness: 0.06,
      });
    });

    return clone;
  }, [gltf.scene, colorMap, nightMap, cloudsMap, bumpMap]);

  useEffect(() => {
    const place = selected ?? travelWorldPlaces.find((item) => item.id === HOME_ID);
    if (!place) return;
    targetRotationRef.current = {
      x: THREE.MathUtils.degToRad(Math.max(-12, Math.min(8, -place.lat * 0.12))),
      y: THREE.MathUtils.degToRad(-place.lng),
    };
    pauseUntilRef.current = performance.now() + 4200;
  }, [selected]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const target = targetRotationRef.current;
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, target.x, 0.035);
    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, target.y, 0.035);

    if (performance.now() > pauseUntilRef.current) {
      target.y += delta * 0.045;
    }
  });

  return (
    <group
      ref={groupRef}
      rotation={[THREE.MathUtils.degToRad(-4), THREE.MathUtils.degToRad(-114.1694), 0]}
      onPointerDown={() => {
        pauseUntilRef.current = performance.now() + 4200;
      }}
    >
      <primitive object={scene} scale={MODEL_SCALE} />
      {travelWorldPlaces.map((place) => {
        const active = selected?.id === place.id;
        const home = place.id === HOME_ID;
        const position = latLngToVector3(place.lat, place.lng);
        return (
          <group key={place.id} position={position}>
            {(active || home) && (
              <mesh>
                <sphereGeometry args={[home ? 0.028 : 0.023, 24, 24]} />
                <meshBasicMaterial color={home ? "#edd398" : "#d6b46a"} transparent opacity={0.22} />
              </mesh>
            )}
            <mesh
              onClick={(event) => {
                event.stopPropagation();
                pauseUntilRef.current = performance.now() + 5000;
                onSelect(place);
              }}
            >
              <sphereGeometry args={[home ? 0.018 : active ? 0.017 : 0.012, 18, 18]} />
              <meshBasicMaterial color={home || active ? "#edd398" : "#d6b46a"} toneMapped={false} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function EarthLights() {
  return (
    <>
      <ambientLight intensity={0.52} />
      <hemisphereLight color="#b7cdd4" groundColor="#080808" intensity={0.64} />
      <directionalLight position={[-3.8, 3.2, 4.2]} intensity={2.6} color="#eef5f4" castShadow />
      <directionalLight position={[3.8, 0.2, -3.5]} intensity={1.25} color="#5f8fa4" />
      <pointLight position={[-2.8, -1.8, 2.4]} intensity={1.05} color="#d6b46a" distance={5.5} />
    </>
  );
}

function EarthScene({
  selected,
  onSelect,
}: {
  selected: TravelWorldPlace | null;
  onSelect: (place: TravelWorldPlace) => void;
}) {
  return (
    <Canvas
      className="earth-model-canvas"
      camera={{ position: [0, 0.24, 4.25], fov: 38, near: 0.1, far: 100 }}
      shadows
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#020405"]} />
      <EarthLights />
      <Suspense fallback={null}>
        <EarthAsset selected={selected} onSelect={onSelect} />
      </Suspense>
      <OrbitControls
        enablePan={false}
        enableDamping
        dampingFactor={0.06}
        rotateSpeed={0.56}
        zoomSpeed={0.55}
        minDistance={2.55}
        maxDistance={5.15}
      />
    </Canvas>
  );
}

export default function EarthModelViewer({
  selected,
  language,
  onSelect,
}: {
  selected: TravelWorldPlace | null;
  language: "cn" | "en";
  onSelect: (place: TravelWorldPlace) => void;
}) {
  return (
    <div className="earth-model-stage" aria-label={language === "cn" ? "Leo 的 3D 地球旅行地图" : "Leo's 3D earth travel map"}>
      <Suspense
        fallback={
          <div className="earth-model-loading">
            <span>MY WORLD</span>
            <b>LOADING EARTH...</b>
          </div>
        }
      >
        <EarthScene selected={selected} onSelect={onSelect} />
      </Suspense>
      <div className="earth-model-caption">SCULPTURAL EARTH · HONG KONG AS ORIGIN</div>
    </div>
  );
}

useGLTF.preload(EARTH_MODEL);
