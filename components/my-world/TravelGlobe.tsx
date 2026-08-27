"use client";

import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  CanvasTexture,
  Color,
  LinearFilter,
  MathUtils,
  Mesh,
  SRGBColorSpace,
  Vector3,
} from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { TravelRecord } from "@/data/travelData";
import { latLngToVector, TravelMarker } from "./TravelMarker";

type PickedCoordinates = { lat: number; lng: number };

function makeEarthTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1536;
  canvas.height = 768;
  const context = canvas.getContext("2d")!;
  const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#12354a");
  gradient.addColorStop(0.5, "#0a293c");
  gradient.addColorStop(1, "#071d2d");
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const continents: Array<Array<[number, number]>> = [
    [[-168,72],[-140,68],[-124,52],[-130,35],[-112,22],[-97,15],[-82,25],[-67,45],[-60,58],[-82,72],[-120,75]],
    [[-81,12],[-70,4],[-64,-16],[-55,-33],[-68,-55],[-78,-38],[-81,-8]],
    [[-17,36],[4,44],[30,37],[45,12],[42,-12],[28,-35],[10,-35],[-5,-5]],
    [[-10,72],[25,70],[48,58],[72,60],[105,76],[145,64],[170,54],[153,35],[126,29],[116,7],[95,6],[79,23],[58,25],[42,42],[22,34],[5,45]],
    [[112,-10],[153,-12],[161,-31],[145,-44],[117,-35]],
    [[-52,84],[-18,80],[-28,62],[-48,60]],
  ];
  const mapPoint = ([lng, lat]: [number, number]) => [((lng + 180) / 360) * canvas.width, ((90 - lat) / 180) * canvas.height];
  continents.forEach((shape, index) => {
    context.beginPath();
    shape.forEach((point, pointIndex) => {
      const [x, y] = mapPoint(point);
      if (pointIndex === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    });
    context.closePath();
    context.fillStyle = index % 2 ? "#2a5558" : "#244d56";
    context.fill();
    context.strokeStyle = "rgba(127,190,203,.16)";
    context.lineWidth = 2;
    context.stroke();
  });

  context.strokeStyle = "rgba(126,184,205,.055)";
  context.lineWidth = 1;
  for (let lng = -180; lng <= 180; lng += 15) {
    const x = ((lng + 180) / 360) * canvas.width;
    context.beginPath(); context.moveTo(x, 0); context.lineTo(x, canvas.height); context.stroke();
  }
  for (let lat = -75; lat <= 75; lat += 15) {
    const y = ((90 - lat) / 180) * canvas.height;
    context.beginPath(); context.moveTo(0, y); context.lineTo(canvas.width, y); context.stroke();
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  return texture;
}

function coordinatesFromPoint(point: Vector3): PickedCoordinates {
  const normalized = point.clone().normalize();
  const lat = MathUtils.radToDeg(Math.asin(normalized.y));
  const lng = MathUtils.radToDeg(Math.atan2(-normalized.z, normalized.x));
  return { lat: Number(lat.toFixed(4)), lng: Number(lng.toFixed(4)) };
}

function GlobeScene({ records, selectedId, editing, onSelect, onPick }: {
  records: TravelRecord[];
  selectedId: string | null;
  editing: boolean;
  onSelect: (record: TravelRecord) => void;
  onPick: (coordinates: PickedCoordinates) => void;
}) {
  const texture = useMemo(makeEarthTexture, []);
  const globe = useRef<Mesh>(null);
  const controls = useRef<OrbitControlsImpl>(null);
  const focusTarget = useRef<Vector3 | null>(null);
  const { camera, size } = useThree();
  const narrow = size.width / size.height < 0.8;

  useEffect(() => {
    if (!selectedId) {
      focusTarget.current = null;
      camera.position.set(0, narrow ? 0.2 : 0.3, narrow ? 5.9 : 4.35);
      camera.lookAt(0, 0, 0);
      controls.current?.update();
      return;
    }
    const record = records.find((item) => item.id === selectedId);
    if (!record) return;
    const [x, y, z] = latLngToVector(record.lat, record.lng, narrow ? 5.45 : 4.05);
    focusTarget.current = new Vector3(x, y, z);
  }, [camera, narrow, records, selectedId]);

  useFrame(() => {
    if (!focusTarget.current) return;
    camera.position.lerp(focusTarget.current, 0.055);
    camera.lookAt(0, 0, 0);
    controls.current?.update();
    if (camera.position.distanceTo(focusTarget.current) < 0.015) focusTarget.current = null;
  });

  return (
    <>
      <color attach="background" args={[new Color("#030810")]} />
      <ambientLight intensity={1.2} />
      <directionalLight position={[4, 3, 4]} intensity={2.1} color="#9ad6e8" />
      <directionalLight position={[-4, -1, -3]} intensity={0.7} color="#d39a54" />
      <Stars radius={18} depth={8} count={520} factor={1.2} saturation={0.25} fade speed={0.15} />
      <group>
        <mesh ref={globe} onClick={(event: ThreeEvent<MouseEvent>) => editing && onPick(coordinatesFromPoint(event.point))}>
          <sphereGeometry args={[1.5, 96, 96]} />
          <meshStandardMaterial map={texture} emissive="#0b2834" emissiveMap={texture} emissiveIntensity={0.66} roughness={0.68} metalness={0.06} />
        </mesh>
        <mesh scale={1.025}>
          <sphereGeometry args={[1.5, 72, 72]} />
          <meshBasicMaterial color="#4da6ff" transparent opacity={0.055} blending={AdditiveBlending} depthWrite={false} />
        </mesh>
        {records.map((record) => (
          <TravelMarker key={record.id} record={record} active={selectedId === record.id} onSelect={onSelect} />
        ))}
      </group>
      <OrbitControls
        ref={controls}
        enablePan={false}
        enableDamping
        dampingFactor={0.055}
        minDistance={narrow ? 4.35 : 2.75}
        maxDistance={narrow ? 6.5 : 4.8}
        minPolarAngle={0.25}
        maxPolarAngle={Math.PI - 0.25}
        rotateSpeed={0.48}
        zoomSpeed={0.55}
        autoRotate={!selectedId}
        autoRotateSpeed={0.2}
      />
    </>
  );
}

export function TravelGlobe(props: {
  records: TravelRecord[];
  selectedId: string | null;
  editing: boolean;
  onSelect: (record: TravelRecord) => void;
  onPick: (coordinates: PickedCoordinates) => void;
}) {
  return (
    <div className={`travel-globe ${props.editing ? "is-picking" : ""}`}>
      <Canvas camera={{ position: [0, 0.3, 4.35], fov: 42 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: false }}>
        <GlobeScene {...props} />
      </Canvas>
      <div className="travel-globe__hint">{props.editing ? "CLICK THE GLOBE TO PICK COORDINATES" : "DRAG TO EXPLORE · SCROLL TO ZOOM"}</div>
    </div>
  );
}
