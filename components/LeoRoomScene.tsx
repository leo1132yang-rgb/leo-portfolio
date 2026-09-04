"use client";

import { Canvas, type ThreeEvent, useThree } from "@react-three/fiber";
import { CameraControls, ContactShadows, type CameraControlsImpl } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState, type ReactElement } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { CosmicBackdrop, WindowCosmicExterior } from "@/components/leo-room/CosmicBackdrop";
import { CentralWorkspace } from "@/components/leo-room/CentralWorkspace";
import { DeskFocusController, DeskInteractionScope } from "@/components/leo-room/DeskInteractiveItem";
import type { DeskSelection } from "@/data/deskItems";
import { WallDisplays } from "@/components/leo-room/WallDisplays";
import type { ChildhoodStoryId } from "@/data/childhoodStories";
import {
  leoRoomExploreProfiles,
  leoRoomFocusTargets,
  leoRoomMobileOverviewCamera,
  leoRoomOverviewCamera,
  type LeoRoomFocusId,
} from "@/data/leoRoomCamera";
import { ROOM, ROOM_LAYOUT, ROOM_LIGHTING, ROOM_STRUCTURE } from "@/data/leoRoomDimensions";
import type { PhotoWallImage } from "@/data/photoWall";

// Archviz-style three-quarter view: high enough to read the floor plan, but
// still low enough for the walls and window to feel like a real room.
const CAMERA_POSITION = leoRoomOverviewCamera.position;
const CAMERA_TARGET = leoRoomOverviewCamera.target;

type RoomFocusRequest = { id: LeoRoomFocusId | "overview"; nonce: number };

function generatedTexture(kind: "wall" | "wood" | "rug" | "window") {
  const width = kind === "window" ? 256 : 128;
  const height = kind === "window" ? 192 : 128;
  const data = new Uint8Array(width * height * 4);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      let red = 42;
      let green = 38;
      let blue = 35;

      if (kind === "wall") {
        const grain = ((x * 17 + y * 31) % 19) - 9;
        const wave = Math.sin(x * .19 + y * .13) * 2.2;
        red = 43 + grain * .17 + wave;
        green = 39 + grain * .15 + wave;
        blue = 36 + grain * .13 + wave;
      }

      if (kind === "wood") {
        const plankHeight = 21;
        const row = Math.floor(y / plankHeight);
        const seam = y % plankHeight < 2;
        const offset = row % 2 === 0 ? 0 : 37;
        const grain = Math.sin((x + offset) * .23 + Math.sin(y * .21) * 2.8) * 10;
        const fine = Math.sin((x + y * 2.4) * .77) * 3;
        const rowShift = (row % 4) * 3;
        red = seam ? 48 : 108 + grain + fine + rowShift;
        green = seam ? 28 : 60 + grain * .45 + fine * .25 + rowShift * .45;
        blue = seam ? 18 : 31 + grain * .2 + rowShift * .18;
      }

      if (kind === "rug") {
        const dx = x - width / 2;
        const dy = y - height / 2;
        const radius = Math.sqrt(dx * dx + dy * dy);
        const weave = Math.sin((x + y) * 1.65) * 3 + Math.sin((x - y) * 1.35) * 2;
        const variation = ((x * 11 + y * 23) % 9) - 4;
        red = 143 + weave + variation;
        green = 124 + weave * .7 + variation * .7;
        blue = 105 + weave * .5 + variation * .55 + Math.sin(radius * .42) * 1.5;
      }

      if (kind === "window") {
        const t = y / (height - 1);
        const horizonGlow = Math.exp(-Math.pow((t - .59) * 6.1, 2));
        red = 29 + t * 48 + horizonGlow * 128;
        green = 53 + t * 18 + horizonGlow * 54;
        blue = 91 - t * 28 + horizonGlow * 11;

        if (y > height * .66) {
          const buildingWidth = 10 + ((x * 13) % 17);
          const buildingTop = height * (.65 + ((Math.floor(x / buildingWidth) * 19) % 14) / 100);
          if (y > buildingTop) {
            red = 13;
            green = 18;
            blue = 24;
          }
        }
      }

      data[index] = Math.max(0, Math.min(255, red));
      data[index + 1] = Math.max(0, Math.min(255, green));
      data[index + 2] = Math.max(0, Math.min(255, blue));
      data[index + 3] = 255;
    }
  }

  const texture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

