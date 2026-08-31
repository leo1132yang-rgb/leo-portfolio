"use client";

import { Html, useTexture } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { ChildhoodStoryId } from "@/data/childhoodStories";
import type { LeoRoomFocusId } from "@/data/leoRoomCamera";
import { ROOM_LAYOUT } from "@/data/leoRoomDimensions";
import { PHOTO_WALL_AREA, photoWallDisplay, photoWallImages, type PhotoWallFrameStyle, type PhotoWallImage } from "@/data/photoWall";

type WallDisplaysProps = {
  onFocus: (id: LeoRoomFocusId) => void;
  onChildhoodActivate?: (id: ChildhoodStoryId) => void;
  onPhotoSelect?: (photo: PhotoWallImage) => void;
  photoLightboxEnabled?: boolean;
};

const selectedWallPhotos = photoWallDisplay.map((slot) => {
  const photo = photoWallImages.find((item) => item.id === slot.photoId);
  if (!photo) throw new Error(`Photo wall image not found: ${slot.photoId}`);
  return { slot, photo };
});

const photoPaths = selectedWallPhotos.map(({ photo }) => photo.thumbnailSrc);

const frameMaterials: Record<PhotoWallFrameStyle, { color: string; metalness: number; roughness: number }> = {
  walnut: { color: "#5d3b28", metalness: .04, roughness: .68 },
  black: { color: "#151719", metalness: .2, roughness: .58 },
  metal: { color: "#4d4438", metalness: .52, roughness: .4 },
};

function useInteractiveWall(onActivate: () => void) {
  const [hovered, setHovered] = useState(false);
  const pointerRef = useRef<{ x: number; y: number; dragged: boolean } | null>(null);
  const handlers = {
    onPointerDown: (event: ThreeEvent<PointerEvent>) => {
      pointerRef.current = { x: event.nativeEvent.clientX, y: event.nativeEvent.clientY, dragged: false };
    },
    onPointerMove: (event: ThreeEvent<PointerEvent>) => {
      const start = pointerRef.current;
      if (!start) return;
      const dx = event.nativeEvent.clientX - start.x;
      const dy = event.nativeEvent.clientY - start.y;
      if (Math.hypot(dx, dy) > 8) start.dragged = true;
    },
    onPointerOver: (event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation();
      setHovered(true);
    },
    onPointerOut: (event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation();
      setHovered(false);
    },
    onClick: (event: ThreeEvent<MouseEvent>) => {
      event.stopPropagation();
      if (pointerRef.current?.dragged) return;
      onActivate();
    },
  };
  return { hovered, handlers };
}

function JourneyBoard({ onFocus, onChildhoodActivate }: WallDisplaysProps) {
  const { hovered, handlers } = useInteractiveWall(() => {
    if (onChildhoodActivate) {
      onChildhoodActivate("01");
      return;
    }
    onFocus("journey");
  });
  const posterTexture = useTexture("/room/childhood-wall/childhood-entry.png") as THREE.Texture;

  useEffect(() => {
    posterTexture.colorSpace = THREE.SRGBColorSpace;
    posterTexture.anisotropy = 4;
    posterTexture.needsUpdate = true;
  }, [posterTexture]);

  return (
    <group position={ROOM_LAYOUT.journey.position} scale={ROOM_LAYOUT.journey.scale} rotation={[0, Math.PI / 2, 0]} {...handlers}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[5.55, 3.7, .17]} />
        <meshStandardMaterial color="#111514" roughness={.94} metalness={.02} />
      </mesh>
      <mesh position={[0, 0, .098]}>
        <planeGeometry args={[5.28, 3.43]} />
        <meshBasicMaterial map={posterTexture} toneMapped={false} color={hovered ? "#ffffff" : "#f6efe3"} />
      </mesh>
      <mesh position={[0, 0, .235]} {...handlers}>
        <planeGeometry args={[5.34, 3.49]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <group position={[0, 0, .19]}>
        <mesh position={[0, 1.78, 0]}><boxGeometry args={[5.68, .065, .065]} /><meshStandardMaterial color="#9c6c3e" metalness={.52} roughness={.38} /></mesh>
        <mesh position={[0, -1.78, 0]}><boxGeometry args={[5.68, .065, .065]} /><meshStandardMaterial color="#9c6c3e" metalness={.52} roughness={.38} /></mesh>
        <mesh position={[-2.73, 0, 0]}><boxGeometry args={[.065, 3.62, .065]} /><meshStandardMaterial color="#7f5735" metalness={.5} roughness={.4} /></mesh>
        <mesh position={[2.73, 0, 0]}><boxGeometry args={[.065, 3.62, .065]} /><meshStandardMaterial color="#7f5735" metalness={.5} roughness={.4} /></mesh>
      </group>
    </group>
  );
}

