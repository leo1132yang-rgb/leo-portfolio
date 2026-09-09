"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { LeoRoomFocusId } from "@/data/leoRoomCamera";
import { CENTRAL_WORKSPACE } from "@/data/leoRoomWorkspace";
import { ROOM_LIFE } from "@/data/leoRoomLife";
import type { DeskSelection } from "@/data/deskItems";

export type RoomInteractionState = "FREE_EXPLORE" | "FOCUSING" | "FOCUSED" | "CONTENT_OPEN" | "RESTORING" | "APPROACHING_SEAT" | "SITTING" | "STANDING_UP";
export type RoomContent = { type: "childhood" | "world" } | { type: "photo"; id: string } | { type: "desk"; selection: DeskSelection };
export type RoomCameraSnapshot = {
  position: [number, number, number];
  rotation: [number, number, number, number];
  target: [number, number, number];
  up: [number, number, number];
  zoom: number;
  fov: number;
  controls: { minDistance: number; maxDistance: number; minPolarAngle: number; maxPolarAngle: number; minAzimuthAngle: number; maxAzimuthAngle: number; smoothTime: number; enabled: boolean };
};
export type RoomCameraDriver = {
  snapshot: () => RoomCameraSnapshot;
  focus: (id: LeoRoomFocusId, selection?: DeskSelection) => Promise<void>;
  restore: (snapshot: RoomCameraSnapshot) => Promise<void>;
  reset: () => Promise<void>;
  unlock: () => void;
  lock: () => void;
  sit: () => Promise<void>;
  stand: () => Promise<void>;
};
export type LivingShelfItem = "lamp" | "vinyl" | "drawer" | "book" | "plant";
type Model = { interactionState: RoomInteractionState; activeHotspot: LeoRoomFocusId | null; content: RoomContent | null };
const FREE: Model = { interactionState: "FREE_EXPLORE", activeHotspot: null, content: null };