function useRoomTexture(kind: "wall" | "wood" | "rug" | "window", repeat: [number, number] = [1, 1]) {
  const texture = useMemo(() => {
    const nextTexture = generatedTexture(kind);
    nextTexture.repeat.set(repeat[0], repeat[1]);
    return nextTexture;
  }, [kind, repeat[0], repeat[1]]);

  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

function ArchitecturalBlock({
  size,
  position,
  radius = .035,
  material,
  castShadow = true,
  receiveShadow = true,
}: {
  size: [number, number, number];
  position: [number, number, number];
  radius?: number;
  material: ReactElement;
  castShadow?: boolean;
  receiveShadow?: boolean;
}) {
  const geometry = useMemo(
    () => new RoundedBoxGeometry(size[0], size[1], size[2], 2, radius),
    [radius, size[0], size[1], size[2]],
  );
  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <mesh geometry={geometry} position={position} castShadow={castShadow} receiveShadow={receiveShadow}>
      {material}
    </mesh>
  );
}

function RoomShell() {
  const wallTexture = useRoomTexture("wall", [9, 6]);
  const woodTexture = useRoomTexture("wood", [2.2, 2.65]);
  const wallMaterial = <meshStandardMaterial map={wallTexture} color="#ffffff" roughness={.9} metalness={0} />;
  const trimMaterial = <meshStandardMaterial color="#211e1c" roughness={.82} metalness={.02} />;
  const { halfWidth, halfDepth, window, ceilingEdgeDepth, ceilingEdgeWidth, baseTrimHeight, baseTrimDepth } = ROOM_STRUCTURE;
  const windowStart = window.centerZ - window.width / 2;
  const windowEnd = window.centerZ + window.width / 2;
  const rightBackLength = windowStart + halfDepth;
  const rightFrontLength = halfDepth - windowEnd;
  const rightBackCenter = -halfDepth + rightBackLength / 2;
  const rightFrontCenter = windowEnd + rightFrontLength / 2;
  const topFillHeight = ROOM.height - window.sill - window.height;

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM.width, ROOM.depth]} />
        <meshStandardMaterial map={woodTexture} color="#ffffff" roughness={.72} metalness={.015} />
      </mesh>

      <ArchitecturalBlock
        size={[ROOM.width, ROOM.height, ROOM.wall]}
        position={[0, ROOM.height / 2, -ROOM.depth / 2]}
        material={wallMaterial}
      />
      <ArchitecturalBlock
        size={[ROOM.wall, ROOM.height, ROOM.depth]}
        position={[-ROOM.width / 2, ROOM.height / 2, 0]}
        material={wallMaterial}
      />

      {/* The right wall is built around a real opening instead of placing a
          bright image on top of an opaque wall. */}
      <ArchitecturalBlock size={[ROOM.wall, ROOM.height, rightBackLength]} position={[halfWidth, ROOM.height / 2, rightBackCenter]} material={wallMaterial} />
      <ArchitecturalBlock size={[ROOM.wall, ROOM.height, rightFrontLength]} position={[halfWidth, ROOM.height / 2, rightFrontCenter]} material={wallMaterial} />
      <ArchitecturalBlock size={[ROOM.wall, window.sill, window.width]} position={[halfWidth, window.sill / 2, window.centerZ]} material={wallMaterial} />
      <ArchitecturalBlock size={[ROOM.wall, topFillHeight, window.width]} position={[halfWidth, ROOM.height - topFillHeight / 2, window.centerZ]} material={wallMaterial} />

      {/* A cut-away ceiling edge keeps the room readable from above while
          preserving the proportions of a finished interior. */}
      <ArchitecturalBlock size={[ROOM.width - .08, .2, ceilingEdgeDepth]} position={[0, ROOM.height + .015, -halfDepth + ceilingEdgeDepth / 2]} material={trimMaterial} />
      <ArchitecturalBlock size={[ceilingEdgeWidth, .2, ROOM.depth - .08]} position={[-halfWidth + ceilingEdgeWidth / 2, ROOM.height + .015, 0]} material={trimMaterial} />
      <ArchitecturalBlock size={[ceilingEdgeWidth, .2, ROOM.depth - .08]} position={[halfWidth - ceilingEdgeWidth / 2, ROOM.height + .015, 0]} material={trimMaterial} />

      <ArchitecturalBlock size={[ROOM.width - .24, baseTrimHeight, baseTrimDepth]} position={[0, baseTrimHeight / 2, -halfDepth + ROOM.wall]} material={trimMaterial} />
      <ArchitecturalBlock size={[baseTrimDepth, baseTrimHeight, ROOM.depth - .24]} position={[-halfWidth + ROOM.wall, baseTrimHeight / 2, 0]} material={trimMaterial} />
      <ArchitecturalBlock size={[baseTrimDepth, baseTrimHeight, rightBackLength - .12]} position={[halfWidth - ROOM.wall, baseTrimHeight / 2, rightBackCenter]} material={trimMaterial} />
      <ArchitecturalBlock size={[baseTrimDepth, baseTrimHeight, rightFrontLength - .12]} position={[halfWidth - ROOM.wall, baseTrimHeight / 2, rightFrontCenter]} material={trimMaterial} />
    </group>
  );
}

