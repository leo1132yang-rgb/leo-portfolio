"use client";

import { Html } from "@react-three/drei";
import { useState } from "react";
import type { TravelRecord } from "@/data/travelData";

export function latLngToVector(lat: number, lng: number, radius = 1.52) {
  const latitude = (lat * Math.PI) / 180;
  const longitude = (lng * Math.PI) / 180;
  return [
    radius * Math.cos(latitude) * Math.cos(longitude),
    radius * Math.sin(latitude),
    -radius * Math.cos(latitude) * Math.sin(longitude),
  ] as [number, number, number];
}

export function TravelMarker({
  record,
  active,
  onSelect,
}: {
  record: TravelRecord;
  active: boolean;
  onSelect: (record: TravelRecord) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const position = latLngToVector(record.lat, record.lng);

  return (
    <group position={position}>
      <mesh
        onClick={(event) => {
          event.stopPropagation();
          onSelect(record);
        }}
        onPointerEnter={(event) => {
          event.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerLeave={() => {
          setHovered(false);
          document.body.style.cursor = "";
        }}
      >
        <sphereGeometry args={[active ? 0.035 : 0.026, 18, 18]} />
        <meshStandardMaterial
          color={active ? "#f0c27b" : "#d7a85d"}
          emissive={active ? "#f0b65d" : "#96703d"}
          emissiveIntensity={active ? 1.8 : 0.9}
          roughness={0.36}
        />
      </mesh>
      <mesh scale={active ? 1.45 : 1.1}>
        <sphereGeometry args={[0.047, 18, 18]} />
        <meshBasicMaterial color="#56c9ee" transparent opacity={active ? 0.16 : 0.07} depthWrite={false} />
      </mesh>
      {(hovered || active) && (
        <Html center distanceFactor={2.2} position={[0, 0.09, 0]} className="travel-marker-label">
          <span>{record.city}</span>
        </Html>
      )}
    </group>
  );
}
