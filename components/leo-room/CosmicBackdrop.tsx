"use client";

import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { ROOM, ROOM_STRUCTURE } from "@/data/leoRoomDimensions";

const COSMIC_IMAGE = "/room/leo-cosmic-galaxy.png";

const cosmicVertexShader = `
  varying vec3 vDirection;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vDirection = normalize((modelMatrix * vec4(position, 0.0)).xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const cosmicFragmentShader = `
  precision highp float;
  varying vec3 vDirection;
  varying vec2 vUv;

  void main() {
    float vertical = clamp(vDirection.y * 0.5 + 0.5, 0.0, 1.0);
    vec3 lower = vec3(0.005, 0.012, 0.030);
    vec3 middle = vec3(0.012, 0.027, 0.058);
    vec3 upper = vec3(0.018, 0.027, 0.066);
    vec3 color = mix(lower, middle, smoothstep(0.05, 0.58, vertical));
    color = mix(color, upper, smoothstep(0.62, 1.0, vertical));

    float horizon = pow(max(0.0, 1.0 - abs(vDirection.y)), 4.0);
    float coolPocket = smoothstep(0.9, 0.1, distance(vUv, vec2(0.72, 0.55)));
    color += vec3(0.007, 0.022, 0.045) * horizon;
    color += vec3(0.005, 0.012, 0.032) * coolPocket;

    gl_FragColor = vec4(color, 1.0);
  }
`;

const nebulaFragmentShader = `
  precision highp float;
  varying vec3 vDirection;
  varying vec2 vUv;
  uniform float uTime;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 4; i++) {
      value += amplitude * noise(p);
      p = p * 2.03 + vec2(13.7, 8.3);
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 drift = vec2(uTime * 0.003, -uTime * 0.0015);
    float cloud = fbm(vUv * vec2(5.2, 3.0) + drift);
    float fineCloud = fbm(vUv * vec2(10.0, 5.5) - drift * 0.45);
    float diagonal = vUv.y - (0.53 + 0.10 * sin(vUv.x * 6.28318 + 0.65));
    float galaxyBand = exp(-pow(diagonal * 5.2, 2.0));
    float sideMist = smoothstep(0.92, 0.18, distance(vUv, vec2(0.19, 0.48)));
    float density = galaxyBand * (0.055 + cloud * 0.16 + fineCloud * 0.035);
    density += sideMist * cloud * 0.045;

    vec3 cyan = vec3(0.11, 0.38, 0.52);
    vec3 indigo = vec3(0.16, 0.18, 0.44);
    vec3 warmDust = vec3(0.35, 0.25, 0.16);
    vec3 color = mix(indigo, cyan, smoothstep(0.28, 0.82, cloud));
    color = mix(color, warmDust, galaxyBand * smoothstep(0.72, 0.98, fineCloud) * 0.18);

    gl_FragColor = vec4(color, density);
}
`;

const galaxyImageFragmentShader = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uMap;

  void main() {
    vec4 image = texture2D(uMap, vUv);
    float left = smoothstep(0.0, 0.075, vUv.x);
    float right = 1.0 - smoothstep(0.925, 1.0, vUv.x);
    float bottom = smoothstep(0.0, 0.09, vUv.y);
    float top = 1.0 - smoothstep(0.91, 1.0, vUv.y);
    float feather = left * right * bottom * top;
    vec3 graded = image.rgb * vec3(0.68, 0.74, 0.82);
    gl_FragColor = vec4(graded, feather * 0.9);
  }
`;

const auraFragmentShader = `
  precision highp float;
  varying vec2 vUv;

  void main() {
    vec2 centered = (vUv - 0.5) * vec2(1.0, 1.35);
    float distanceFromCenter = length(centered);
    float alpha = (1.0 - smoothstep(0.18, 0.72, distanceFromCenter)) * 0.085;
    gl_FragColor = vec4(vec3(0.08, 0.30, 0.44), alpha);
  }
`;

const veilFragmentShader = `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(41.13, 289.71))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 4; i++) {
      value += amplitude * noise(p);
      p = p * 2.08 + vec2(7.4, 11.8);
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 centered = (vUv - 0.5) * vec2(1.0, 1.8);
    centered.y += centered.x * 0.22;
    float feather = 1.0 - smoothstep(0.18, 0.72, length(centered));
    float cloud = fbm(vUv * vec2(6.0, 3.4) + vec2(uTime * 0.002, 0.0));
    float textureMask = smoothstep(0.30, 0.88, cloud);
    float alpha = feather * (0.055 + textureMask * 0.17);
    vec3 cool = vec3(0.10, 0.31, 0.48);
    vec3 indigo = vec3(0.18, 0.16, 0.42);
    vec3 warmDust = vec3(0.34, 0.23, 0.14);
    vec3 color = mix(indigo, cool, cloud);
    color = mix(color, warmDust, smoothstep(0.82, 0.98, cloud) * 0.12);
    gl_FragColor = vec4(color, alpha);
  }
`;

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}

function useCosmicTexture() {
  const texture = useTexture(COSMIC_IMAGE);

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;
  }, [texture]);

  return texture;
}