function CityWindow() {
  const frameMaterial = <meshStandardMaterial color="#17191a" roughness={.35} metalness={.56} />;
  const { halfWidth, window } = ROOM_STRUCTURE;
  const centerY = window.sill + window.height / 2;
  const paneWidth = window.width - .12;
  const paneHeight = window.height - .12;

  return (
    <group position={[halfWidth + ROOM.wall / 2 + .02, centerY, window.centerZ]} rotation={[0, -Math.PI / 2, 0]}>
      <mesh position={[0, 0, .012]} renderOrder={5}>
        <planeGeometry args={[paneWidth, paneHeight]} />
        <meshBasicMaterial
          colorWrite={false}
          depthWrite={false}
          side={THREE.DoubleSide}
          stencilWrite
          stencilRef={1}
          stencilFunc={THREE.AlwaysStencilFunc}
          stencilFail={THREE.KeepStencilOp}
          stencilZFail={THREE.KeepStencilOp}
          stencilZPass={THREE.ReplaceStencilOp}
        />
      </mesh>
      <mesh position={[0, 0, .04]}>
        <planeGeometry args={[paneWidth, paneHeight]} />
        <meshPhysicalMaterial color="#b8d6e5" transparent opacity={.12} roughness={.12} metalness={.06} clearcoat={.42} clearcoatRoughness={.18} depthWrite={false} />
      </mesh>
      <ArchitecturalBlock size={[window.width + .12, .11, .13]} position={[0, window.height / 2, .08]} radius={.025} material={frameMaterial} />
      <ArchitecturalBlock size={[window.width + .12, .11, .13]} position={[0, -window.height / 2, .08]} radius={.025} material={frameMaterial} />
      <ArchitecturalBlock size={[.11, window.height + .12, .13]} position={[-window.width / 2, 0, .08]} radius={.025} material={frameMaterial} />
      <ArchitecturalBlock size={[.11, window.height + .12, .13]} position={[window.width / 2, 0, .08]} radius={.025} material={frameMaterial} />
      <ArchitecturalBlock size={[.075, window.height, .12]} position={[0, 0, .09]} radius={.02} material={frameMaterial} />
      <ArchitecturalBlock size={[window.width, .075, .12]} position={[0, 0, .09]} radius={.02} material={frameMaterial} />
      <ArchitecturalBlock size={[window.width + .38, .16, .42]} position={[0, -window.height / 2 - .12, -.05]} radius={.035} material={<meshStandardMaterial color="#292624" roughness={.78} />} />
    </group>
  );
}

