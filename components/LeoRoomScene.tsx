"use client";

import { Canvas, type ThreeEvent } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, type ReactElement } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { CosmicBackdrop, WindowCosmicExterior } from "@/components/leo-room/CosmicBackdrop";
import { CentralWorkspace } from "@/components/leo-room/CentralWorkspace";
import { StudioInterior } from "@/components/leo-room/StudioInterior";
import { DeskInteractionScope } from "@/components/leo-room/DeskInteractiveItem";
import type { DeskSelection } from "@/data/deskItems";
import { WallDisplays } from "@/components/leo-room/WallDisplays";
import type { ChildhoodStoryId } from "@/data/childhoodStories";
import { leoRoomOverviewCamera } from "@/data/leoRoomCamera";
import { RoomLifeContext } from "@/components/leo-room/RoomLifeContext";
import { RoomLightingScope } from "@/components/leo-room/RoomLightingScope";
import { RoomCameraControls } from "@/components/leo-room/RoomCameraControls";
import type { RoomInteractionController } from "@/components/leo-room/useRoomInteractionController";
import { ROOM, ROOM_LAYOUT, ROOM_LIGHTING, ROOM_STRUCTURE } from "@/data/leoRoomDimensions";
import type { PhotoWallImage } from "@/data/photoWall";

// Archviz-style three-quarter view: high enough to read the floor plan, but
// still low enough for the walls and window to feel like a real room.
const CAMERA_POSITION = leoRoomOverviewCamera.position;
const CAMERA_TARGET = leoRoomOverviewCamera.target;


