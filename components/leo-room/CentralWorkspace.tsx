"use client";

import { RoundedBox as DreiRoundedBox, useGLTF, useTexture } from "@react-three/drei";
import { useEffect, useLayoutEffect, useMemo, useRef, type ComponentProps, type RefObject } from "react";
import * as THREE from "three";
import { CENTRAL_WORKSPACE, DESK_OBJECT_DIMENSIONS } from "@/data/leoRoomWorkspace";
import { DeskInteractiveItem } from "./DeskInteractiveItem";
import { DetailedFujiCamera, DeskCables, DeskFoliage, Keycaps, WatchFace } from "./DeskDetails";
import { useThree } from "@react-three/fiber";

// Thin devices need a bevel smaller than their thinnest dimension. Larger
// radii create inverted extrusion walls in Drei's RoundedBox geometry.
function RoundedBox({ args = [1, 1, 1], radius = .025, ...props }: ComponentProps<typeof DreiRoundedBox>) {
  return <DreiRoundedBox {...props} args={args} radius={Math.min(radius, Math.min(...args.map(value => value ?? 1)) * .45)} bevelSegments={2} />;
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

function useGeneratedTexture(factory: () => THREE.Texture) {
  const texture = useMemo(factory, [factory]);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

function createWoodTexture() {
  const width = 512;
  const height = 256;
  const data = new Uint8Array(width * height * 4);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * 4;
      const broad = Math.sin(y * .13 + Math.sin(x * .009) * 2.4) * 12;
      const fine = Math.sin(y * 1.2 + Math.sin(x * .035) * 1.9) * 7;
      const knot = Math.sin(Math.hypot((x - 174) * .2, y - 128) * .37) * 4;
      data[i] = 91 + broad + fine + knot;
      data[i + 1] = 57 + broad * .43 + fine * .32;
      data[i + 2] = 37 + broad * .18;
      data[i + 3] = 255;
    }
  }
  const texture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1.6, 1.2);
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

function canvasTexture(width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  if (typeof document === "undefined") return new THREE.Texture();
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.Texture();
  draw(context);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

function createConsoleTexture() {
  return canvasTexture(1280, 640, (ctx) => {
    const gradient = ctx.createLinearGradient(0, 0, 1280, 640);
    gradient.addColorStop(0, "#061126");
    gradient.addColorStop(.55, "#08234c");
    gradient.addColorStop(1, "#040b19");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1280, 640);

    ctx.strokeStyle = "rgba(75, 220, 255, .12)";
    ctx.lineWidth = 1;
    for (let x = 0; x < 1280; x += 96) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 640); ctx.stroke();
    }
    for (let y = 0; y < 640; y += 80) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1280, y); ctx.stroke();
    }

    ctx.fillStyle = "rgba(241,247,255,.95)";
    ctx.font = "600 34px Arial";
    ctx.fillText("LEO’S ROOM", 62, 66);
    ctx.fillStyle = "rgba(104,224,255,.72)";
    ctx.font = "500 17px Arial";
    ctx.fillText("CENTRAL CONSOLE / 中央控制台", 62, 96);

    const cx = 640;
    const cy = 330;
    ctx.strokeStyle = "rgba(211,167,94,.78)";
    ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(cx, cy, 102, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = "rgba(74,218,255,.33)";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx, cy, 126, 0, Math.PI * 2); ctx.stroke();
    const glow = ctx.createRadialGradient(cx, cy, 10, cx, cy, 92);
    glow.addColorStop(0, "rgba(76,218,255,.5)");
    glow.addColorStop(1, "rgba(27,70,151,.5)");
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(cx, cy, 88, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#f6f3e9";
    ctx.font = "600 28px Arial";
    ctx.textAlign = "center";
    ctx.fillText("LEO", cx, cy - 2);
    ctx.fillStyle = "rgba(133,228,255,.8)";
    ctx.font = "500 15px Arial";
    ctx.fillText("CENTRAL NODE", cx, cy + 28);

    const nodes = [
      ["PROJECTS", 330, 210], ["PROFILE", 330, 410], ["DIGITAL LAB", 950, 210],
      ["MY WORLD", 950, 410], ["CHILDHOOD", 490, 535], ["THE OTHER SIDE", 790, 535],
    ] as const;
    nodes.forEach(([label, x, y], index) => {
      ctx.strokeStyle = index % 2 === 0 ? "rgba(74,218,255,.65)" : "rgba(211,167,94,.58)";
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(x - 104, y - 34, 208, 68, 12); ctx.stroke();
      ctx.fillStyle = "rgba(8,20,45,.78)";
      ctx.beginPath(); ctx.roundRect(x - 102, y - 32, 204, 64, 11); ctx.fill();
      ctx.fillStyle = "rgba(241,247,255,.88)";
      ctx.font = "500 17px Arial";
      ctx.textAlign = "center";
      ctx.fillText(label, x, y + 6);
      ctx.strokeStyle = "rgba(93,193,226,.22)";
      ctx.beginPath(); ctx.moveTo(cx + (x < cx ? -104 : 104), cy); ctx.lineTo(x + (x < cx ? 105 : -105), y); ctx.stroke();
    });
  });
}

