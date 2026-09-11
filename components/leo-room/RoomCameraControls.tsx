"use client";

import { useRoomMobile } from "./useRoomMobile";
import { CameraControls, type CameraControlsImpl } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { leoRoomExploreProfiles, leoRoomFocusTargets, leoRoomInspectSize, leoRoomMobileOverviewCamera, leoRoomOverviewCamera } from "@/data/leoRoomCamera";
import { ROOM, ROOM_STRUCTURE } from "@/data/leoRoomDimensions";
import { constrainRoomCamera, sweepRoomCamera } from "./roomSpatialBounds";
import { ROOM_LIFE } from "@/data/leoRoomLife";
import type { RoomCameraDriver, RoomInteractionController } from "./useRoomInteractionController";

export function RoomCameraControls({ interaction }: { interaction: RoomInteractionController }) {
  const ref = useRef<CameraControlsImpl>(null);
  const { camera, size, gl, raycaster, events } = useThree();
  const chairX = useRef(interaction.chairX); chairX.current=interaction.chairX;
  const touchMobile = useRoomMobile();
  const mobile = size.width < 768 || touchMobile;
  const profile = mobile ? leoRoomExploreProfiles.mobile : leoRoomExploreProfiles.desktop;
  const viewport = useRef({ mobile, profile });
  viewport.current = { mobile, profile };
  const seatActiveRef = useRef(interaction.seatActive);
  seatActiveRef.current = interaction.seatActive;
  const initialised = useRef(false);
  const travelGeneration = useRef(0);
  const lastCamera = useRef<THREE.Vector3 | null>(null);
  const seated = useRef(false);
  const look = useRef({ yaw: 0, pitch: 0, shownYaw: 0, shownPitch: 0 });
  const animation = useRef<{ elapsed: number; duration: number; from: THREE.Vector3; fromTarget: THREE.Vector3; to: THREE.Vector3; target: THREE.Vector3; mid?: THREE.Vector3; midTarget?: THREE.Vector3; fromFov: number; toFov: number; resolve: () => void; sitting: boolean } | null>(null);
  const seat = ROOM_LIFE.lounge;
  const seatEye = new THREE.Vector3(0, seat.cushionY + seat.cushionThickness / 2 + seat.eyeAboveSeat, .09).applyAxisAngle(new THREE.Vector3(0,1,0),seat.yaw).add(new THREE.Vector3(...seat.origin)).add(new THREE.Vector3(...seat.chairOrigin));
  const seatTarget = new THREE.Vector3(...ROOM_LIFE.windowTarget);
  useFrame((_, delta) => {
    const orbit = ref.current;
    if (!orbit || !(camera instanceof THREE.PerspectiveCamera)) return;
    const a = animation.current;
    if (a) {
      a.elapsed += Math.min(delta, .1);
      const t = Math.min(1, a.elapsed / a.duration), smooth = (x: number) => x*x*(3-2*x);
      const pos = new THREE.Vector3(), target = new THREE.Vector3();
      if (a.mid && a.midTarget) {
        if (t < .52) { pos.lerpVectors(a.from,a.mid,smooth(t/.52)); target.lerpVectors(a.fromTarget,a.midTarget,smooth(t/.52)); }
        else { pos.lerpVectors(a.mid,a.to,smooth((t-.52)/.48)); target.lerpVectors(a.midTarget,a.target,smooth((t-.52)/.48)); }
      } else { pos.lerpVectors(a.from,a.to,smooth(t)); target.lerpVectors(a.fromTarget,a.target,smooth(t)); }
      camera.fov=THREE.MathUtils.lerp(a.fromFov,a.toFov,smooth(t));camera.updateProjectionMatrix();
      void orbit.setLookAt(...pos.toArray(),...target.toArray(),false);orbit.update(0);
      if(t===1){animation.current=null;seated.current=a.sitting;a.resolve();}
    } else if (seated.current) {
      gl.domElement.dataset.seatEye=seatEye.toArray().map(v=>v.toFixed(4)).join(",");
      gl.domElement.dataset.seatLook=[look.current.yaw,look.current.pitch].map(v=>v.toFixed(4)).join(",");
      const l=look.current;l.shownYaw=THREE.MathUtils.damp(l.shownYaw,l.yaw,12,delta);l.shownPitch=THREE.MathUtils.damp(l.shownPitch,l.pitch,12,delta);
      const direction=seatTarget.clone().sub(seatEye).normalize();
      const yaw=Math.atan2(direction.x,direction.z)+l.shownYaw;
      const pitch=Math.asin(direction.y)+l.shownPitch;
      const target=seatEye.clone().add(new THREE.Vector3(Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch),Math.cos(yaw)*Math.cos(pitch)).multiplyScalar(3));
      void orbit.setLookAt(...seatEye.toArray(),...target.toArray(),false);orbit.update(0);
    }
  });
  // Run after CameraControls updates. Decorative meshes never force a dolly jump.
  useFrame(()=>{
    const orbit=ref.current;if(!orbit)return;
    if(animation.current||seated.current){lastCamera.current=camera.position.clone();return;}
    const safe=lastCamera.current?sweepRoomCamera(lastCamera.current,camera.position,chairX.current):constrainRoomCamera(camera.position,chairX.current);
    if(Math.hypot(safe.x-camera.position.x,safe.y-camera.position.y,safe.z-camera.position.z)>.0001){
      const target=orbit.getTarget(new THREE.Vector3(),false);
      void orbit.setLookAt(safe.x,safe.y,safe.z,...target.toArray(),false);orbit.update(0);
    }
    lastCamera.current=camera.position.clone();
  });
  useEffect(() => {
    const canvas=events.connected || gl.domElement;
    let pointer: {id:number;x:number;y:number} | null=null;
    const down=(e:PointerEvent)=>{if(!seated.current||pointer)return;pointer={id:e.pointerId,x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);};
    const move=(e:PointerEvent)=>{if(!seated.current||pointer?.id!==e.pointerId)return;look.current.yaw=THREE.MathUtils.clamp(look.current.yaw-(e.clientX-pointer.x)*(viewport.current.mobile?.004:.0032),-ROOM_LIFE.lookYaw*(viewport.current.mobile?.8:1),ROOM_LIFE.lookYaw*(viewport.current.mobile?.8:1));look.current.pitch=THREE.MathUtils.clamp(look.current.pitch+(e.clientY-pointer.y)*.0025,-ROOM_LIFE.lookPitch*(viewport.current.mobile?.8:1),ROOM_LIFE.lookPitch*(viewport.current.mobile?.8:1));pointer.x=e.clientX;pointer.y=e.clientY;};
    const up=(e:PointerEvent)=>{if(pointer?.id===e.pointerId){pointer=null;if(canvas.hasPointerCapture(e.pointerId))canvas.releasePointerCapture(e.pointerId);}};
    const key=(e:KeyboardEvent)=>{if(!seated.current||!e.key.startsWith("Arrow")||(e.target as HTMLElement)?.closest?.("input,button,select,textarea,[role=slider]"))return;e.preventDefault();if(e.key==="ArrowLeft"||e.key==="ArrowRight")look.current.yaw=THREE.MathUtils.clamp(look.current.yaw+(e.key==="ArrowLeft"?.035:-.035),-ROOM_LIFE.lookYaw,ROOM_LIFE.lookYaw);else look.current.pitch=THREE.MathUtils.clamp(look.current.pitch+(e.key==="ArrowUp"?.025:-.025),-ROOM_LIFE.lookPitch,ROOM_LIFE.lookPitch);};
    canvas.addEventListener("pointerdown",down,true);canvas.addEventListener("pointermove",move,true);canvas.addEventListener("pointerup",up,true);canvas.addEventListener("pointercancel",up,true);window.addEventListener("keydown",key);
    return()=>{canvas.removeEventListener("pointerdown",down,true);canvas.removeEventListener("pointermove",move,true);canvas.removeEventListener("pointerup",up,true);canvas.removeEventListener("pointercancel",up,true);window.removeEventListener("keydown",key);};
  },[gl,events.connected]);
  useEffect(()=>{const mask=raycaster.layers.mask;if(interaction.seatActive)raycaster.layers.mask=0;return()=>{raycaster.layers.mask=mask;};},[interaction.seatActive,raycaster]);
  const gestureTaken = useRef(false);
  const { registerCamera, controlsEnabled, takeCameraControl } = interaction;
  // Local QA can verify the actual rendered camera and persistent Canvas via
  // DOM attributes. No globals, extra renderer, or production telemetry.
  useFrame(() => {
    if (process.env.NODE_ENV !== "development" || !ref.current) return;
    const data = gl.domElement.dataset;
    data.roomCamera = camera.position.toArray().map(value => value.toFixed(4)).join(",");
    data.roomTarget = ref.current.getTarget(new THREE.Vector3(), false).toArray().map(value => value.toFixed(4)).join(",");
    data.roomControls = String(ref.current.enabled);
  });
  useEffect(() => {
    const orbit = ref.current;
    if (!orbit || !(camera instanceof THREE.PerspectiveCamera)) return;
    const overview = mobile ? leoRoomMobileOverviewCamera : leoRoomOverviewCamera;

    orbit.boundaryFriction=.25;
    const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    camera.fov = profile.fov; camera.updateProjectionMatrix();
    if (!initialised.current) {
      initialised.current = true;
      void orbit.setLookAt(...overview.position, ...overview.target, false);
    }
    const applyLimits = () => {
    orbit.setBoundary(new THREE.Box3(new THREE.Vector3(-ROOM_STRUCTURE.halfWidth+.02,.05,-ROOM_STRUCTURE.halfDepth+.02),new THREE.Vector3(ROOM_STRUCTURE.halfWidth-.02,ROOM.height-.05,ROOM_STRUCTURE.halfDepth-.02)));
      const { profile } = viewport.current;
      orbit.maxDistance = profile.maxDistance;
      orbit.minPolarAngle = profile.minPolarAngle; orbit.maxPolarAngle = profile.maxPolarAngle;
      orbit.minAzimuthAngle = profile.minAzimuthAngle; orbit.maxAzimuthAngle = profile.maxAzimuthAngle;
      orbit.smoothTime = viewport.current.mobile ? .32 : .38;
    };
    applyLimits();
    const freeze = () => {
      ++travelGeneration.current;
      if (animation.current) { animation.current.resolve(); animation.current=null; }
      seated.current=false;
      // camera-controls.stop() snaps to the queued destination. Replace that
      // destination with the currently rendered pose before stopping instead.
      const position = camera.position.clone();
      const target = orbit.getTarget(new THREE.Vector3(), false);
      void orbit.setLookAt(...position.toArray(), ...target.toArray(), false);
      void orbit.zoomTo(camera.zoom, false);
      orbit.stop();
    };
    const unlock = () => {
      const { profile } = viewport.current;
      freeze(); applyLimits();
      // An inspected desk prop may be nearer than the normal dolly limit.
      // Keep that view on close, allowing the very next gesture without a jump.
      orbit.minDistance = Math.min(profile.minDistance, orbit.getPosition(new THREE.Vector3(), false).distanceTo(orbit.getTarget(new THREE.Vector3(), false)));
      orbit.enabled = true;
    };
    const animateSeat = (sitting: boolean) => {
      const { profile } = viewport.current;
      freeze(); orbit.setBoundary(); orbit.enabled=false; orbit.minDistance=.01; orbit.maxDistance=80;
      orbit.minAzimuthAngle=-Infinity;orbit.maxAzimuthAngle=Infinity;orbit.minPolarAngle=0;orbit.maxPolarAngle=Math.PI;
      look.current={yaw:0,pitch:0,shownYaw:0,shownPitch:0};
      return new Promise<void>(resolve=>{animation.current={elapsed:0,duration:reduced()?.01:(sitting?ROOM_LIFE.sitDuration:ROOM_LIFE.standDuration)*(viewport.current.mobile?1.3:1),from:camera.position.clone(),fromTarget:orbit.getTarget(new THREE.Vector3(),false),to:sitting?seatEye.clone():new THREE.Vector3(...ROOM_LIFE.standPosition),target:sitting?seatTarget.clone():new THREE.Vector3(...ROOM_LIFE.standTarget),mid:sitting?new THREE.Vector3(...ROOM_LIFE.standPosition):undefined,midTarget:sitting?new THREE.Vector3(...ROOM_LIFE.standTarget):undefined,fromFov:camera.fov,toFov:sitting?58:profile.fov,resolve,sitting};});
    };
    const moveTo = (to:THREE.Vector3,target:THREE.Vector3) => new Promise<void>(resolve=>{
      const from=camera.position.clone(), fromTarget=orbit.getTarget(new THREE.Vector3(),false);
      // Cartesian travel avoids the wide spherical arcs that crossed side walls.
      const lift=from.y<1.65&&from.distanceTo(to)>3;
      animation.current={elapsed:0,duration:reduced()?.01:1.15,from,fromTarget,to,target,
        mid:lift?new THREE.Vector3(from.x,2.4,from.z):undefined,
        midTarget:lift?fromTarget.clone():undefined,fromFov:camera.fov,toFov:camera.fov,resolve,sitting:false};
    });
    const driver: RoomCameraDriver = {
      lock: () => { freeze(); orbit.enabled=false; },
      sit: () => animateSeat(true),
      stand: () => animateSeat(false),
      snapshot: () => ({ position: orbit.getPosition(new THREE.Vector3(), false).toArray(), target: orbit.getTarget(new THREE.Vector3(), false).toArray(),
        rotation: camera.quaternion.toArray(), up: camera.up.toArray(), zoom: camera.zoom, fov: camera.fov,
        controls: { minDistance: orbit.minDistance, maxDistance: orbit.maxDistance, minPolarAngle: orbit.minPolarAngle, maxPolarAngle: orbit.maxPolarAngle, minAzimuthAngle: orbit.minAzimuthAngle, maxAzimuthAngle: orbit.maxAzimuthAngle, smoothTime: orbit.smoothTime, enabled: orbit.enabled } }),
      unlock,
      focus: async (id, selection) => {
        const { mobile, profile } = viewport.current;
        freeze(); applyLimits();
        const generation=travelGeneration.current;
        if (selection) {
          const center = new THREE.Vector3(...selection.center);
          const distance = Math.max(mobile ? .85 : .52, Math.max(...selection.size) * (mobile ? 2.4 : 1.7));
          const direction = orbit.getPosition(new THREE.Vector3(), false).sub(orbit.getTarget(new THREE.Vector3(), false)).normalize();
          direction.y = Math.max(direction.y, .48);
          const position = center.clone().add(direction.normalize().multiplyScalar(distance));
          if (mobile) center.y -= distance * .17;
          orbit.minDistance = Math.min(profile.minDistance, distance * .8); orbit.smoothTime = .6;
          await moveTo(position,center);
        } else {
          const destination = leoRoomFocusTargets[id];
          const target=new THREE.Vector3(...destination.target), position=new THREE.Vector3(...destination.position);
          const [width,height]=leoRoomInspectSize[id], tangent=Math.tan(THREE.MathUtils.degToRad(camera.fov)/2);
          const fit=Math.max(height/(2*tangent*(mobile?.7:1)),width/(2*tangent*camera.aspect))*1.12;
          const direction=position.clone().sub(target);
          const designed=direction.length();
          position.copy(target).add(direction.normalize().multiplyScalar(Math.max(designed,fit)));
          const safe=constrainRoomCamera(position,chairX.current);
          orbit.minDistance=profile.minDistance;orbit.smoothTime=.55;
          await moveTo(new THREE.Vector3(safe.x,safe.y,safe.z),target);
          if(generation===travelGeneration.current){
            orbit.minAzimuthAngle=Math.max(profile.minAzimuthAngle,orbit.azimuthAngle-.62);
            orbit.maxAzimuthAngle=Math.min(profile.maxAzimuthAngle,orbit.azimuthAngle+.62);
            orbit.minPolarAngle=Math.max(profile.minPolarAngle,orbit.polarAngle-.3);
            orbit.maxPolarAngle=Math.min(profile.maxPolarAngle,orbit.polarAngle+.3);
          }
        }
      },
      restore: async snapshot => {
        freeze();
        Object.assign(orbit, snapshot.controls, { enabled: true });
        camera.up.fromArray(snapshot.up); orbit.updateCameraUp();
        camera.fov = snapshot.fov; camera.updateProjectionMatrix();
        await Promise.all([orbit.zoomTo(snapshot.zoom, !reduced()), orbit.setLookAt(...snapshot.position, ...snapshot.target, !reduced())]);
      },
      reset: async () => {
        const { mobile, profile } = viewport.current;
        const overview = mobile ? leoRoomMobileOverviewCamera : leoRoomOverviewCamera;
        freeze(); applyLimits(); orbit.minDistance = profile.minDistance;
        await moveTo(new THREE.Vector3(...overview.position),new THREE.Vector3(...overview.target));
      },
    };
    const unregister=registerCamera(driver);
    return () => { freeze(); unregister(); };
  }, [camera, registerCamera]);
  // Resizing must not cancel an active sit/stand promise or release its camera.
  useEffect(() => {
    const orbit = ref.current;
    if (!orbit || !(camera instanceof THREE.PerspectiveCamera)) return;
    if (seatActiveRef.current) {
      orbit.minDistance = .01; orbit.maxDistance = 80;
      orbit.minAzimuthAngle = -Infinity; orbit.maxAzimuthAngle = Infinity;
      orbit.minPolarAngle = 0; orbit.maxPolarAngle = Math.PI;
      orbit.enabled = false;
    } else { camera.fov = profile.fov; camera.updateProjectionMatrix(); }
  }, [camera, profile]);
  // Imperative enable also covers a close immediately followed by an open in
  // the same React batch, when the boolean prop itself has not changed.
  useEffect(() => {
    if (ref.current) ref.current.enabled = controlsEnabled;
    if (process.env.NODE_ENV === "development") gl.domElement.dataset.roomControls = String(controlsEnabled);
  }, [controlsEnabled, interaction.content, gl]);
  return <CameraControls ref={ref} makeDefault enabled={controlsEnabled} smoothTime={mobile?.32:.38} draggingSmoothTime={mobile?.18:.15}
    minDistance={profile.minDistance} maxDistance={profile.maxDistance} minPolarAngle={profile.minPolarAngle} maxPolarAngle={profile.maxPolarAngle}
    minAzimuthAngle={profile.minAzimuthAngle} maxAzimuthAngle={profile.maxAzimuthAngle}
    azimuthRotateSpeed={mobile ? .32 : .4} polarRotateSpeed={mobile ? .26 : .34} dollySpeed={.65} truckSpeed={mobile?.75:1.0} dollyToCursor={false} infinityDolly={false}
    onControlStart={() => { gestureTaken.current = false; }}
    onControl={() => { if (!gestureTaken.current) { gestureTaken.current = true; takeCameraControl(); } }}
    onControlEnd={() => { gestureTaken.current = false; }} />;
}
