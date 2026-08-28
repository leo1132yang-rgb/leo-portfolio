"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { useGlobalAudio } from "@/hooks/useGlobalAudio";
import { SiteNavbar } from "@/components/layout/SiteNavbar";
import type { ChildhoodStoryId } from "@/data/childhoodStories";
import { leoRoomPresetLabels, type LeoRoomFocusId, type LeoRoomPresetId } from "@/data/leoRoomCamera";
import { photoWallImages } from "@/data/photoWall";

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

type FocusCardId = Exclude<LeoRoomFocusId, "journey">;
type ChildhoodViewState = "overview" | "focused" | "reading";
type GalleryViewState = "overview" | "focused" | "lightbox";

export function OtherSide() {
  const { language } = useLanguage();
  const { switchTrack } = useGlobalAudio();
  const cn = language === "cn";
  const [activePreset, setActivePreset] = useState<LeoRoomPresetId>("overview");
  const [focusedItem, setFocusedItem] = useState<FocusCardId | null>(null);
  const [readingOpen, setReadingOpen] = useState(false);
  const [childhoodViewState, setChildhoodViewState] = useState<ChildhoodViewState>("overview");
  const [galleryViewState, setGalleryViewState] = useState<GalleryViewState>("overview");
  const [activeStoryId, setActiveStoryId] = useState<ChildhoodStoryId>("01");
  const [photoLightboxId, setPhotoLightboxId] = useState<string | null>(null);
  const [childhoodOverlayLoaded, setChildhoodOverlayLoaded] = useState(false);
  const [photoLightboxLoaded, setPhotoLightboxLoaded] = useState(false);
  const readingTimer = useRef<number | null>(null);
  const escapeKeyDownHandled = useRef(false);

  const clearReadingTimer = () => {
    if (readingTimer.current !== null) {
      window.clearTimeout(readingTimer.current);
      readingTimer.current = null;
    }
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

  const openChildhoodReader = (id: ChildhoodStoryId) => {
    clearReadingTimer();
    setActiveStoryId(id);
    setFocusedItem(null);
    setActivePreset("journey");
    setChildhoodViewState("reading");
    setReadingOpen(true);
  };

  const focusChildhoodWall = () => {
    clearReadingTimer();
    setReadingOpen(false);
    setFocusedItem(null);
    setActivePreset("journey");
    setChildhoodViewState("focused");
  };

  const activateChildhoodWall = (id: ChildhoodStoryId = "01") => {
    if (childhoodViewState === "focused") {
      openChildhoodReader(id);
      return;
    }
    if (childhoodViewState === "reading") return;
    setActiveStoryId(id);
    focusChildhoodWall();
  };

  const closeChildhoodReader = () => {
    clearReadingTimer();
    setReadingOpen(false);
    setActivePreset("journey");
    setChildhoodViewState("focused");
  };

  const focusGalleryWall = () => {
    clearReadingTimer();
    setReadingOpen(false);
    setChildhoodViewState("overview");
    setPhotoLightboxId(null);
    setActivePreset("gallery");
    setFocusedItem(null);
    setGalleryViewState("focused");
  };

  const openPhotoLightbox = (photoId: string) => {
    setActivePreset("gallery");
    setFocusedItem(null);
    setPhotoLightboxId(photoId);
    setGalleryViewState("lightbox");
  };

  const closePhotoLightbox = () => {
    setPhotoLightboxId(null);
    setActivePreset("gallery");
    setGalleryViewState("focused");
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
      if (photoLightboxId) {
        closePhotoLightbox();
        return;
      }
      if (galleryViewState === "focused") {
        setGalleryViewState("overview");
        setPhotoLightboxId(null);
        setActivePreset("overview");
        setFocusedItem(null);
        return;
      }
      if (readingOpen) {
        closeChildhoodReader();
        return;
      }
      if (childhoodViewState === "focused") {
        clearReadingTimer();
        setChildhoodViewState("overview");
        setActivePreset("overview");
        setFocusedItem(null);
        return;
      }
      setFocusedItem(null);
      setActivePreset("overview");
    };
    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("keyup", onKeyDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      document.removeEventListener("keyup", onKeyDown, true);
      clearReadingTimer();
    };
  }, [readingOpen, childhoodViewState, galleryViewState, photoLightboxId]);

  const choosePreset = (preset: LeoRoomPresetId) => {
    if (preset === "journey") {
      setGalleryViewState("overview");
      setPhotoLightboxId(null);
      focusChildhoodWall();
      return;
    }
    if (preset === "gallery") {
      focusGalleryWall();
      return;
    }
    clearReadingTimer();
    setReadingOpen(false);
    setChildhoodViewState("overview");
    setGalleryViewState("overview");
    setPhotoLightboxId(null);
    setFocusedItem(null);
    setActivePreset(preset);
  };

  const focusWall = (id: LeoRoomFocusId) => {
    if (id === "journey") {
      setGalleryViewState("overview");
      setPhotoLightboxId(null);
      activateChildhoodWall("01");
      return;
    }
    if (id === "gallery") {
      focusGalleryWall();
      return;
    }
    setChildhoodViewState("overview");
    setGalleryViewState("overview");
    setPhotoLightboxId(null);
    setActivePreset(id);
    setFocusedItem(id);
  };

  const panel = focusedItem ? focusContent[focusedItem] : null;

  return (
    <main className={`leo-room${childhoodViewState === "reading" ? " is-reading" : ""}`}>
      <SiteNavbar variant="hero" />
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
          activePreset={activePreset}
          onWallFocus={focusWall}
          onChildhoodActivate={activateChildhoodWall}
          onPhotoSelect={(photo) => openPhotoLightbox(photo.id)}
          photoLightboxEnabled={galleryViewState === "focused"}
        />
      </div>

      <nav className="leo-room__presets" aria-label={cn ? "房间观察机位" : "Room camera views"}>
        {leoRoomPresetLabels.map((preset, index) => (
          <button
            type="button"
            key={preset.id}
            className={activePreset === preset.id ? "is-active" : ""}
            onClick={() => choosePreset(preset.id)}
          >
            <small>0{index + 1}</small>
            <span>{preset.label}</span>
          </button>
        ))}
      </nav>

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

      {childhoodViewState === "focused" && !readingOpen && (
        <div className="leo-room__childhood-hint">
          <span>CLICK AGAIN TO ENTER</span>
          <b>{cn ? "再次点击进入故事" : "Enter the story"}</b>
        </div>
      )}

      {galleryViewState === "focused" && !photoLightboxId && (
        <div className="leo-room__gallery-hint">
          {cn ? "点击照片，查看我的故事" : "Tap a photo to read the story"}
        </div>
      )}

      <div className="leo-room__hint"><b>⌘</b>{cn ? "拖动 · 滚轮缩放 · Esc 返回总览" : "Drag · Scroll to zoom · Esc for overview"}</div>
    </main>
  );
}