function createRuntianLabelTexture() {
  return canvasTexture(512, 230, (ctx) => {
    ctx.fillStyle = "#e9f7f6";
    ctx.fillRect(0, 0, 512, 230);
    ctx.fillStyle = "#087a9d";
    ctx.fillRect(0, 0, 512, 62);
    ctx.fillStyle = "#15944e";
    ctx.fillRect(0, 164, 512, 66);
    ctx.fillStyle = "#126a8a";
    ctx.font = "700 70px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("润田", 256, 142);
    ctx.font = "600 24px sans-serif";
    ctx.fillText("RUNTIAN", 256, 38);
  });
}

function createFujiLabelTexture() {
  return canvasTexture(480, 120, (ctx) => {
    ctx.fillStyle = "#111214";
    ctx.fillRect(0, 0, 480, 120);
    ctx.fillStyle = "#f2f2ec";
    ctx.font = "700 58px Arial";
    ctx.textAlign = "center";
    ctx.fillText("FUJIFILM", 240, 77);
  });
}

function WoodMaterial({ texture }: { texture: THREE.Texture }) {
  return <meshStandardMaterial map={texture} color="#b8aaa0" roughness={.68} metalness={.018} />;
}

function OfficeDesk({ wood }: { wood: THREE.Texture }) {
  const { desk } = CENTRAL_WORKSPACE;
  const floor = .14;
  const topY = floor + desk.height;
  const legHeight = desk.height - desk.topThickness;
  const leftDrawerX = -desk.width / 2 + .53;
  const meta = META.desk;

  return (
    <group userData={meta}>
      <RoundedBox args={[desk.width, desk.topThickness, desk.depth]} radius={.055} smoothness={5} position={[0, topY, 0]} castShadow receiveShadow>
        <WoodMaterial texture={wood} />
      </RoundedBox>
      <RoundedBox args={[desk.wingWidth, desk.topThickness, desk.wingDepth]} radius={.05} smoothness={5} position={[desk.width / 2 - desk.wingWidth / 2, topY, -desk.depth * .63]} castShadow receiveShadow>
        <WoodMaterial texture={wood} />
      </RoundedBox>
      {[[-desk.width / 2 + .18, 0], [desk.width / 2 - .18, 0], [desk.width / 2 - .18, -desk.depth * .71]].map(([x, z], index) => (
        <RoundedBox key={index} args={[.14, legHeight, .14]} radius={.028} smoothness={3} position={[x, floor + legHeight / 2, z]} castShadow receiveShadow>
          <meshStandardMaterial color="#252b2e" roughness={.43} metalness={.72} />
        </RoundedBox>
      ))}
      <RoundedBox args={[.92, legHeight * .91, desk.depth * .72]} radius={.045} smoothness={4} position={[leftDrawerX, floor + legHeight * .455, .05]} castShadow receiveShadow>
        <WoodMaterial texture={wood} />
      </RoundedBox>
      {[.18, .43, .68].map((y, index) => (
        <group key={y} position={[leftDrawerX, floor + y, desk.depth * .415]}>
          <mesh castShadow><boxGeometry args={[.78, .015, .015]} /><meshStandardMaterial color="#5c321e" roughness={.62} /></mesh>
          <mesh position={[0, 0, .028]} castShadow><boxGeometry args={[.26, .035, .035]} /><meshStandardMaterial color="#151719" roughness={.35} metalness={.75} /></mesh>
        </group>
      ))}
      <RoundedBox args={[desk.width * .9, .1, .08]} radius={.012} smoothness={2} position={[0, topY - .18, -desk.depth * .38]} castShadow><meshStandardMaterial color="#252b2e" roughness={.52} metalness={.7} /></RoundedBox>
      <RoundedBox args={[desk.width * .88, .08, .18]} radius={.012} smoothness={2} position={[0, topY - .24, -desk.depth * .43]}><meshStandardMaterial color="#151b1e" roughness={.7} metalness={.5} /></RoundedBox>
      <mesh position={[0, topY + desk.topThickness / 2 + .001, -desk.depth * .4]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[.038,.051,32]} /><meshStandardMaterial color="#292e31" roughness={.5} metalness={.65} /></mesh>
      <mesh position={[0, topY + desk.topThickness / 2 + .0008, -desk.depth * .4]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[.038,24]} /><meshStandardMaterial color="#080d0f" roughness={.9} /></mesh>
      {[-1,1].map(side => <RoundedBox key={side} args={[.23,.045,desk.depth*.74]} radius={.016} smoothness={2} position={[side*(desk.width/2-.18),floor+.024,0]} castShadow><meshStandardMaterial color="#22282b" roughness={.48} metalness={.65} /></RoundedBox>)}
    </group>
  );
}