function RoundRug() {
  const rugTexture = useRoomTexture("rug", [4, 4]);
  const { position, radius } = ROOM_LAYOUT.rug;

  return (
    <group position={position}>
      <mesh position={[0, .075, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[radius, radius, .14, 128]} />
        <meshStandardMaterial map={rugTexture} color="#ffffff" roughness={.98} metalness={0} />
      </mesh>
      <mesh position={[0, .015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radius + .1, 128]} />
        <meshBasicMaterial color="#1b120d" transparent opacity={.25} depthWrite={false} />
      </mesh>
    </group>
  );
}

function CeilingSpot({ x }: { x: number }) {
  return (
    <group position={[x, ROOM_LIGHTING.trackY - .2, ROOM_LIGHTING.trackZ]}>
      <mesh castShadow>
        <cylinderGeometry args={[.105, .14, .34, 20]} />
        <meshStandardMaterial color="#171818" roughness={.28} metalness={.7} />
      </mesh>
      <spotLight
        position={[0, -.18, .02]}
        color="#ffd2a2"
        intensity={5.4}
        distance={9.5}
        angle={.43}
        penumbra={.82}
        decay={2}
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
        shadow-bias={-.0002}
      />
    </group>
  );
}

function RoomLighting() {
  useEffect(() => {
    RectAreaLightUniformsLib.init();
  }, []);

  return (
    <group>
      <hemisphereLight args={["#9eb9cc", "#5d3824", 1.35]} />
      <ambientLight color="#d8c4b1" intensity={.55} />

      <rectAreaLight position={[0, ROOM.height * .76, .35]} rotation={[-Math.PI / 2, 0, 0]} color="#ffd0a0" intensity={7.6} width={ROOM.width * .55} height={ROOM.depth * .48} />
      <rectAreaLight position={[ROOM_STRUCTURE.halfWidth - .55, ROOM_STRUCTURE.window.sill + ROOM_STRUCTURE.window.height / 2, ROOM_STRUCTURE.window.centerZ]} rotation={[0, Math.PI / 2, 0]} color="#8cb9dc" intensity={7.1} width={ROOM_STRUCTURE.window.width} height={ROOM_STRUCTURE.window.height} />

      <mesh position={[0, ROOM_LIGHTING.coveY, ROOM_LIGHTING.backZ]}>
        <boxGeometry args={[ROOM_LIGHTING.backStripLength, .055, .065]} />
        <meshStandardMaterial color="#ffb76c" emissive="#ffad61" emissiveIntensity={4.2} />
      </mesh>
      <mesh position={[ROOM_LIGHTING.leftX, ROOM_LIGHTING.coveY, 0]}>
        <boxGeometry args={[.065, .055, ROOM_LIGHTING.sideStripLength]} />
        <meshStandardMaterial color="#ffb76c" emissive="#ffad61" emissiveIntensity={3.8} />
      </mesh>
      <mesh position={[ROOM_LIGHTING.rightX, ROOM_LIGHTING.coveY, 0]}>
        <boxGeometry args={[.065, .055, ROOM_LIGHTING.sideStripLength]} />
        <meshStandardMaterial color="#ffb76c" emissive="#ffad61" emissiveIntensity={3.8} />
      </mesh>

      <pointLight position={[0, ROOM_LIGHTING.coveY - .3, ROOM_LIGHTING.backZ + .24]} color="#ffc17b" intensity={4.8} distance={10.8} decay={2} />
      <pointLight position={[ROOM_LIGHTING.leftX + .24, ROOM_LIGHTING.coveY - .32, 0]} color="#ffb66d" intensity={3.7} distance={7.4} decay={2} />
      <pointLight position={[ROOM_LIGHTING.rightX - .24, ROOM_LIGHTING.coveY - .32, 0]} color="#ffb66d" intensity={3.0} distance={6.6} decay={2} />

      <mesh position={[0, ROOM_LIGHTING.trackY, ROOM_LIGHTING.trackZ]} castShadow>
        <boxGeometry args={[ROOM_LIGHTING.trackLength, .07, .09]} />
        <meshStandardMaterial color="#171818" roughness={.3} metalness={.7} />
      </mesh>
      {[-.41, -.14, .14, .41].map((ratio) => <CeilingSpot key={ratio} x={ROOM_LIGHTING.trackLength * ratio} />)}

      <directionalLight
        position={[-ROOM.width * .18, ROOM.height * 1.2, ROOM.depth * .65]}
        color="#ffd4ad"
        intensity={1.8}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-ROOM.width * .56}
        shadow-camera-right={ROOM.width * .56}
        shadow-camera-top={ROOM.width * .56}
        shadow-camera-bottom={-ROOM.width * .56}
        shadow-bias={-.00018}
      />
    </group>
  );
}

function RoomCameraControls({
  focusRequest,
  controlsEnabled,
}: {
  focusRequest: RoomFocusRequest | null;
  controlsEnabled: boolean;
}) {
  const controlsRef = useRef<CameraControlsImpl>(null);
  const { camera } = useThree();
  const [isMobileRoom, setIsMobileRoom] = useState(false);
  const profile = isMobileRoom ? leoRoomExploreProfiles.mobile : leoRoomExploreProfiles.desktop;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobileRoom(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = profile.fov;
      camera.updateProjectionMatrix();
    }
    const destination = !focusRequest || focusRequest.id === "overview"
      ? isMobileRoom ? leoRoomMobileOverviewCamera : leoRoomOverviewCamera
      : leoRoomFocusTargets[focusRequest.id];
    void controls.setLookAt(
      ...destination.position,
      ...destination.target,
      true,
    );
  }, [camera, focusRequest, focusRequest?.nonce, isMobileRoom, profile.fov]);

  return (
    <CameraControls
      ref={controlsRef}
      makeDefault
      enabled={controlsEnabled}
      smoothTime={.76}
      draggingSmoothTime={.12}
      minDistance={profile.minDistance}
      maxDistance={profile.maxDistance}
      minPolarAngle={profile.minPolarAngle}
      maxPolarAngle={profile.maxPolarAngle}
      minAzimuthAngle={profile.minAzimuthAngle}
      maxAzimuthAngle={profile.maxAzimuthAngle}
      azimuthRotateSpeed={isMobileRoom ? .55 : .45}
      polarRotateSpeed={isMobileRoom ? .42 : .38}
      dollySpeed={.38}
      truckSpeed={0}
      dollyToCursor={false}
      infinityDolly={false}
    />
  );
}