function PhotoWall({ onFocus, onPhotoSelect, photoLightboxEnabled }: WallDisplaysProps) {
  const textures = useTexture(photoPaths) as THREE.Texture[];
  const { hovered, handlers } = useInteractiveWall(() => onFocus("gallery"));
  const [hoveredPhotoId, setHoveredPhotoId] = useState<string | null>(null);
  const photoPointerRef = useRef<{ id: string; x: number; y: number; dragged: boolean } | null>(null);

  useEffect(() => {
    textures.forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 4;
      texture.needsUpdate = true;
    });
  }, [textures]);

  return (
    <group position={ROOM_LAYOUT.gallery.position} scale={ROOM_LAYOUT.gallery.scale} {...handlers}>
      <mesh position={[0, 0, -.04]}>
        <planeGeometry args={[6.55, 3.75]} />
        <meshBasicMaterial transparent opacity={.001} depthWrite={false} />
      </mesh>
      {selectedWallPhotos.map(({ slot, photo }, index) => {
        const localX = slot.position[0] * PHOTO_WALL_AREA.width / 2;
        const localY = slot.position[1] * PHOTO_WALL_AREA.height / 2;
        const longEdge = slot.longEdge * PHOTO_WALL_AREA.height / 2;
        const isLandscape = photo.orientation === "landscape";
        const isSquare = photo.orientation === "square";
        const width = isLandscape || isSquare ? longEdge : longEdge * photo.aspectRatio;
        const height = isLandscape ? longEdge / photo.aspectRatio : longEdge;
        const frame = frameMaterials[slot.frame];
        const frameBorder = slot.size === "hero" ? .105 : slot.size === "medium" ? .082 : .062;
        const frameDepth = slot.size === "hero" ? .14 : slot.size === "medium" ? .115 : .09;
        const matte = slot.frame === "metal" ? "#b9b2a5" : "#d5cbb9";
        const photoHandlers = {
          onPointerDown: (event: ThreeEvent<PointerEvent>) => {
            photoPointerRef.current = { id: photo.id, x: event.nativeEvent.clientX, y: event.nativeEvent.clientY, dragged: false };
          },
          onPointerMove: (event: ThreeEvent<PointerEvent>) => {
            const start = photoPointerRef.current;
            if (!start || start.id !== photo.id) return;
            const dx = event.nativeEvent.clientX - start.x;
            const dy = event.nativeEvent.clientY - start.y;
            if (Math.hypot(dx, dy) > 8) start.dragged = true;
          },
          onClick: (event: ThreeEvent<MouseEvent>) => {
            event.stopPropagation();
            if (photoPointerRef.current?.id === photo.id && photoPointerRef.current.dragged) return;
            if (photoLightboxEnabled) {
              onPhotoSelect?.(photo);
              return;
            }
            onFocus("gallery");
          },
          onPointerOver: (event: ThreeEvent<PointerEvent>) => {
            event.stopPropagation();
            setHoveredPhotoId(photo.id);
          },
          onPointerOut: (event: ThreeEvent<PointerEvent>) => {
            event.stopPropagation();
            setHoveredPhotoId((currentId) => currentId === photo.id ? null : currentId);
          },
        };
        const photoHovered = hovered || hoveredPhotoId === photo.id;
        return (
        <group key={photo.id} position={[localX, localY, slot.size === "hero" ? .025 : 0]} rotation={[0, 0, slot.rotation]} {...photoHandlers}>
          <mesh castShadow receiveShadow position={[0, 0, .015]}>
            <boxGeometry args={[width + frameBorder, height + frameBorder, frameDepth]} />
            <meshStandardMaterial color={frame.color} roughness={frame.roughness} metalness={frame.metalness} />
          </mesh>
          <mesh position={[0, 0, frameDepth / 2 + .017]}>
            <planeGeometry args={[width + .022, height + .022]} />
            <meshStandardMaterial color={matte} roughness={.92} />
          </mesh>
          <mesh position={[0, 0, frameDepth / 2 + .023]}>
            <planeGeometry args={[width, height]} />
            <meshBasicMaterial map={textures[index]} toneMapped={false} color={photoHovered ? "#ffffff" : "#e6dfd4"} />
          </mesh>
        </group>
        );
      })}
      <Html transform position={[-2.58, -1.72, .12]} distanceFactor={1.06} style={{ pointerEvents: "none" }}>
        <div className="room-wall-caption"><b>PHOTO WALL</b><span>SELECTED MOMENTS / 01—29</span></div>
      </Html>
    </group>
  );
}