function OfficeChair() {
  const { chair } = CENTRAL_WORKSPACE;
  const [x, , z] = chair.position;
  const w = chair.width;
  const meta = META.chair;
  return (
    <group position={[x, 0, z]} rotation={[0, -.15, 0]} userData={meta}>
      <RoundedBox args={[w, .23, .82]} radius={.13} smoothness={6} position={[0, chair.seatY, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#9a4826" roughness={.47} metalness={.015} />
      </RoundedBox>
      <RoundedBox args={[w * .94, 1.02, .2]} radius={.15} smoothness={6} position={[0, chair.seatY + .6, .33]} rotation={[-.08, 0, 0]} castShadow>
        <meshStandardMaterial color="#a6532b" roughness={.46} />
      </RoundedBox>
      <RoundedBox args={[w * .76, .16, .11]} radius={.065} smoothness={5} position={[0, chair.seatY + 1.08, .27]} castShadow>
        <meshStandardMaterial color="#6f2f1c" roughness={.5} />
      </RoundedBox>
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
      <RoundedBox args={[monitor.width + .036, monitor.height + .046, monitor.depth]} radius={.018} smoothness={4} position={[0, monitor.centerY, 0]} castShadow>
        <meshStandardMaterial color="#090b0f" roughness={.2} metalness={.55} />
      </RoundedBox>
      <mesh position={[0, monitor.centerY, monitor.depth / 2 + .004]}>
        <planeGeometry args={[monitor.width, monitor.height]} />
        <meshStandardMaterial map={texture} emissiveMap={texture} emissive="#ffffff" emissiveIntensity={.28} roughness={.13} metalness={.08} toneMapped={false} />
      </mesh>
      <RoundedBox args={[monitor.width * .58, monitor.height * .55, .045]} radius={.025} smoothness={3} position={[0, monitor.centerY - .05, -.044]} castShadow><meshStandardMaterial color="#191e22" roughness={.61} metalness={.25} /></RoundedBox>
      <RoundedBox args={[.095, .46, .075]} radius={.018} smoothness={3} position={[0, surfaceY + .265, -.015]} castShadow>
        <meshStandardMaterial color="#15181b" roughness={.32} metalness={.68} />
      </RoundedBox>
      <RoundedBox args={[.48, .055, .28]} radius={.025} smoothness={3} position={[0, surfaceY + .0275, .02]} castShadow receiveShadow>
        <meshStandardMaterial color="#141619" roughness={.35} metalness={.66} />
      </RoundedBox>
      <rectAreaLight position={[0, monitor.centerY, monitor.depth + .24]} rotation={[0, 0, 0]} color="#6ecfff" intensity={1.15} width={monitor.width * .78} height={monitor.height * .72} />
    </DeskInteractiveItem>
  );
}

function DeskLamp({ surfaceY }: { surfaceY: number }) {
  const meta = META.lamp;
  const { size } = useThree();
  return (
    <DeskInteractiveItem position={[CENTRAL_WORKSPACE.desk.width * .37, surfaceY, -CENTRAL_WORKSPACE.desk.depth * .25]} meta={meta}>
      <mesh position={[0, .045, 0]} castShadow><cylinderGeometry args={[.25, .27, .08, 32]} /><meshStandardMaterial color="#101214" roughness={.26} metalness={.75} /></mesh>
      <mesh position={[0, .57, 0]} castShadow><cylinderGeometry args={[.027, .035, 1.06, 16]} /><meshStandardMaterial color="#151719" roughness={.28} metalness={.75} /></mesh>
      <mesh position={[0, 1.04, 0]} castShadow><cylinderGeometry args={[.2, .34, .25, 32, 1, true]} /><meshStandardMaterial color="#151617" roughness={.29} metalness={.7} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, .93, 0]}><sphereGeometry args={[.075, 18, 14]} /><meshStandardMaterial color="#ffd39b" emissive="#ffb666" emissiveIntensity={3.2} /></mesh>
      <pointLight position={[0, .88, .02]} color="#ffb35f" intensity={2.1} distance={2.7} decay={2} castShadow={size.width >= 768} shadow-mapSize-width={256} shadow-mapSize-height={256} />
    </DeskInteractiveItem>
  );
}