function GalaxyImageBackdrop() {
  const texture = useCosmicTexture();
  const geometry = useMemo(() => {
    const nextGeometry = new THREE.PlaneGeometry(78, 43.9, 48, 24);
    const positions = nextGeometry.attributes.position as THREE.BufferAttribute;

    for (let index = 0; index < positions.count; index += 1) {
      const x = positions.getX(index);
      const normalizedX = Math.abs(x) / 39;
      positions.setZ(index, -Math.pow(normalizedX, 1.7) * 8.5);
    }
    positions.needsUpdate = true;
    nextGeometry.computeVertexNormals();
    return nextGeometry;
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <mesh geometry={geometry} position={[0, 6.7, -35]} renderOrder={-96} frustumCulled={false} raycast={() => null}>
      <shaderMaterial
        vertexShader={cosmicVertexShader}
        fragmentShader={galaxyImageFragmentShader}
        uniforms={{ uMap: { value: texture } }}
        transparent
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

function FloatingRoomAura() {
  return (
    <mesh position={[0, -.16, .35]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={-20} raycast={() => null}>
      <planeGeometry args={[ROOM.width + 4.2, ROOM.depth + 3.2]} />
      <shaderMaterial
        vertexShader={cosmicVertexShader}
        fragmentShader={auraFragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  );
}

function NebulaLayer({ reducedMotion }: { reducedMotion: boolean }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock }) => {
    if (!materialRef.current || reducedMotion) return;
    materialRef.current.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <mesh renderOrder={-90} frustumCulled={false} raycast={() => null}>
      <sphereGeometry args={[53, 64, 36]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={cosmicVertexShader}
        fragmentShader={nebulaFragmentShader}
        uniforms={{ uTime: { value: 0 } }}
        side={THREE.BackSide}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  );
}

function GalaxyVeil({ reducedMotion }: { reducedMotion: boolean }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock }) => {
    if (!materialRef.current || reducedMotion) return;
    materialRef.current.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <mesh position={[0, 7, -35]} rotation={[0, 0, -.16]} renderOrder={-85} frustumCulled={false} raycast={() => null}>
      <planeGeometry args={[58, 28, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={cosmicVertexShader}
        fragmentShader={veilFragmentShader}
        uniforms={{ uTime: { value: 0 } }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  );
}

function StarField({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const geometry = useMemo(() => {
    let seed = 1729;
    const random = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
    const positions: number[] = [];
    const colors: number[] = [];
    const palette = [
      new THREE.Color("#d9efff"),
      new THREE.Color("#7fc9e8"),
      new THREE.Color("#9ba7dc"),
      new THREE.Color("#f0d8bd"),
    ];

    for (let index = 0; index < 220; index += 1) {
      const x = (random() - .5) * 52;
      const y = -3 + random() * 27;
      const z = -18 - random() * 25;
      const color = palette[Math.floor(random() * palette.length)];
      positions.push(x, y, z);
      colors.push(color.r, color.g, color.b);
    }

    const nextGeometry = new THREE.BufferGeometry();
    nextGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    nextGeometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    return nextGeometry;
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((_, delta) => {
    if (!groupRef.current || reducedMotion) return;
    groupRef.current.rotation.y += delta * 0.0018;
    groupRef.current.rotation.z += delta * 0.00035;
  });

  return (
    <group ref={groupRef} renderOrder={-80}>
      <points geometry={geometry} frustumCulled={false} raycast={() => null}>
        <pointsMaterial
          size={.055}
          sizeAttenuation
          vertexColors
          transparent
          opacity={.42}
          depthWrite={false}
          toneMapped={false}
        />
      </points>
    </group>
  );
}

export function CosmicBackdrop() {
  const reducedMotion = useReducedMotion();

  return (
    <group name="cosmic-backdrop">
      <mesh renderOrder={-100} frustumCulled={false} raycast={() => null}>
        <sphereGeometry args={[56, 64, 36]} />
        <shaderMaterial
          vertexShader={cosmicVertexShader}
          fragmentShader={cosmicFragmentShader}
          side={THREE.BackSide}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <GalaxyImageBackdrop />
      <NebulaLayer reducedMotion={reducedMotion} />
      <GalaxyVeil reducedMotion={reducedMotion} />
      <StarField reducedMotion={reducedMotion} />
      <FloatingRoomAura />
    </group>
  );
}

export function WindowCosmicExterior() {
  const texture = useCosmicTexture();
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const reducedMotion = useReducedMotion();
  const centerY = ROOM_STRUCTURE.window.sill + ROOM_STRUCTURE.window.height / 2;

  useFrame(({ clock }) => {
    if (!materialRef.current || reducedMotion) return;
    materialRef.current.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <group name="window-exterior-group">
      <mesh
        position={[ROOM_STRUCTURE.halfWidth + 5.2, centerY + .18, ROOM_STRUCTURE.window.centerZ + .08]}
        rotation={[0, -Math.PI / 2, 0]}
        renderOrder={6}
        raycast={() => null}
      >
        <planeGeometry args={[8.9, 5]} />
        <meshBasicMaterial
          map={texture}
          side={THREE.DoubleSide}
          toneMapped={false}
          depthWrite={false}
          stencilWrite
          stencilRef={1}
          stencilFunc={THREE.EqualStencilFunc}
          stencilFail={THREE.KeepStencilOp}
          stencilZFail={THREE.KeepStencilOp}
          stencilZPass={THREE.KeepStencilOp}
        />
      </mesh>
      <mesh
        position={[ROOM_STRUCTURE.halfWidth + 2.6, centerY + .12, ROOM_STRUCTURE.window.centerZ - .12]}
        rotation={[0, -Math.PI / 2, -.06]}
        renderOrder={7}
        raycast={() => null}
      >
        <planeGeometry args={[5.2, 3.5]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={cosmicVertexShader}
          fragmentShader={veilFragmentShader}
          uniforms={{ uTime: { value: 0 } }}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
          stencilWrite
          stencilRef={1}
          stencilFunc={THREE.EqualStencilFunc}
          stencilFail={THREE.KeepStencilOp}
          stencilZFail={THREE.KeepStencilOp}
          stencilZPass={THREE.KeepStencilOp}
        />
      </mesh>
    </group>
  );
}
