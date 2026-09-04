"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { useGlobalAudio } from "@/hooks/useGlobalAudio";
import { SiteNavbar } from "@/components/layout/SiteNavbar";
import type { ChildhoodStoryId } from "@/data/childhoodStories";
import type { LeoRoomFocusId } from "@/data/leoRoomCamera";
import { photoWallImages } from "@/data/photoWall";
import type { DeskSelection } from "@/data/deskItems";

const DeskDetailOverlay = dynamic(() => import("@/components/leo-room/DeskDetailOverlay").then((mod) => mod.DeskDetailOverlay), { ssr: false });

const LeoRoomScene = dynamic(() => import("@/components/LeoRoomScene").then((mod) => mod.LeoRoomScene), {
  ssr: false,
  loading: () => <div className="leo-room__loading">ENTERING ROOM...</div>,
});

const ChildhoodReadingOverlay = dynamic(() => import("@/components/leo-room/ChildhoodReadingOverlay").then((mod) => mod.ChildhoodReadingOverlay), {
  ssr: false,
});

const PhotoLightbox = dynamic(() => import("@/components/leo-room/PhotoLightbox").then((mod) => mod.PhotoLightbox), {
  ssr: false,
});

const focusContent = {
  gallery: {
    meta: "02 / SELECTED MOMENTS",
    cnTitle: "摄影与生活影像",
    enTitle: "Photo Wall",
    cnBody: "把现场、人物与生活中的片段，留在一面持续生长的照片墙上。",
    enBody: "A growing wall of people, places and moments observed along the way.",
    href: "/projects/photography",
  },
  digital: {
    meta: "03 / DIGITAL WORKSPACE",
    cnTitle: "数字工作实验室",
    enTitle: "Digital Lab",
    cnBody: "视觉、视频、AI 与系统在这里汇合，形成可以持续运转的方法。",
    enBody: "Where visual, video, AI and systems become repeatable ways of working.",
    href: "/leo-os",
  },
  travel: {
    meta: "04 / TRAVEL MEMORY",
    cnTitle: "我的地球",
    enTitle: "My World",
    cnBody: "把去过的地方保存为记忆坐标，并在一颗持续生长的个人地球上重新找到它们。",
    enBody: "A growing personal globe where visited places become coordinates of memory.",
    href: "/other-side/world",
  },
} as const;

type FocusCardId = "digital" | "travel";
type ActiveRoomTarget = "desk" | "childhood" | "gallery" | null;
type RoomMode = "explore" | "reading" | "photoOpen";
type RoomFocusRequest = { id: LeoRoomFocusId | "overview"; nonce: number };

