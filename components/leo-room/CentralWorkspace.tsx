"use client";

import { RoundedBox as DreiRoundedBox, useGLTF, useTexture } from "@react-three/drei";
import { useEffect, useMemo, useRef, type ComponentProps, type RefObject } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { CENTRAL_WORKSPACE, DESK_OBJECT_DIMENSIONS, DESK_PROP_SCALE } from "@/data/leoRoomWorkspace";
import { RoomFurnitureAsset } from './RoomFurnitureAsset';
import { DeskAquascape } from "./DeskAquascape";
import { SculptedDeskPlant } from "./SculptedDeskPlant";
import { LampPullChain } from "./LampPullChain";
import { ChairMotion } from "./RoomLifeFurniture";
import { DeskInteractiveItem } from "./DeskInteractiveItem";
import { DetailedFujiCamera, DeskCables, Keycaps, WatchFace } from "./DeskDetails";
import { RuntianReferenceModel, PropContact } from "./DeskPersonalProps";
import { useThree } from "@react-three/fiber";

// Thin devices need a bevel smaller than their thinnest dimension. Larger
// radii create inverted extrusion walls in Drei's RoundedBox geometry.
function RoundedBox({ args = [1, 1, 1], radius = .025, smoothness = 3, bevelSegments: _bevel, steps: _steps, creaseAngle: _crease, children, ...props }: ComponentProps<typeof DreiRoundedBox>) {
  const [w=1,h=1,d=1]=args;
  const geometry=useMemo(()=>new RoundedBoxGeometry(w,h,d,smoothness>=5?3:2,Math.min(radius,Math.min(w,h,d)*.45)),[w,h,d,radius,smoothness]);
  useEffect(()=>()=>geometry.dispose(),[geometry]);
  return <mesh {...props} geometry={geometry}>{children}</mesh>;
}

type InteractiveMeta = {
  interactiveId: string;
  title: string;
  description: string;
};

const META = {
  desk: { interactiveId: "office-desk", title: "中央工作台", description: "Leo 的创作、运营与系统工作中心。" },
  chair: { interactiveId: "office-chair", title: "工作椅", description: "一张陪伴长时间创作的焦糖棕皮椅。" },
  monitor: { interactiveId: "central-monitor", title: "Central Console", description: "连接 Projects、Profile、Digital Lab 与个人世界的中央入口。" },
  lamp: { interactiveId: "desk-lamp", title: "台灯", description: "让夜晚工作台保持温暖的一小束光。" },
  phone: { interactiveId: "phone", title: "手机", description: "日常沟通、记录与现场协作工具。" },
  notebook: { interactiveId: "notebook", title: "Notebook", description: "快速写下想法、结构与待办。" },
  watch: { interactiveId: "watch", title: "手表", description: "关于时间、节奏与现场。" },
  coffee: { interactiveId: "coffee", title: "咖啡", description: "工作台上的短暂停顿。" },
  runtian: { interactiveId: "runtian-water", title: "润田矿泉水", description: "一瓶带着江西家乡记忆的水。" },
  camera: { interactiveId: "fuji-xt5", title: "FUJIFILM X-T5", description: "观察画面、人物与现场的摄影工具。" },
  keyboard: { interactiveId: "keyboard", title: "键盘", description: "内容、设计与系统工作最常用的输入工具。" },
  mouse: { interactiveId: "mouse", title: "鼠标", description: "让视觉与系统里的细节准确落位。" },
  plantLeft: { interactiveId: "plant-left", title: "桌面绿植", description: "工作台左侧的一点自然气息。" },
  plantRight: { interactiveId: "plant-right", title: "桌面绿植", description: "冷蓝屏幕旁的一点绿色。" },
  pc: { interactiveId: "desktop-pc", title: "Desktop PC", description: "承担设计、剪辑和数字工作的桌面主机。" },
} satisfies Record<string, InteractiveMeta>;

const DESKTOP_PC_BASE_SIZE = {
  width: .62,
  height: 1.22,
  depth: .66,
} as const;

const RUNTIAN_BOTTLE_MODEL = "/room/models/runtian-500ml-water-bottle.glb";