export function useRoomInteractionController() {
  const [model, setModel] = useState<Model>(FREE);
  const current = useRef(model);
  const [life, setLife] = useState({ lightingMode: "ROOM_LIGHT_ON" as "ROOM_LIGHT_ON" | "ROOM_LIGHT_OFF", lightingBusy: false, chairX: CENTRAL_WORKSPACE.chair.position[0] as number, chairDragging: false, aquariumBright:true, microHint: null as "lamp" | "chair" | "seat" | null });
  const [shelf, setShelf] = useState({ shelfLampOn: true, drawerOpen: false, readingBook: false, plantTouch: 0, activeLivingShelfItem: null as LivingShelfItem | null });
  const transientDismiss=useRef<(()=>boolean)|null>(null);
  const registerTransientDismiss=useCallback((dismiss:()=>boolean)=>{transientDismiss.current=dismiss;return()=>{if(transientDismiss.current===dismiss)transientDismiss.current=null;};},[]);
  const vinylAction = useRef<(() => void) | null>(null);
  const registerVinylAction = useCallback((action: () => void) => { vinylAction.current=action; return () => { if(vinylAction.current===action)vinylAction.current=null; }; }, []);
  const shelfRef = useRef(shelf);
  const updateShelf = useCallback((patch: Partial<typeof shelf>) => { shelfRef.current = {...shelfRef.current, ...patch}; setShelf(shelfRef.current); }, []);
  const lifeRef = useRef(life);
  const lightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const updateLife = useCallback((patch: Partial<typeof life>) => { lifeRef.current = { ...lifeRef.current, ...patch }; setLife(lifeRef.current); }, []);
  const seatActive = useCallback(() => ["APPROACHING_SEAT", "SITTING", "STANDING_UP"].includes(current.current.interactionState), []);
  const toggleAquarium=useCallback(()=>{if(current.current.content||seatActive()||lifeRef.current.chairDragging)return;updateLife({aquariumBright:!lifeRef.current.aquariumBright});},[seatActive,updateLife]);
  const toggleLighting = useCallback(() => {
    if (lifeRef.current.lightingBusy || current.current.content || seatActive() || lifeRef.current.chairDragging) return;
    updateLife({ lightingMode: lifeRef.current.lightingMode === "ROOM_LIGHT_ON" ? "ROOM_LIGHT_OFF" : "ROOM_LIGHT_ON", lightingBusy: true });
    lightTimer.current = setTimeout(() => updateLife({ lightingBusy: false }), ROOM_LIFE.lightDuration * 1000);
  }, [seatActive, updateLife]);
  useEffect(() => () => { if (lightTimer.current) clearTimeout(lightTimer.current); }, []);
  const driver = useRef<RoomCameraDriver | null>(null);
  const previousCameraSnapshot = useRef<RoomCameraSnapshot | null>(null);
  const generation = useRef(0);
  const publish = useCallback((next: Model) => { current.current = next; setModel(next); }, []);
  const registerCamera = useCallback((next: RoomCameraDriver) => {
    driver.current = next;
    return () => { if (driver.current === next) driver.current = null; };
  }, []);
  const capture = useCallback(() => {
    if (driver.current && current.current.interactionState !== "FOCUSING" && current.current.interactionState !== "RESTORING") {
      previousCameraSnapshot.current = driver.current.snapshot();
    }
  }, []);

  const focusHotspot = useCallback((id: LeoRoomFocusId) => {
    if (!driver.current || current.current.content || seatActive() || lifeRef.current.chairDragging) return;
    capture();
    const token = ++generation.current;
    publish({ interactionState: "FOCUSING", activeHotspot: id, content: null });
    void driver.current.focus(id).then(() => {
      if (generation.current === token) publish({ interactionState: "FOCUSED", activeHotspot: id, content: null });
    }).catch(() => {
      if (generation.current === token) { driver.current?.unlock(); publish(FREE); }
    });
  }, [capture, publish]);

  const openContent = useCallback((content: RoomContent) => {
    if (!driver.current || seatActive() || lifeRef.current.chairDragging) return;
    updateLife({ microHint: null });
    const id = content.type === "world" ? "travel" : content.type === "childhood" ? "journey" : content.type === "photo" ? "gallery" : "desk";
    const token = ++generation.current;
    if (current.current.interactionState === "FREE_EXPLORE") capture();
    driver.current.unlock(); // stop any unfinished hotspot transition before opening
    publish({ interactionState: "CONTENT_OPEN", activeHotspot: id, content });
    if (content.type === "desk") {
      void driver.current.focus("desk", content.selection).catch(() => {
        if (generation.current === token) { driver.current?.unlock(); publish(FREE); }
      });
    }
  }, [capture, publish]);

  const standUp = useCallback(() => {
    if (!driver.current || !seatActive() || current.current.interactionState === "STANDING_UP") return;
    const token = ++generation.current;
    publish({ interactionState: "STANDING_UP", activeHotspot: null, content: null });
    void driver.current.stand().then(() => { if (generation.current === token) { driver.current?.unlock(); publish(FREE); } }).catch(() => { if (generation.current === token) { driver.current?.unlock(); publish(FREE); } });
  }, [publish, seatActive]);
  const sitDown = useCallback(() => {
    if (!driver.current || current.current.content || seatActive() || lifeRef.current.chairDragging) return;
    const token = ++generation.current;
    updateLife({ microHint: null });
    publish({ interactionState: "APPROACHING_SEAT", activeHotspot: null, content: null });
    void driver.current.sit().then(() => { if (generation.current === token) publish({ interactionState: "SITTING", activeHotspot: null, content: null }); }).catch(() => { if (generation.current === token) { driver.current?.unlock(); publish(FREE); } });
  }, [publish, seatActive, updateLife]);
  const endChairDrag = useCallback(() => { if (!lifeRef.current.chairDragging) return; updateLife({ chairDragging: false }); driver.current?.unlock(); }, [updateLife]);
  const beginChairDrag = useCallback(() => {
    if (!driver.current || current.current.content || seatActive()) return false;
    ++generation.current; driver.current.lock(); publish(FREE); updateLife({ chairDragging: true, microHint: null }); return true;
  }, [publish, seatActive, updateLife]);
  const moveChair = useCallback((x: number) => {
    if (current.current.content || seatActive()) return;
    updateLife({ chairX: Math.max(ROOM_LIFE.chairRail.min, Math.min(ROOM_LIFE.chairRail.max, x)) });
  }, [seatActive, updateLife]);
  const showMicroHint = useCallback((microHint: typeof life.microHint) => { if (!seatActive() && !current.current.content) updateLife({ microHint }); }, [seatActive, updateLife]);

  const returnToExplore = useCallback(() => {
    if (seatActive()) { standUp(); return; }
    endChairDrag(); updateLife({ microHint: null });
    // Dismissal immediately cancels focus transitions and releases the camera.
    ++generation.current;
    previousCameraSnapshot.current = null;
    driver.current?.unlock();
    publish(FREE);
  }, [publish, seatActive, standUp, endChairDrag, updateLife]);

  const resetView = useCallback(() => {
    if (!driver.current || current.current.content || seatActive() || lifeRef.current.chairDragging) return;
    const token = ++generation.current;
    publish({ interactionState: "RESTORING", activeHotspot: null, content: null });
    void driver.current.reset().then(() => {
      if (generation.current === token) { driver.current?.unlock(); publish(FREE); }
    }).catch(() => { if (generation.current === token) { driver.current?.unlock(); publish(FREE); } });
  }, [publish]);

  const takeCameraControl = useCallback(() => {
    if (current.current.content || seatActive() || lifeRef.current.chairDragging || current.current.interactionState === "FREE_EXPLORE") return;
    updateLife({ microHint: null });
    ++generation.current;
    driver.current?.unlock();
    publish(FREE);
  }, [publish]);
  const selectLivingShelfItem = useCallback((id: LivingShelfItem | null) => {
    if (current.current.content || seatActive() || lifeRef.current.chairDragging) id = null;
    if (shelfRef.current.activeLivingShelfItem !== id) updateShelf({activeLivingShelfItem:id});
    if(id && lifeRef.current.microHint) updateLife({microHint:null});
  }, [seatActive, updateShelf, updateLife]);
  const interactLivingShelf = useCallback((id: LivingShelfItem) => {
    if(current.current.content || seatActive() || lifeRef.current.chairDragging) return;
    const before=shelfRef.current;
    if(id==='lamp') updateShelf({shelfLampOn:!before.shelfLampOn});
    if(id==='vinyl') vinylAction.current?.();
    if(id==='drawer') updateShelf({drawerOpen:!before.drawerOpen});
    if(id==='book') updateShelf({readingBook:!before.readingBook});
    if(id==='plant') updateShelf({plantTouch:before.plantTouch+1});
  }, [seatActive, updateShelf, returnToExplore]);
  const selectPhoto = useCallback((id: string) => {
    if (current.current.content?.type === "photo") publish({ ...current.current, content: { type: "photo", id } });
  }, [publish]);
  const cancelBackground = useCallback(() => {
    if(!current.current.content && !seatActive()) updateShelf({readingBook:false});
    if (!seatActive() && !lifeRef.current.chairDragging && !current.current.content && (current.current.interactionState !== "FREE_EXPLORE" || lifeRef.current.microHint)) returnToExplore();
  }, [returnToExplore, seatActive, updateShelf]);

  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.type === "keydown" && event.code === "KeyE" && !event.repeat && !current.current.content) {
        if (shelfRef.current.activeLivingShelfItem) { interactLivingShelf(shelfRef.current.activeLivingShelfItem); return; }
        if (lifeRef.current.microHint === "lamp") toggleLighting();
        if (lifeRef.current.microHint === "seat") sitDown();
      }
      if (event.key !== "Escape" && event.key !== "Esc" && event.code !== "Escape") return;
      if(event.type==='keydown' && !event.repeat && !current.current.content && !seatActive() && transientDismiss.current?.()){event.preventDefault();event.stopImmediatePropagation();return;}
      if(event.type==='keydown' && !event.repeat && !current.current.content && !seatActive() && (shelfRef.current.readingBook || shelfRef.current.drawerOpen)) {
        event.preventDefault(); event.stopImmediatePropagation(); updateShelf({readingBook:false,drawerOpen:false}); returnToExplore(); return;
      }
      // One owner, registered before any module. Prevent nested game/lightbox
      // handlers and repeated keydown/keyup from dispatching a second close.
      event.preventDefault(); event.stopImmediatePropagation();
      if (event.type === "keydown" && !event.repeat && (current.current.interactionState !== "FREE_EXPLORE" || lifeRef.current.chairDragging || lifeRef.current.microHint)) returnToExplore();
    };
    window.addEventListener("keydown", escape, true);
    window.addEventListener("keyup", escape, true);
    return () => { ++generation.current; window.removeEventListener("keydown", escape, true); window.removeEventListener("keyup", escape, true); };
  }, [returnToExplore, toggleLighting, sitDown, interactLivingShelf, seatActive, updateShelf]);

  return { ...model, ...life, ...shelf, registerTransientDismiss, registerVinylAction, interactLivingShelf, selectLivingShelfItem, seatActive: seatActive(), contentOpen: !!model.content, controlsEnabled: !model.content && !seatActive() && !life.chairDragging, objectsEnabled: !model.content && !seatActive() && !life.chairDragging,
    toggleAquarium, toggleLighting, beginChairDrag, endChairDrag, moveChair, showMicroHint, sitDown, standUp, focusTarget: model.activeHotspot, previousCameraSnapshot,
    registerCamera, focusHotspot, openContent, returnToExplore, resetView, takeCameraControl, selectPhoto, cancelBackground };
}
export type RoomInteractionController = ReturnType<typeof useRoomInteractionController>;
