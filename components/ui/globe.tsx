"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls, Stars } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  CanvasTexture,
  Color,
  Group,
  LinearFilter,
  MathUtils,
  SRGBColorSpace,
  Vector3,
} from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { TravelWorldArc, TravelWorldPlace } from "@/data/travelWorld";

type GlobeConfig = {
  pointSize?: number;
  globeColor?: string;
  showAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereAltitude?: number;
  emissive?: string;
  emissiveIntensity?: number;
  shininess?: number;
  polygonColor?: string;
  ambientLight?: string;
  directionalLeftLight?: string;
  directionalTopLight?: string;
  pointLight?: string;
  arcTime?: number;
  arcLength?: number;
  rings?: number;
  maxRings?: number;
  initialPosition?: { lat: number; lng: number };
  autoRotate?: boolean;
  autoRotateSpeed?: number;
};

export type WorldProps = {
  data: TravelWorldArc[];
  globeConfig: GlobeConfig;
  places?: TravelWorldPlace[];
  selectedId?: string | null;
  language?: "cn" | "en";
  onPlaceClick?: (place: TravelWorldPlace) => void;
};

const RADIUS = 1.5;

export function latLngToVector(lat: number, lng: number, radius = RADIUS) {
  const phi = MathUtils.degToRad(90 - lat);
  const theta = MathUtils.degToRad(lng + 180);
  return new Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function makeGlobeTexture(color: string, polygonColor: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 1600;
  canvas.height = 800;
  const context = canvas.getContext("2d")!;
  const base = context.createLinearGradient(0, 0, 0, canvas.height);
  base.addColorStop(0, color);
  base.addColorStop(.52, "#08151c");
  base.addColorStop(1, "#03070d");
  context.fillStyle = base;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const mapPoint = ([lng, lat]: [number, number]) => [((lng + 180) / 360) * canvas.width, ((90 - lat) / 180) * canvas.height];
  const continents: Array<Array<[number, number]>> = [
    [[-168,72],[-140,68],[-124,52],[-130,35],[-112,22],[-97,15],[-82,25],[-67,45],[-60,58],[-82,72],[-120,75]],
    [[-81,12],[-70,4],[-64,-16],[-55,-33],[-68,-55],[-78,-38],[-81,-8]],
    [[-17,36],[4,44],[30,37],[45,12],[42,-12],[28,-35],[10,-35],[-5,-5]],
    [[-10,72],[25,70],[48,58],[72,60],[105,76],[145,64],[170,54],[153,35],[126,29],[116,7],[95,6],[79,23],[58,25],[42,42],[22,34],[5,45]],
    [[112,-10],[153,-12],[161,-31],[145,-44],[117,-35]],
    [[-52,84],[-18,80],[-28,62],[-48,60]],
  ];

  continents.forEach((shape) => {
    context.beginPath();
    shape.forEach((point, index) => {
      const [x, y] = mapPoint(point);
      if (index === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    });
    context.closePath();
    context.fillStyle = polygonColor;
    context.fill();
    context.strokeStyle = "rgba(228,209,161,.16)";
    context.lineWidth = 1.2;
    context.stroke();
  });

  context.strokeStyle = "rgba(255,255,255,.035)";
  context.lineWidth = 1;
  for (let lng = -180; lng <= 180; lng += 20) {
    const x = ((lng + 180) / 360) * canvas.width;
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, canvas.height);
    context.stroke();
  }
  for (let lat = -80; lat <= 80; lat += 20) {
    const y = ((90 - lat) / 180) * canvas.height;
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(canvas.width, y);
    context.stroke();
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  return texture;
}

function buildArcPositions(arc: TravelWorldArc) {
  const start = latLngToVector(arc.startLat, arc.startLng);
  const end = latLngToVector(arc.endLat, arc.endLng);
  const points: number[] = [];
  for (let i = 0; i <= 54; i += 1) {
    const t = i / 54;
    const point = start.clone().lerp(end, t).normalize().multiplyScalar(RADIUS + Math.sin(Math.PI * t) * arc.arcAlt);
    points.push(point.x, point.y, point.z);
  }
  return new Float32Array(points);
}

function ArcLine({ arc }: { arc: TravelWorldArc }) {
  const positions = useMemo(() => buildArcPositions(arc), [arc]);
  return (
    <line>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color={arc.color} transparent opacity={.64} />
    </line>
  );
}

function PlaceMarker({ place, selected, pointSize, language, onClick }: {
  place: TravelWorldPlace;
  selected: boolean;
  pointSize: number;
  language: "cn" | "en";
  onClick?: (place: TravelWorldPlace) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const position = useMemo(() => latLngToVector(place.lat, place.lng, RADIUS + .035), [place.lat, place.lng]);
  const label = language === "cn" ? place.nameZh : place.nameEn.toUpperCase();
  return (
    <group position={position}>
      <mesh
        scale={selected ? 1.32 : hovered ? 1.16 : 1}
        onClick={(event) => {
          event.stopPropagation();
          onClick?.(place);
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "";
        }}
      >
        <sphereGeometry args={[pointSize * .007, 20, 20]} />
        <meshBasicMaterial color={selected ? "#f4e7c8" : "#d6b46a"} />
      </mesh>
      <mesh scale={selected ? 1.3 : 1}>
        <sphereGeometry args={[pointSize * .014, 20, 20]} />
        <meshBasicMaterial color={selected ? "#e4d1a1" : "#6ea6b8"} transparent opacity={selected ? .16 : .08} blending={AdditiveBlending} depthWrite={false} />
      </mesh>
      {(hovered || selected) && (
        <Html center distanceFactor={7.5} position={[0, .1, 0]} className="world-marker-label">
          <span>{label}<small>{place.date.split(" / ")[0]}</small></span>
        </Html>
      )}
    </group>
  );
}

function WorldScene({ data, globeConfig, places = [], selectedId, language = "cn", onPlaceClick }: WorldProps) {
  const group = useRef<Group>(null);
  const controls = useRef<OrbitControlsImpl>(null);
  const restoreTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [autoRotate, setAutoRotate] = useState(globeConfig.autoRotate ?? true);
  const texture = useMemo(() => makeGlobeTexture(globeConfig.globeColor ?? "#07131f", globeConfig.polygonColor ?? "rgba(255,255,255,.5)"), [globeConfig.globeColor, globeConfig.polygonColor]);

  useEffect(() => () => {
    if (restoreTimer.current) clearTimeout(restoreTimer.current);
    document.body.style.cursor = "";
  }, []);

  useFrame((_, delta) => {
    if (!group.current || controls.current?.enabled === false) return;
    if (autoRotate && !controls.current) group.current.rotation.y += delta * .05;
  });

  const pauseAutoRotate = () => {
    setAutoRotate(false);
    if (restoreTimer.current) clearTimeout(restoreTimer.current);
  };
  const scheduleAutoRotate = () => {
    if (restoreTimer.current) clearTimeout(restoreTimer.current);
    restoreTimer.current = setTimeout(() => setAutoRotate(globeConfig.autoRotate ?? true), 3800);
  };

  const initial = globeConfig.initialPosition ?? { lat: 22.3193, lng: 114.1694 };
  const initialRotationY = MathUtils.degToRad(90 - initial.lng);
  const initialRotationX = MathUtils.degToRad(initial.lat * .22);

  return (
    <>
      <color attach="background" args={[new Color("#03060b")]} />
      <ambientLight intensity={1.05} color={globeConfig.ambientLight ?? "#6ea6b8"} />
      <directionalLight position={[-4, 2.4, 3]} intensity={1.4} color={globeConfig.directionalLeftLight ?? "#f1e3ca"} />
      <directionalLight position={[1, 5, 2]} intensity={1.1} color={globeConfig.directionalTopLight ?? "#d8ecf3"} />
      <pointLight position={[3, 1.2, 2.2]} intensity={1.1} color={globeConfig.pointLight ?? "#e4d1a1"} />
      <Stars radius={16} depth={8} count={360} factor={1} saturation={0.18} fade speed={0.08} />
      <group ref={group} rotation={[initialRotationX, initialRotationY, 0]}>
        <mesh>
          <sphereGeometry args={[RADIUS, 96, 96]} />
          <meshPhongMaterial
            map={texture}
            color={globeConfig.globeColor ?? "#07131f"}
            emissive={globeConfig.emissive ?? "#07131f"}
            emissiveIntensity={globeConfig.emissiveIntensity ?? .1}
            shininess={(globeConfig.shininess ?? .82) * 28}
          />
        </mesh>
        {globeConfig.showAtmosphere && (
          <mesh scale={1 + (globeConfig.atmosphereAltitude ?? .1)}>
            <sphereGeometry args={[RADIUS, 72, 72]} />
            <meshBasicMaterial color={globeConfig.atmosphereColor ?? "#fff7e8"} transparent opacity={.055} blending={AdditiveBlending} depthWrite={false} />
          </mesh>
        )}
        {data.map((arc, index) => <ArcLine key={`${arc.order}-${index}-${arc.endLat}-${arc.endLng}`} arc={arc} />)}
        {places.map((place) => (
          <PlaceMarker
            key={place.id}
            place={place}
            selected={selectedId === place.id}
            pointSize={globeConfig.pointSize ?? 3.5}
            language={language}
            onClick={onPlaceClick}
          />
        ))}
      </group>
      <OrbitControls
        ref={controls}
        enablePan={false}
        enableDamping
        dampingFactor={.06}
        minDistance={2.85}
        maxDistance={4.85}
        rotateSpeed={.48}
        zoomSpeed={.55}
        autoRotate={autoRotate}
        autoRotateSpeed={globeConfig.autoRotateSpeed ?? .32}
        onStart={pauseAutoRotate}
        onEnd={scheduleAutoRotate}
      />
    </>
  );
}

export function World(props: WorldProps) {
  return (
    <Canvas camera={{ position: [0, .18, 4.05], fov: 43 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: false }}>
      <WorldScene {...props} />
    </Canvas>
  );
}