function DeskPlant({ position, scale = 1, meta }: { position: [number, number, number]; scale?: number; meta: InteractiveMeta }) {
  return (
    <DeskInteractiveItem position={position} scale={scale} meta={meta}>
      <mesh castShadow><cylinderGeometry args={[.17, .14, .27, 24]} /><meshStandardMaterial color="#74604a" roughness={.9} /></mesh>
      <mesh position={[0,.136,0]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[.155,24]} /><meshStandardMaterial color="#251e17" roughness={1} /></mesh>
      <DeskFoliage />
    </DeskInteractiveItem>
  );
}

function KeyboardAndMouse({ surfaceY }: { surfaceY: number }) {
  const { keyboard, mouse } = DESK_OBJECT_DIMENSIONS;
  return (
    <>
      <DeskInteractiveItem position={[-.05, surfaceY + keyboard.height / 2 + .008, .28]} meta={META.keyboard}>
        <RoundedBox args={[keyboard.width, keyboard.height, keyboard.depth]} radius={.009} smoothness={4} castShadow>
          <meshStandardMaterial color="#101214" roughness={.42} />
        </RoundedBox>
        <Keycaps />
      </DeskInteractiveItem>
      <DeskInteractiveItem position={[.28, surfaceY + mouse.height / 2 + .008, .28]} meta={META.mouse}>
        <mesh castShadow scale={[mouse.width / 2, mouse.height / 2, mouse.length / 2]}><sphereGeometry args={[1, 20, 14]} /><meshStandardMaterial color="#17191c" roughness={.4} /></mesh>
        <mesh position={[0, mouse.height * .45, -mouse.length * .16]}><boxGeometry args={[.008, .004, .026]} /><meshStandardMaterial color="#7b838b" roughness={.5} /></mesh>
      </DeskInteractiveItem>
    </>
  );
}

function Phone({ surfaceY }: { surfaceY: number }) {
  const phone = DESK_OBJECT_DIMENSIONS.phone;
  return (
    <DeskInteractiveItem position={[-CENTRAL_WORKSPACE.desk.width * .18, surfaceY + phone.height * .64, -.01]} rotation={[-.22, 0, 0]} meta={META.phone}>
      <RoundedBox args={[phone.width, phone.height, phone.depth]} radius={.012} smoothness={5} castShadow>
        <meshStandardMaterial color="#0c0e12" roughness={.22} metalness={.32} />
      </RoundedBox>
      <mesh position={[0, 0, phone.depth / 2 + .001]}><planeGeometry args={[phone.width * .88, phone.height * .89]} /><meshStandardMaterial color="#07172d" emissive="#124a72" emissiveIntensity={.38} roughness={.18} /></mesh>
      <RoundedBox args={[.11, .018, .075]} radius={.009} smoothness={4} position={[0, -phone.height * .48, -.035]} castShadow><meshStandardMaterial color="#121416" roughness={.34} metalness={.6} /></RoundedBox>
    </DeskInteractiveItem>
  );
}