function EmptyRoom({
  activeDeskItem,
  onDeskItemSelect,
  focusRequest,
  controlsEnabled,
  onWallFocus,
  onDeskFocus,
  onChildhoodActivate,
  onPhotoSelect,
  photoLightboxEnabled,
}: {
  activeDeskItem: DeskSelection | null;
  onDeskItemSelect: (item: DeskSelection) => void;
  focusRequest: RoomFocusRequest | null;
  controlsEnabled: boolean;
  onWallFocus: (id: LeoRoomFocusId) => void;
  onDeskFocus: () => void;
  onChildhoodActivate: (id: ChildhoodStoryId) => void;
  onPhotoSelect: (photo: PhotoWallImage) => void;
  photoLightboxEnabled: boolean;
}) {
  const deskPointerRef = useRef<{ x: number; y: number; dragged: boolean } | null>(null);
  const deskTapHandlers = {
    onPointerDown: (event: ThreeEvent<PointerEvent>) => {
      deskPointerRef.current = { x: event.nativeEvent.clientX, y: event.nativeEvent.clientY, dragged: false };
    },
    onPointerMove: (event: ThreeEvent<PointerEvent>) => {
      const start = deskPointerRef.current;
      if (!start) return;
      const dx = event.nativeEvent.clientX - start.x;
      const dy = event.nativeEvent.clientY - start.y;
      if (Math.hypot(dx, dy) > 8) start.dragged = true;
    },
    onClick: (event: ThreeEvent<MouseEvent>) => {
      event.stopPropagation();
      if (deskPointerRef.current?.dragged) return;
      onDeskFocus();
    },
  };

  return (
    <>
      <color attach="background" args={["#02050d"]} />
      <CosmicBackdrop />
      <WindowCosmicExterior />
      <RoomShell />
      <CityWindow />
      <RoundRug />
      <group {...deskTapHandlers}>
        <DeskInteractionScope onSelect={onDeskItemSelect} enabled={controlsEnabled}>
          <CentralWorkspace />
        </DeskInteractionScope>
      </group>
      <WallDisplays
        onFocus={onWallFocus}
        onChildhoodActivate={onChildhoodActivate}
        onPhotoSelect={onPhotoSelect}
        photoLightboxEnabled={photoLightboxEnabled}
      />
      <RoomLighting />
      <ContactShadows position={[0, .018, .3]} scale={ROOM.width * .82} opacity={.32} blur={2.3} far={ROOM.height + 1} resolution={512} color="#1c120d" />
      <RoomCameraControls focusRequest={focusRequest} controlsEnabled={controlsEnabled} />
      <DeskFocusController selection={activeDeskItem} focusToken={focusRequest} />
    </>
  );
}

export function LeoRoomScene({
  activeDeskItem,
  onDeskItemSelect,
  focusRequest,
  controlsEnabled = true,
  onWallFocus,
  onDeskFocus,
  onChildhoodActivate,
  onPhotoSelect,
  photoLightboxEnabled,
}: {
  activeDeskItem: DeskSelection | null;
  onDeskItemSelect: (item: DeskSelection) => void;
  focusRequest: RoomFocusRequest | null;
  controlsEnabled?: boolean;
  onWallFocus: (id: LeoRoomFocusId) => void;
  onDeskFocus: () => void;
  onChildhoodActivate: (id: ChildhoodStoryId) => void;
  onPhotoSelect: (photo: PhotoWallImage) => void;
  photoLightboxEnabled: boolean;
}) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ position: CAMERA_POSITION, fov: 48, near: .1, far: 80 }}
      gl={{ antialias: true, alpha: false, stencil: true, powerPreference: "high-performance" }}
      onCreated={({ gl, camera }) => {
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.46;
        camera.lookAt(...CAMERA_TARGET);
      }}
    >
      <EmptyRoom
        activeDeskItem={activeDeskItem}
        onDeskItemSelect={onDeskItemSelect}
        focusRequest={focusRequest}
        controlsEnabled={controlsEnabled}
        onWallFocus={onWallFocus}
        onDeskFocus={onDeskFocus}
        onChildhoodActivate={onChildhoodActivate}
        onPhotoSelect={onPhotoSelect}
        photoLightboxEnabled={photoLightboxEnabled}
      />
    </Canvas>
  );
}