function DigitalLab({ onFocus }: WallDisplaysProps) {
  const { hovered, handlers } = useInteractiveWall(() => onFocus("digital"));

  return (
    <group position={ROOM_LAYOUT.digital.position} scale={ROOM_LAYOUT.digital.scale} {...handlers}>
      <mesh castShadow>
        <boxGeometry args={[6.45, 3.32, .22]} />
        <meshStandardMaterial color="#0a0d10" roughness={.28} metalness={.62} />
      </mesh>
      <mesh position={[0, 0, .13]}>
        <planeGeometry args={[6.14, 3.0]} />
        <meshPhysicalMaterial color="#071627" roughness={.13} metalness={.18} clearcoat={.8} clearcoatRoughness={.14} emissive="#0d4f72" emissiveIntensity={hovered ? .85 : .52} />
      </mesh>
      <mesh position={[0, -1.76, -.05]} castShadow>
        <boxGeometry args={[1.35, .14, .42]} />
        <meshStandardMaterial color="#111315" metalness={.65} roughness={.32} />
      </mesh>
      <Html transform position={[0, 0, .16]} distanceFactor={1.18} style={{ pointerEvents: "none" }}>
        <div className={`room-digital-lab${hovered ? " is-hovered" : ""}`}>
          <header><span>LEO / DIGITAL WORKSPACE</span><i>ONLINE</i></header>
          <h2>DIGITAL LAB</h2>
          <div>{["AI", "VIDEO", "DESIGN", "SYSTEM"].map((item, index) => <b key={item}><em>0{index + 1}</em>{item}</b>)}</div>
        </div>
      </Html>
    </group>
  );
}

function TravelMap({ onFocus }: WallDisplaysProps) {
  const { hovered, handlers } = useInteractiveWall(() => onFocus("travel"));
  const shape = useMemo(() => {
    const next = new THREE.Shape();
    const points: Array<[number, number]> = [
      [-2.8, -.35], [-2.45, .35], [-1.95, .78], [-1.2, .65], [-.72, 1.15], [.05, .92],
      [.55, 1.35], [1.15, 1.02], [1.65, .5], [2.42, .18], [2.0, -.34], [2.12, -.88],
      [1.42, -1.22], [.78, -1.08], [.24, -1.58], [-.32, -1.25], [-.9, -1.43], [-1.28, -.88],
      [-1.95, -1.05], [-2.38, -.72],
    ];
    next.moveTo(points[0][0], points[0][1]);
    points.slice(1).forEach(([x, y]) => next.lineTo(x, y));
    next.closePath();
    return next;
  }, []);

  return (
    <group position={ROOM_LAYOUT.travel.position} scale={ROOM_LAYOUT.travel.scale} rotation={[0, -Math.PI / 2, 0]} {...handlers}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3.05, 3.18, .14]} />
        <meshStandardMaterial color="#765f45" roughness={.94} />
      </mesh>
      <mesh position={[0, .05, .105]} scale={[.48, .48, .48]} castShadow>
        <extrudeGeometry args={[shape, { depth: .14, bevelEnabled: true, bevelSize: .045, bevelThickness: .035, bevelSegments: 2 }]} />
        <meshStandardMaterial color={hovered ? "#d6b98c" : "#b89a70"} roughness={.72} metalness={.02} />
      </mesh>
      {[[-.72, .58], [.48, .34], [.82, -.62]].map(([x, y], index) => (
        <group key={index} position={[x, y, .24]}>
          <mesh><sphereGeometry args={[.055, 18, 18]} /><meshStandardMaterial color={index === 1 ? "#4fe3ff" : "#c96e4c"} roughness={.35} /></mesh>
          <mesh position={[0, -.08, -.035]}><cylinderGeometry args={[.012, .012, .16, 10]} /><meshStandardMaterial color="#382c24" metalness={.35} /></mesh>
        </group>
      ))}
      <mesh position={[-1.04, -1.22, .12]} rotation={[0, 0, -.07]}><boxGeometry args={[.68, .4, .035]} /><meshStandardMaterial color="#d3c6a8" roughness={.9} /></mesh>
      <mesh position={[1.02, 1.18, .12]} rotation={[0, 0, .06]}><boxGeometry args={[.58, .36, .035]} /><meshStandardMaterial color="#c2b18d" roughness={.9} /></mesh>
      <Html transform position={[-1.18, 1.3, .15]} distanceFactor={.78} style={{ pointerEvents: "none" }}>
        <div className="room-travel-label"><b>PLACES I&apos;VE BEEN</b><span>CHINA TRAVEL MAP</span></div>
      </Html>
    </group>
  );
}

export function WallDisplays({ onFocus, onChildhoodActivate, onPhotoSelect, photoLightboxEnabled }: WallDisplaysProps) {
  return (
    <>
      <JourneyBoard onFocus={onFocus} onChildhoodActivate={onChildhoodActivate} />
      <PhotoWall onFocus={onFocus} onPhotoSelect={onPhotoSelect} photoLightboxEnabled={photoLightboxEnabled} />
      <DigitalLab onFocus={onFocus} />
      <TravelMap onFocus={onFocus} />
    </>
  );
}