/**
 * The tower sits in the visible right-hand bay below the main desktop.
 * Its transform is derived from the slab underside, the right leg and the
 * under-desk rail, so desk scaling cannot leave it embedded in old coordinates.
 */
const DESKTOP_PC_TRANSFORM = (() => {
  const { desk } = CENTRAL_WORKSPACE;
  const deskBaseY = .14;
  const desktopUndersideY = deskBaseY + desk.height - desk.topThickness / 2;
  const topClearance = .105;
  const sideClearance = .11;
  const railClearance = .045;
  const scale = (desktopUndersideY - topClearance) / DESKTOP_PC_BASE_SIZE.height;
  const scaledWidth = DESKTOP_PC_BASE_SIZE.width * scale;
  const scaledHeight = DESKTOP_PC_BASE_SIZE.height * scale;
  const rightLegInnerEdge = desk.width / 2 - .18 - .14 / 2;
  const railFrontEdge = -desk.depth * .38 + .04;
  const scaledDepth = DESKTOP_PC_BASE_SIZE.depth * scale;

  return {
    position: [
      rightLegInnerEdge - sideClearance - scaledWidth / 2,
      scaledHeight / 2,
      Math.max(desk.depth * .08, railFrontEdge + railClearance + scaledDepth / 2),
    ] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    scale,
  };
})();

function OfficeDesk() {
  // Hits bubble to the existing deskTapHandlers; the GLB adds no interaction layer.
  return <group userData={META.desk}><RoomFurnitureAsset url="/room/models/leo-desk.glb"/></group>;
}