function NotebookAndWatch({ surfaceY }: { surfaceY: number }) {
  const { notebook, watch } = DESK_OBJECT_DIMENSIONS;
  const dialRadius = watch.dialDiameter / 2;
  return (
    <>
      <DeskInteractiveItem position={[-CENTRAL_WORKSPACE.desk.width * .19, surfaceY + notebook.height / 2, .38]} rotation={[0, .1, 0]} meta={META.notebook}>
        <RoundedBox args={[notebook.width, notebook.height, notebook.depth]} radius={.007} smoothness={4} castShadow><meshStandardMaterial color="#211d1a" roughness={.78} /></RoundedBox>
        <mesh position={[.01, notebook.height * .72, .006]} rotation={[-Math.PI / 2, 0, -.12]} castShadow><cylinderGeometry args={[.0035, .0035, .145, 10]} /><meshStandardMaterial color="#0f1113" roughness={.35} metalness={.5} /></mesh>
        <mesh position={[.002, 0, .003]}><boxGeometry args={[notebook.width - .008, notebook.height * .55, notebook.depth - .004]} /><meshStandardMaterial color="#c8bfa7" roughness={.93} /></mesh>
        {[-1, 1].map((side) => <mesh key={side} position={[0, side * notebook.height * .45, 0]}><boxGeometry args={[notebook.width, .002, notebook.depth]} /><meshStandardMaterial color="#302921" roughness={.78} /></mesh>)}
      </DeskInteractiveItem>
      <DeskInteractiveItem position={[CENTRAL_WORKSPACE.desk.width * .2, surfaceY + .0036, .42]} rotation={[-Math.PI / 2, 0, -.1]} meta={META.watch}>
        <mesh castShadow><torusGeometry args={[dialRadius * .78, dialRadius * .18, 10, 24]} /><meshStandardMaterial color="#131619" roughness={.3} metalness={.68} /></mesh>
        <mesh position={[0, 0, .001]}><circleGeometry args={[dialRadius * .7, 24]} /><meshStandardMaterial color="#27313b" roughness={.18} metalness={.45} /></mesh>
        {[-1, 1].map((side) => <mesh key={side} position={[0, side * .053, 0]}><boxGeometry args={[.018, .073, .005]} /><meshStandardMaterial color="#2b2725" roughness={.72} /></mesh>)}
        <WatchFace radius={dialRadius * .66} />
      </DeskInteractiveItem>
    </>
  );
}

function CoffeeCup({ surfaceY }: { surfaceY: number }) {
  const cup = DESK_OBJECT_DIMENSIONS.coffeeCup;
  const radius = cup.diameter / 2;
  return (
    <DeskInteractiveItem position={[CENTRAL_WORKSPACE.desk.width * .18, surfaceY, .17]} meta={META.coffee}>
      <mesh position={[0, .0025, 0]} castShadow><cylinderGeometry args={[radius * 1.15, radius * 1.15, .005, 28]} /><meshStandardMaterial color="#b79a73" roughness={.74} /></mesh>
      <mesh position={[0, cup.height / 2 + .005, 0]} castShadow><cylinderGeometry args={[radius * .86, radius, cup.height, 32]} /><meshStandardMaterial color="#e8e1d5" roughness={.5} /></mesh>
      <mesh position={[0, cup.height + .006, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[radius * .82, 32]} /><meshStandardMaterial color="#25140b" roughness={.88} /></mesh>
      <mesh position={[radius * 1.02, cup.height * .55, 0]} castShadow><torusGeometry args={[radius * .42, radius * .12, 10, 22, Math.PI * 1.45]} /><meshStandardMaterial color="#e8e1d5" roughness={.5} /></mesh>
      <mesh position={[0, cup.height + .005, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[radius * .84, .003, 8, 32]} /><meshStandardMaterial color="#eee8dc" roughness={.24} /></mesh>
    </DeskInteractiveItem>
  );
}

export function RuntianBottle({ surfaceY }: { surfaceY: number }) {
  const bottle = DESK_OBJECT_DIMENSIONS.runtianBottle;
  const gltf = useGLTF(RUNTIAN_BOTTLE_MODEL);
  const model = useMemo(() => {
    const clone = gltf.scene.clone(true);
    clone.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      object.castShadow = true;
      object.receiveShadow = true;
    });
    return clone;
  }, [gltf.scene]);
  const transform = useMemo(() => {
    model.updateWorldMatrix(true, true);
    const bounds = new THREE.Box3().setFromObject(model);
    const size = bounds.getSize(new THREE.Vector3());
    const scale = bottle.height / Math.max(size.y, .0001);
    const center = bounds.getCenter(new THREE.Vector3());

    return {
      scale,
      position: new THREE.Vector3(-center.x * scale, -bounds.min.y * scale, -center.z * scale),
    };
  }, [bottle.height, model]);

  return (
    <DeskInteractiveItem position={[CENTRAL_WORKSPACE.desk.width * .245, surfaceY, -.01]} rotation={[0, -.08, 0]} meta={META.runtian}>
      <primitive object={model} position={transform.position} scale={transform.scale} dispose={null} />
    </DeskInteractiveItem>
  );
}