export function OtherSide({ onRoomReady }: { onRoomReady?: () => void } = {}) {
  const { language } = useLanguage();
  const { switchTrack } = useGlobalAudio();
  const router = useRouter();
  const cn = language === "cn";
  const [focusRequest, setFocusRequest] = useState<RoomFocusRequest | null>(null);
  const [focusedItem, setFocusedItem] = useState<FocusCardId | null>(null);
  const [activeTarget, setActiveTarget] = useState<ActiveRoomTarget>(null);
  const [roomMode, setRoomMode] = useState<RoomMode>("explore");
  const [readingOpen, setReadingOpen] = useState(false);
  const [activeStoryId, setActiveStoryId] = useState<ChildhoodStoryId>("01");
  const [photoLightboxId, setPhotoLightboxId] = useState<string | null>(null);
  const [childhoodOverlayLoaded, setChildhoodOverlayLoaded] = useState(false);
  const [photoLightboxLoaded, setPhotoLightboxLoaded] = useState(false);
  const [showExploreHint, setShowExploreHint] = useState(true);
  const [isMobileRoom, setIsMobileRoom] = useState(false);
  const [activeDeskItem, setActiveDeskItem] = useState<DeskSelection | null>(null);
  const [showDeskHint, setShowDeskHint] = useState(false);
  const readingTimer = useRef<number | null>(null);
  const escapeKeyDownHandled = useRef(false);

  const clearReadingTimer = () => {
    if (readingTimer.current !== null) {
      window.clearTimeout(readingTimer.current);
      readingTimer.current = null;
    }
  };

  const requestRoomFocus = (id: LeoRoomFocusId | "overview") => {
    setActiveDeskItem(null);
    setFocusRequest({ id, nonce: Date.now() });
  };

  useEffect(() => {
    if (!showDeskHint) return;
    const timer = window.setTimeout(() => setShowDeskHint(false), 4200);
    return () => window.clearTimeout(timer);
  }, [showDeskHint]);

  const selectDeskItem = (item: DeskSelection) => {
    setActiveDeskItem(item);
    setFocusedItem(null);
    setActiveTarget("desk");
    setShowDeskHint(false);
  };

  useEffect(() => {
    switchTrack(readingOpen ? "childhood" : "room");
  }, [readingOpen, switchTrack]);

  useEffect(() => {
    if (readingOpen) setChildhoodOverlayLoaded(true);
  }, [readingOpen]);

  useEffect(() => {
    if (photoLightboxId) setPhotoLightboxLoaded(true);
  }, [photoLightboxId]);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowExploreHint(false), 5000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobileRoom(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  const openChildhoodReader = (id: ChildhoodStoryId) => {
    setActiveDeskItem(null);
    clearReadingTimer();
    setActiveStoryId(id);
    setFocusedItem(null);
    setActiveTarget("childhood");
    setRoomMode("reading");
    setReadingOpen(true);
  };

  const focusChildhoodWall = () => {
    clearReadingTimer();
    setReadingOpen(false);
    setFocusedItem(null);
    setPhotoLightboxId(null);
    setActiveTarget("childhood");
    setRoomMode("explore");
    requestRoomFocus("journey");
  };

  const activateChildhoodWall = (id: ChildhoodStoryId = "01") => {
    if (activeTarget === "childhood" && roomMode === "explore") {
      openChildhoodReader(id);
      return;
    }
    if (roomMode === "reading") return;
    setActiveStoryId(id);
    focusChildhoodWall();
  };

  const closeChildhoodReader = () => {
    clearReadingTimer();
    setReadingOpen(false);
    setRoomMode("explore");
    setActiveTarget("childhood");
  };

  const focusGalleryWall = () => {
    clearReadingTimer();
    setReadingOpen(false);
    setPhotoLightboxId(null);
    setActiveTarget("gallery");
    setRoomMode("explore");
    requestRoomFocus("gallery");
    setFocusedItem(null);
  };

  const openPhotoLightbox = (photoId: string) => {
    setActiveDeskItem(null);
    setFocusedItem(null);
    setActiveTarget("gallery");
    setRoomMode("photoOpen");
    setPhotoLightboxId(photoId);
  };

  const closePhotoLightbox = () => {
    setPhotoLightboxId(null);
    setRoomMode("explore");
    setActiveTarget("gallery");
  };

  const focusDesk = () => {
    clearReadingTimer();
    setReadingOpen(false);
    setPhotoLightboxId(null);
    setFocusedItem(null);
    setActiveTarget("desk");
    setRoomMode("explore");
    requestRoomFocus("desk");
    setShowDeskHint(true);
  };

  const openMyWorldMap = () => {
    setActiveDeskItem(null);
    clearReadingTimer();
    setReadingOpen(false);
    setPhotoLightboxId(null);
    setFocusedItem(null);
    setActiveTarget(null);
    setRoomMode("explore");
    router.push("/other-side/world");
  };

  const returnFromRoom = () => {
    if (activeDeskItem) { setActiveDeskItem(null); return; }
    if (photoLightboxId) {
      closePhotoLightbox();
      return;
    }
    if (activeTarget === "gallery") {
      setPhotoLightboxId(null);
      setFocusedItem(null);
      setActiveTarget(null);
      return;
    }
    if (readingOpen) {
      closeChildhoodReader();
      return;
    }
    if (activeTarget === "childhood") {
      clearReadingTimer();
      setFocusedItem(null);
      setActiveTarget(null);
      setRoomMode("explore");
      return;
    }
    if (activeTarget === "desk") {
      setActiveTarget(null);
      setFocusedItem(null);
      return;
    }
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/other-side");
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isEscape = event.key === "Escape" || event.key === "Esc" || event.key === "ESC" || event.code === "Escape";
      if (!isEscape) return;
      if (event.type === "keyup" && escapeKeyDownHandled.current) {
        escapeKeyDownHandled.current = false;
        return;
      }
      event.preventDefault();
      if (event.type === "keydown") escapeKeyDownHandled.current = true;
      if (activeDeskItem) { setActiveDeskItem(null); return; }
      if (photoLightboxId) {
        closePhotoLightbox();
        return;
      }
      if (activeTarget === "gallery") {
        setPhotoLightboxId(null);
        setFocusedItem(null);
        setActiveTarget(null);
        return;
      }
      if (readingOpen) {
        closeChildhoodReader();
        return;
      }
      if (activeTarget === "childhood") {
        clearReadingTimer();
        setFocusedItem(null);
        setActiveTarget(null);
        setRoomMode("explore");
        return;
      }
      if (activeTarget === "desk") {
        setActiveTarget(null);
        setFocusedItem(null);
        return;
      }
      setFocusedItem(null);
    };
    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("keyup", onKeyDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      document.removeEventListener("keyup", onKeyDown, true);
      clearReadingTimer();
    };
  }, [readingOpen, activeTarget, photoLightboxId, activeDeskItem]);

  const focusWall = (id: LeoRoomFocusId) => {
    setShowExploreHint(false);
    if (id === "journey") {
      setPhotoLightboxId(null);
      activateChildhoodWall("01");
      return;
    }
    if (id === "gallery") {
      focusGalleryWall();
      return;
    }
    if (id === "travel") {
      openMyWorldMap();
      return;
    }
    setPhotoLightboxId(null);
    setActiveTarget(null);
    setRoomMode("explore");
    requestRoomFocus(id);
    if (id === "digital") setFocusedItem(id);
  };

  const panel = focusedItem ? focusContent[focusedItem] : null;
  return (
    <main className={`leo-room${roomMode === "reading" ? " is-reading" : ""}`} onPointerDown={() => setShowExploreHint(false)}>
      <SiteNavbar variant="hero" />
      <button type="button" className="leo-room__mobile-back" onClick={returnFromRoom} aria-label={cn ? "返回" : "Back"}>
        <span aria-hidden="true">←</span>{cn ? "返回" : "Back"}
      </button>
      <header className="leo-room__heading">
        <p>{cn ? "LEO 的另一面" : "THE OTHER SIDE"}</p>
        <h1>Leo&apos;s Room <i>/ Leo&apos;s Office</i></h1>
        <span>{cn ? "拖动观察空间，点击左墙走进一段童年记忆。" : "Drag to look around. Select the childhood wall to enter its archive."}</span>
        <Link href="/other-side/world" className="leo-room__world-entry">
          <small>MY WORLD</small>
          <b>{cn ? "我的地球" : "Travel memory globe"}</b>
          <i>→</i>
        </Link>
      </header>
      <div className="leo-room__canvas">
        <LeoRoomScene
          onReady={onRoomReady}
          focusRequest={focusRequest}
          controlsEnabled={roomMode === "explore"}
          onWallFocus={focusWall}
          onDeskFocus={focusDesk}
          onChildhoodActivate={activateChildhoodWall}
          onPhotoSelect={(photo) => openPhotoLightbox(photo.id)}
          photoLightboxEnabled={activeTarget === "gallery" && roomMode === "explore"}
          activeDeskItem={activeDeskItem}
          onDeskItemSelect={selectDeskItem}
        />
      </div>

      {activeDeskItem && <DeskDetailOverlay id={activeDeskItem.id} onClose={() => setActiveDeskItem(null)} />}

      {panel && (
        <aside className="leo-room__focus-card" aria-live="polite">
          <button type="button" className="leo-room__focus-close" onClick={() => setFocusedItem(null)} aria-label={cn ? "关闭" : "Close"}>×</button>
          <p>{panel.meta}</p>
          <h2>{cn ? panel.cnTitle : panel.enTitle}</h2>
          <span>{cn ? panel.cnBody : panel.enBody}</span>
          <Link href={panel.href}>{cn ? "查看内容" : "View content"}<b>→</b></Link>
        </aside>
      )}

      {childhoodOverlayLoaded && (
        <ChildhoodReadingOverlay
          open={readingOpen}
          activeId={activeStoryId}
          onClose={closeChildhoodReader}
        />
      )}

      {photoLightboxLoaded && (
        <PhotoLightbox
          photos={photoWallImages}
          selectedId={photoLightboxId}
          onSelect={setPhotoLightboxId}
          onClose={closePhotoLightbox}
        />
      )}

      {activeTarget === "childhood" && roomMode === "explore" && !readingOpen && (
        <button type="button" className="leo-room__childhood-hint" onClick={() => openChildhoodReader(activeStoryId)}>
          <span>{cn ? "再次点击入口画面" : "CLICK THE WALL AGAIN"}</span>
          <b>{cn ? "进入童年故事 →" : "Enter the story →"}</b>
        </button>
      )}

      {activeTarget === "desk" && roomMode === "explore" && showDeskHint && !activeDeskItem && (
        <div className="leo-room__desk-hint">
          <span>{cn ? "工作台" : "MY DESK"}</span>
          <b>{cn ? "点击桌面物件，探索我的工作方式" : "CLICK AN OBJECT TO EXPLORE"}</b>
        </div>
      )}

      {activeTarget === "gallery" && roomMode === "explore" && !photoLightboxId && (
        <div className="leo-room__gallery-hint">
          {cn ? "点击照片，查看我的故事" : "Tap a photo to read the story"}
        </div>
      )}

      {showExploreHint && (
        <div className="leo-room__hint"><b>⌘</b>{cn ? (isMobileRoom ? "拖动探索 · 双指缩放" : "拖动探索 · 滚轮缩放") : (isMobileRoom ? "DRAG TO EXPLORE · PINCH TO ZOOM" : "DRAG TO EXPLORE · SCROLL TO ZOOM")}</div>
      )}
    </main>
  );
}