function OfficeChair() {
  const { chair } = CENTRAL_WORKSPACE;
  const [x, , z] = chair.position;
  const w = chair.width;
  const meta = META.chair;
  return (
    <group position={[x, 0, z]} rotation={[0, -.15, 0]} userData={meta}>
      <RoundedBox args={[w, .23, .82]} radius={.13} smoothness={6} position={[0, chair.seatY, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#8c4b2e" roughness={.69} metalness={0} />
      </RoundedBox>
      <RoundedBox args={[w * .94, 1.02, .2]} radius={.15} smoothness={6} position={[0, chair.seatY + .6, .33]} rotation={[-.08, 0, 0]} castShadow>
        <meshStandardMaterial color="#995938" roughness={.66} />
      </RoundedBox>
      <RoundedBox args={[w * .76, .16, .11]} radius={.065} smoothness={5} position={[0, chair.seatY + 1.08, .27]} castShadow>
        <meshStandardMaterial color="#6f2f1c" roughness={.5} />
      </RoundedBox>
      {[-.3, 0, .3].map(x => <RoundedBox key={x} args={[.012, .73, .012]} radius={.004} position={[x * w, chair.seatY + .61, .446]}><meshStandardMaterial color="#794029" roughness={.78} /></RoundedBox>)}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * (w / 2 + .1), chair.seatY + .15, -.02]}>
          <mesh position={[0, .08, .04]} castShadow><boxGeometry args={[.07, .32, .07]} /><meshStandardMaterial color="#17191b" roughness={.38} metalness={.62} /></mesh>
          <RoundedBox args={[.16, .09, .55]} radius={.055} smoothness={4} position={[0, .26, -.1]} castShadow>
            <meshStandardMaterial color="#2a211e" roughness={.54} />
          </RoundedBox>
        </group>
      ))}
      <mesh position={[0, chair.seatY - .34, .03]} castShadow><cylinderGeometry args={[.065, .075, .48, 16]} /><meshStandardMaterial color="#111315" roughness={.3} metalness={.75} /></mesh>
      <group position={[0, chair.seatY - .59, .03]}>
        {[0, 1, 2, 3, 4].map((index) => (
          <group key={index} rotation={[0, index * Math.PI * .4, 0]}>
            <RoundedBox args={[.08, .055, .72]} radius={.035} smoothness={4} position={[0, 0, -.3]} castShadow>
              <meshStandardMaterial color="#121416" roughness={.34} metalness={.7} />
            </RoundedBox>
            <mesh position={[0, -.035, -.69]} rotation={[Math.PI / 2, 0, 0]} castShadow><torusGeometry args={[.075, .032, 10, 18]} /><meshStandardMaterial color="#090a0b" roughness={.56} /></mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

function CentralMonitor() {
  const texture = useTexture("/room/leo-central-console-desk.webp");
  const { monitor, desk } = CENTRAL_WORKSPACE;
  const meta = META.monitor;
  const surfaceY = .14 + desk.height + desk.topThickness / 2;

  useEffect(() => {
    const image = texture.image as { width?: number; height?: number } | undefined;
    const imageAspect = image?.width && image?.height ? image.width / image.height : 16 / 9;
    const screenAspect = monitor.width / monitor.height;

    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.center.set(.5, .5);
    if (imageAspect < screenAspect) {
      const visibleHeight = imageAspect / screenAspect;
      texture.repeat.set(1, visibleHeight);
      texture.offset.set(0, (1 - visibleHeight) / 2);
    } else {
      const visibleWidth = screenAspect / imageAspect;
      texture.repeat.set(visibleWidth, 1);
      texture.offset.set((1 - visibleWidth) / 2, 0);
    }
    texture.anisotropy = 8;
    texture.needsUpdate = true;
  }, [monitor.height, monitor.width, texture]);

  return (
    <DeskInteractiveItem position={[0, 0, monitor.z]} meta={meta}>
      <RoundedBox args={[monitor.width + .018, monitor.height + .024, monitor.depth]} radius={.018} smoothness={4} position={[0, monitor.centerY, 0]} castShadow>
        <meshStandardMaterial color="#252828" roughness={.43} metalness={.65} />
      </RoundedBox>
      <mesh userData={{roomNightFactor:.7}} position={[0, monitor.centerY, monitor.depth / 2 + .004]}>
        <planeGeometry args={[monitor.width, monitor.height]} />
        <meshStandardMaterial map={texture} emissiveMap={texture} emissive="#ffffff" emissiveIntensity={.28} roughness={.13} metalness={.08} toneMapped={false} />
      </mesh>
      <RoundedBox args={[monitor.width * .52, monitor.height * .48, .025]} radius={.008} smoothness={3} position={[0, monitor.centerY - .045, -.024]} castShadow><meshStandardMaterial color="#191e22" roughness={.61} metalness={.25} /></RoundedBox>
      <mesh position={[0,monitor.centerY-.1,-.044]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.036,.036,.025,24]}/><meshStandardMaterial color="#353936" roughness={.38} metalness={.72}/></mesh>
      <RoundedBox args={[.052, .25, .028]} radius={.006} smoothness={3} position={[0, surfaceY + .135, -.029]} castShadow>
        <meshStandardMaterial color="#15181b" roughness={.32} metalness={.68} />
      </RoundedBox>
      <RoundedBox args={[.29, .015, .19]} radius={.006} smoothness={3} position={[0, surfaceY + .0075, .02]} castShadow receiveShadow>
        <meshStandardMaterial color="#141619" roughness={.35} metalness={.66} />
      </RoundedBox>
      <mesh position={[monitor.width*.42,monitor.centerY-monitor.height/2-.006,monitor.depth/2+.001]}><circleGeometry args={[.0018,8]}/><meshBasicMaterial color="#cbd9bc"/></mesh>
      <rectAreaLight userData={{roomNightIntensity:.2}} position={[0, monitor.centerY, monitor.depth + .24]} rotation={[0, 0, 0]} color="#ccd5d9" intensity={.35} width={monitor.width * .78} height={monitor.height * .72} />
    </DeskInteractiveItem>
  );
}

function DeskLamp({ surfaceY }: { surfaceY: number }) {
  const meta = META.lamp;
  const { size } = useThree();
  const shade=useMemo(()=>new THREE.LatheGeometry([[.335,.915],[.34,.93],[.325,.955],[.26,1.035],[.15,1.12],[.045,1.145],[.035,1.13],[.135,1.1],[.245,1.014],[.313,.938],[.321,.92]].map(([r,y])=>new THREE.Vector2(r,y)),32),[]);
  useEffect(()=>()=>shade.dispose(),[shade]);
  return (
    <DeskInteractiveItem position={[.73, surfaceY, -.25]} scale={.4} meta={meta}>
      <LampPullChain />
      <mesh position={[0,.012,0]}><cylinderGeometry args={[.244,.244,.024,32]}/><meshStandardMaterial color="#232520" roughness={.95}/></mesh>
      <mesh position={[0, .049, 0]} castShadow><cylinderGeometry args={[.236, .25, .05, 32]} /><meshStandardMaterial color="#36392e" roughness={.46} metalness={.4} /></mesh>
      <mesh position={[0,.077,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.225,.006,6,32]}/><meshStandardMaterial color="#9e8152" roughness={.43} metalness={.73}/></mesh>
      <mesh position={[0, .59, 0]} castShadow><cylinderGeometry args={[.023, .028, 1.03, 16]} /><meshStandardMaterial color="#9a825c" roughness={.42} metalness={.78} /></mesh>
      <mesh geometry={shade} castShadow><meshPhysicalMaterial color="#363d32" roughness={.42} metalness={.28} clearcoat={.2} clearcoatRoughness={.4} side={THREE.DoubleSide}/></mesh>
      <mesh position={[0,.922,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.329,.007,8,32]}/><meshStandardMaterial color="#b09b71" roughness={.4} metalness={.7}/></mesh>
      <mesh position={[0, .95, 0]} scale={[1,.55,1]}><sphereGeometry args={[.095, 18, 12]} /><meshStandardMaterial color="#ffe1ac" emissive="#ffd099" emissiveIntensity={1.8} /></mesh>
      <pointLight position={[0, .88, .02]} color="#ffd099" intensity={.72} distance={2.7} decay={2} castShadow={size.width >= 768} shadow-mapSize-width={256} shadow-mapSize-height={256} />
    </DeskInteractiveItem>
  );
}

function DeskPlant({ position, scale = 1, meta }: { position: [number, number, number]; scale?: number; meta: InteractiveMeta }) {
  return (
    <DeskInteractiveItem position={position} scale={scale} meta={meta}>
      <SculptedDeskPlant soft={meta.interactiveId === "plant-right"} />
    </DeskInteractiveItem>
  );
}

function KeyboardAndMouse({ surfaceY }: { surfaceY: number }) {
  const { keyboard, mouse } = DESK_OBJECT_DIMENSIONS;
  return (
    <>
      <DeskInteractiveItem position={[-.05, surfaceY + keyboard.height / 2 + .008, .35]} meta={META.keyboard}>
        <RoundedBox args={[keyboard.width, keyboard.height, keyboard.depth]} radius={.009} smoothness={4} castShadow>
          <meshStandardMaterial color="#494d49" roughness={.46} metalness={.45} />
        </RoundedBox>
        <Keycaps />
      </DeskInteractiveItem>
      <DeskInteractiveItem position={[.28, surfaceY + mouse.height / 2 + .008, .36]} rotation={[0, -.08, 0]} meta={META.mouse}>
        <mesh castShadow scale={[mouse.width / 2, mouse.height / 2, mouse.length / 2]}><sphereGeometry args={[1, 24, 16]} /><meshStandardMaterial color="#bab9ae" roughness={.61} /></mesh>
        <mesh position={[0,mouse.height*.46,-.033]}><boxGeometry args={[.0008,.001,.023]}/><meshStandardMaterial color="#454941" roughness={.85}/></mesh>
        <mesh position={[0, mouse.height * .45, -mouse.length * .16]}><boxGeometry args={[.008, .004, .026]} /><meshStandardMaterial color="#7b838b" roughness={.5} /></mesh>
      </DeskInteractiveItem>
    </>
  );
}

function Phone({ surfaceY }: { surfaceY: number }) {
  const phone = DESK_OBJECT_DIMENSIONS.phone;
  return <DeskInteractiveItem position={[-.69, surfaceY, .40]} rotation={[0, .12, 0]} meta={META.phone}>
    <RoundedBox args={[.084, .008, .072]} radius={.003} position={[0, .004, -.02]} castShadow receiveShadow><meshStandardMaterial color="#272a2c" roughness={.38} metalness={.75} /></RoundedBox>
    <RoundedBox args={[.045, .082, .005]} radius={.002} position={[0, .047, -.024]} rotation={[-.22, 0, 0]} castShadow><meshStandardMaterial color="#383c3f" roughness={.4} metalness={.72} /></RoundedBox>
    <group position={[0, .088, -.005]} rotation={[-.22, 0, 0]}>
      <RoundedBox args={[phone.width, phone.height, phone.depth]} radius={.004} smoothness={4} castShadow><meshStandardMaterial color="#15181b" roughness={.3} metalness={.35} /></RoundedBox>
      <mesh position={[0, 0, phone.depth / 2 + .0004]}><planeGeometry args={[phone.width * .91, phone.height * .94]} /><meshPhysicalMaterial color="#101a21" roughness={.16} metalness={.12} clearcoat={.65} /></mesh>
      <mesh position={[0, .064, .005]}><boxGeometry args={[.018, .002, .001]} /><meshStandardMaterial color="#08090a" roughness={.4} /></mesh>
    </group>
    <RoundedBox args={[.066, .006, .018]} radius={.002} position={[0, .010, .012]} castShadow><meshStandardMaterial color="#272a2c" roughness={.5} metalness={.6} /></RoundedBox>
  </DeskInteractiveItem>;
}

function NotebookAndWatch({ surfaceY }: { surfaceY: number }) {
  const { notebook, watch } = DESK_OBJECT_DIMENSIONS;
  const dialRadius = watch.dialDiameter / 2;
  return (
    <>
      <DeskInteractiveItem position={[-.49, surfaceY + notebook.height / 2 + .0001, .36]} rotation={[0, -.13, 0]} meta={META.notebook}>
        <RoundedBox args={[notebook.width - .003, notebook.height * .8, notebook.depth - .003]} radius={.003} smoothness={3} castShadow><meshStandardMaterial color="#d3cbb7" roughness={.93} /></RoundedBox>
        <mesh position={[.01, notebook.height / 2 + .0035, .006]} rotation={[-Math.PI / 2, 0, -.12]} castShadow><cylinderGeometry args={[.0035, .0035, .145, 10]} /><meshStandardMaterial color="#0f1113" roughness={.35} metalness={.5} /></mesh>
        <mesh position={[.002, 0, .003]}><boxGeometry args={[notebook.width - .008, notebook.height * .55, notebook.depth - .004]} /><meshStandardMaterial color="#c8bfa7" roughness={.93} /></mesh>
        {[-1, 1].map((side) => <mesh key={side} position={[0, side * notebook.height * .45, 0]}><boxGeometry args={[notebook.width, .002, notebook.depth]} /><meshStandardMaterial color="#302921" roughness={.78} /></mesh>)}
      </DeskInteractiveItem>
      <DeskInteractiveItem position={[.64, surfaceY + .0036, .35]} rotation={[-Math.PI / 2, 0, -.1]} meta={META.watch}>
        <mesh castShadow><torusGeometry args={[dialRadius * .78, dialRadius * .18, 10, 24]} /><meshStandardMaterial color="#131619" roughness={.3} metalness={.68} /></mesh>
        <mesh position={[0, 0, .001]}><circleGeometry args={[dialRadius * .7, 24]} /><meshStandardMaterial color="#27313b" roughness={.18} metalness={.45} /></mesh>
        {[-1, 1].map((side) => <mesh key={side} position={[0, side * .053, 0]}><boxGeometry args={[.018, .073, .005]} /><meshStandardMaterial color="#2b2725" roughness={.72} /></mesh>)}
        <WatchFace radius={dialRadius * .66} />
      </DeskInteractiveItem>
    </>
  );
}

export function RuntianBottle({ surfaceY }: { surfaceY: number }) {
  const bottle = DESK_OBJECT_DIMENSIONS.runtianBottle;
  return <DeskInteractiveItem position={[.47, surfaceY, .035]} rotation={[0, .22, 0]} meta={META.runtian}>
    <RuntianReferenceModel url={RUNTIAN_BOTTLE_MODEL} height={bottle.height} diameter={bottle.diameter} />
    <PropContact radius={bottle.diameter * .36} opacity={.13} />
  </DeskInteractiveItem>;
}

useGLTF.preload(RUNTIAN_BOTTLE_MODEL);

export function FujiXT5({ surfaceY }: { surfaceY: number }) {
  return (
    <DeskInteractiveItem position={[.97, surfaceY, .16]} rotation={[0, -.3, 0]} meta={META.camera}>
      <DetailedFujiCamera />
    </DeskInteractiveItem>
  );
}

export function DesktopPC({ groupRef }: { groupRef?: RefObject<THREE.Group | null> }) {
  const { position, rotation, scale } = DESKTOP_PC_TRANSFORM;
  return (
    <DeskInteractiveItem groupRef={groupRef} position={position} rotation={rotation} scale={scale} meta={META.pc}>
      <RoundedBox args={[DESKTOP_PC_BASE_SIZE.width, DESKTOP_PC_BASE_SIZE.height, DESKTOP_PC_BASE_SIZE.depth]} radius={.065} smoothness={5} castShadow receiveShadow>
        <meshPhysicalMaterial color="#0b0f14" roughness={.28} metalness={.45} transparent opacity={.93} />
      </RoundedBox>
      <mesh position={[0, .18, .337]}><torusGeometry args={[.17, .018, 12, 40]} /><meshStandardMaterial color="#5b5b52" roughness={.5} metalness={.65} /></mesh>
      <mesh position={[0, -.37, .338]}><boxGeometry args={[.2, .035, .01]} /><meshStandardMaterial color="#393c39" roughness={.65} /></mesh>
      <mesh position={[.19, .49, .34]}><circleGeometry args={[.01, 12]} /><meshBasicMaterial color="#e6c394" toneMapped={false} /></mesh>
      <mesh position={[-.315, 0, 0]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[.5, 1.02]} /><meshPhysicalMaterial color="#222a30" roughness={.21} metalness={.1} transparent opacity={.6} /></mesh>
      {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[0, .615, -.22 + i * .035]}><boxGeometry args={[.38, .003, .011]} /><meshStandardMaterial color="#050607" roughness={.72} /></mesh>)}
    </DeskInteractiveItem>
  );
}