useGLTF.preload(RUNTIAN_BOTTLE_MODEL);

export function FujiXT5({ surfaceY }: { surfaceY: number }) {
  return (
    <DeskInteractiveItem position={[-CENTRAL_WORKSPACE.desk.width * .3, surfaceY, .12]} rotation={[0, .18, 0]} meta={META.camera}>
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
      <mesh position={[0, .18, .337]}><torusGeometry args={[.17, .018, 12, 40]} /><meshStandardMaterial color="#27c7f4" emissive="#1c9ed1" emissiveIntensity={1.6} toneMapped={false} /></mesh>
      <mesh position={[0, -.37, .338]}><boxGeometry args={[.2, .035, .01]} /><meshStandardMaterial color="#4fe3ff" emissive="#1fb7d8" emissiveIntensity={1.1} toneMapped={false} /></mesh>
      <mesh position={[.19, .49, .34]}><circleGeometry args={[.018, 12]} /><meshBasicMaterial color="#68e7ff" toneMapped={false} /></mesh>
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
      <RoundedBox args={[mat.width, mat.height, mat.depth]} radius={.018} smoothness={5} position={[-.04, surfaceY + mat.height / 2, .29]} receiveShadow castShadow>
        <meshStandardMaterial color="#242321" roughness={.88} />
      </RoundedBox>
      <KeyboardAndMouse surfaceY={surfaceY} />
      <DeskLamp surfaceY={surfaceY} />
      <DeskPlant position={[-desk.width * .38, surfaceY + .0972, -desk.depth * .3]} scale={.72} meta={META.plantLeft} />
      <Phone surfaceY={surfaceY} />
      <NotebookAndWatch surfaceY={surfaceY} />
      <CoffeeCup surfaceY={surfaceY} />
      <RuntianBottle surfaceY={surfaceY} />
      <DeskPlant position={[desk.width * .3, surfaceY + .081, -desk.depth * .66]} scale={.6} meta={META.plantRight} />
      <FujiXT5 surfaceY={surfaceY} />
      <DeskCables surfaceY={surfaceY} />
    </group>
  );
}

export function CentralWorkspace() {
  const woodTexture = useGeneratedTexture(createWoodTexture);
  const deskBoundsRef = useRef<THREE.Group>(null);
  const pcBoundsRef = useRef<THREE.Group>(null);

  useLayoutEffect(() => {
    const deskGroup = deskBoundsRef.current;
    const pcGroup = pcBoundsRef.current;
    if (!deskGroup || !pcGroup) return;

    deskGroup.updateWorldMatrix(true, true);
    pcGroup.updateWorldMatrix(true, true);
    const pcBounds = new THREE.Box3().setFromObject(pcGroup);
    const intersections: string[] = [];

    deskGroup.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      const partBounds = new THREE.Box3().setFromObject(object);
      if (pcBounds.intersectsBox(partBounds)) intersections.push(object.uuid);
    });

    if (process.env.NODE_ENV !== "production" && intersections.length > 0) {
      console.warn("Desktop PC intersects desk geometry", intersections);
    }
  }, []);

  return (
    <group position={CENTRAL_WORKSPACE.position}>
      <group ref={deskBoundsRef}><OfficeDesk wood={woodTexture} /></group>
      <OfficeChair />
      <CentralMonitor />
      <DeskAccessories />
      <DesktopPC groupRef={pcBoundsRef} />
    </group>
  );
}