function generatedTexture(kind: "wall" | "wood" | "rug" | "window") {
  const width = kind === "wood" ? 512 : 256;
  const height = kind === "window" ? 192 : 256;
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
        red = 37 + grain * .17 + wave;
        green = 38 + grain * .15 + wave;
        blue = 37 + grain * .13 + wave;
      }

      if (kind === "wood") {
        const plankHeight = 32;
        const row = Math.floor(y / plankHeight);
        const seam = y % plankHeight === 0 || (x + row * 131) % 512 === 0;
        const offset = row % 2 === 0 ? 0 : 37;
        const grain = Math.sin(y * .7 + Math.sin((x + offset) * .018) * 1.7) * 5;
        const fine = Math.sin(y * 2.3 + Math.sin(x * .026)) * 2;
        const rowShift = (row % 4) * 3;
        red = seam ? 73 : 112 + grain + fine + rowShift;
        green = seam ? 47 : 76 + grain * .65 + fine * .5 + rowShift * .45;
        blue = seam ? 31 : 49 + grain * .4 + rowShift * .18;
      }

      if (kind === "rug") {
        const dx = x - width / 2;
        const dy = y - height / 2;
        const radius = Math.sqrt(dx * dx + dy * dy);
        const weave = Math.sin((x + y) * 1.65) * 3 + Math.sin((x - y) * 1.35) * 2;
        const variation = ((x * 11 + y * 23) % 9) - 4;
        red = 196 + weave + variation;
        green = 177 + weave * .7 + variation * .7;
        blue = 145 + weave * .5 + variation * .55 + Math.sin(radius * .42) * 1.5;
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
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
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
  const woodTexture = useRoomTexture("wood", [4, 4]);
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
        <meshStandardMaterial map={woodTexture} color="#ead8bd" roughness={.55} metalness={.015} />
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

function StudioRug() {
  const rugTexture = useRoomTexture("rug", [8, 6]);
  const { position } = ROOM_LAYOUT.rug;

  return (
    <group position={position}>
      <mesh position={[0, .025, .42]} receiveShadow>
        <boxGeometry args={[5.35, .045, 3.72]} />
        <meshStandardMaterial map={rugTexture} bumpMap={rugTexture} bumpScale={.009} color="#eee3ce" roughness={1} metalness={0} />
      </mesh>
      {[-1, 1].map(side => <group key={side}>
        <mesh position={[side * 2.59, .049, .42]}><boxGeometry args={[.065, .004, 3.64]} /><meshStandardMaterial color="#9c8460" roughness={1} /></mesh>
        <mesh position={[0, .049, .42 + side * 1.77]}><boxGeometry args={[5.18, .004, .045]} /><meshStandardMaterial color="#9c8460" roughness={1} /></mesh>
      </group>)}
    </group>
  );
}

function CeilingSpot({ x }: { x: number }) {
  const target = useMemo(() => {
    const object = new THREE.Object3D();
    object.position.set(x, 1.8, -ROOM.depth / 2 + .2);
    return object;
  }, [x]);
  return (
    <group>
    <primitive object={target} />
    <group position={[x, ROOM_LIGHTING.trackY - .2, ROOM_LIGHTING.trackZ]}>
      <mesh castShadow>
        <cylinderGeometry args={[.105, .14, .34, 20]} />
        <meshStandardMaterial color="#171818" roughness={.28} metalness={.7} />
      </mesh>
      <spotLight
        target={target}
        position={[0, -.18, .02]}
        color="#ffd2a2"
        intensity={9}
        distance={9.5}
        angle={.65}
        penumbra={.82}
        decay={2}
        castShadow={false}
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
        shadow-bias={-.0002}
      />
    </group>
    </group>
  );
}

function RoomLighting() {
  useEffect(() => {
    RectAreaLightUniformsLib.init();
  }, []);

  return (
    <group>
      <hemisphereLight userData={{roomNightIntensity:.4,roomNightColor:"#a8c3df"}} args={["#c5c7c4", "#654129", .75]} />
      <ambientLight userData={{roomNightIntensity:.16,roomNightColor:"#b0c4df"}} color="#dfcbb2" intensity={.3} />

      <rectAreaLight position={[0, ROOM.height * .76, .35]} rotation={[-Math.PI / 2, 0, 0]} color="#ffd0a0" intensity={3.4} width={ROOM.width * .55} height={ROOM.depth * .48} />
      <rectAreaLight userData={{roomNightIntensity:1.6}} position={[ROOM_STRUCTURE.halfWidth - .55, ROOM_STRUCTURE.window.sill + ROOM_STRUCTURE.window.height / 2, ROOM_STRUCTURE.window.centerZ]} rotation={[0, Math.PI / 2, 0]} color="#adc7da" intensity={1.6} width={ROOM_STRUCTURE.window.width} height={ROOM_STRUCTURE.window.height} />

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

      <directionalLight userData={{roomNightIntensity:.2,roomNightColor:"#adc7da"}}
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

function EmptyRoom({
  onDeskItemSelect,
  interaction,
  onWallFocus,
  onDeskFocus,
  onChildhoodActivate,
  onPhotoSelect,
  photoLightboxEnabled,
}: {
  onDeskItemSelect: (item: DeskSelection) => void;
  interaction: RoomInteractionController;
  onWallFocus: (id: import("@/data/leoRoomCamera").LeoRoomFocusId) => void;
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
      <RoomLightingScope>
      <group onClick={(event) => { event.stopPropagation(); if (event.delta <= 8) interaction.cancelBackground(); }}>
        <RoomShell />
        <CityWindow />
        <StudioRug />
        <StudioInterior />
      </group>
      <group {...deskTapHandlers}>
        <DeskInteractionScope onSelect={onDeskItemSelect} enabled={interaction.controlsEnabled}>
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
      </RoomLightingScope>
      <RoomCameraControls interaction={interaction} />
    </>
  );
}

function RoomRendered({ onReady }: { onReady?: () => void }) {
  useEffect(() => {
    if (!onReady) return;
    let second = 0;
    const first = requestAnimationFrame(() => { second = requestAnimationFrame(onReady); });
    return () => { cancelAnimationFrame(first); cancelAnimationFrame(second); };
  }, [onReady]);
  return null;
}

export function LeoRoomScene({
  onReady,
  onDeskItemSelect,
  interaction,
  onWallFocus,
  onDeskFocus,
  onChildhoodActivate,
  onPhotoSelect,
  photoLightboxEnabled,
}: {
  onReady?: () => void;
  onDeskItemSelect: (item: DeskSelection) => void;
  interaction: RoomInteractionController;
  onWallFocus: (id: import("@/data/leoRoomCamera").LeoRoomFocusId) => void;
  onDeskFocus: () => void;
  onChildhoodActivate: (id: ChildhoodStoryId) => void;
  onPhotoSelect: (photo: PhotoWallImage) => void;
  photoLightboxEnabled: boolean;
}) {
  return (
    <Canvas
      shadows
      frameloop={interaction.content && interaction.content.type !== "desk" ? "demand" : "always"}
      onPointerMissed={() => interaction.cancelBackground()}
      dpr={[1, 1.5]}
      camera={{ position: CAMERA_POSITION, fov: 48, near: .1, far: 80 }}
      gl={{ antialias: true, alpha: false, stencil: true, powerPreference: "high-performance" }}
      onCreated={({ gl, camera }) => {
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.25;
        camera.lookAt(...CAMERA_TARGET);
      }}
    >
      <Suspense fallback={null}>
      <RoomLifeContext.Provider value={interaction}>
      <EmptyRoom
        onDeskItemSelect={onDeskItemSelect}
        interaction={interaction}
        onWallFocus={onWallFocus}
        onDeskFocus={onDeskFocus}
        onChildhoodActivate={onChildhoodActivate}
        onPhotoSelect={onPhotoSelect}
        photoLightboxEnabled={photoLightboxEnabled}
      />
      </RoomLifeContext.Provider>
      <RoomRendered onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