export function DeskAccessories() {
  const { desk } = CENTRAL_WORKSPACE;
  const mat = DESK_OBJECT_DIMENSIONS.deskMat;
  const surfaceY = .14 + desk.height + desk.topThickness / 2;
  return (
    <group>
      <RoundedBox args={[mat.width, mat.height, mat.depth]} radius={.018} smoothness={5} position={[-.04, surfaceY + mat.height / 2, .35]} receiveShadow castShadow>
        <meshStandardMaterial color="#393d35" roughness={.96} />
      </RoundedBox>
      <KeyboardAndMouse surfaceY={surfaceY} />
      <DeskLamp surfaceY={surfaceY} />
      <DeskPlant position={[-1.06, surfaceY + .06075, -.12]} scale={.45} meta={META.plantLeft} />
      <Phone surfaceY={surfaceY} />
      <NotebookAndWatch surfaceY={surfaceY} />
      <RuntianBottle surfaceY={surfaceY} />
      <DeskPlant position={[1.11, surfaceY + .06075, -.49]} scale={.45} meta={META.plantRight} />
      <FujiXT5 surfaceY={surfaceY} />
      <DeskCables surfaceY={surfaceY} />
    </group>
  );
}

export function CentralWorkspace() {
  const surfaceY = .14 + CENTRAL_WORKSPACE.desk.height + CENTRAL_WORKSPACE.desk.topThickness / 2;
  const deskBoundsRef = useRef<THREE.Group>(null);
  const pcBoundsRef = useRef<THREE.Group>(null);

  return (
    <group position={CENTRAL_WORKSPACE.position}>
      <group ref={deskBoundsRef}><OfficeDesk /></group>
      <ChairMotion><OfficeChair /></ChairMotion>
      {/* Scale about the supporting surface, so every prop stays grounded.
          Move the enlarged arrangement back to keep the mat inside the edge. */}
      <group scale={DESK_PROP_SCALE} position={[0, surfaceY * (1 - DESK_PROP_SCALE), -.35]}>
        <CentralMonitor />
        <DeskAccessories />
      </group>
      <DeskAquascape surfaceY={surfaceY} />
      <DesktopPC groupRef={pcBoundsRef} />
    </group>
  );
}
