"use client";

import { useEffect, useRef } from "react";
import type { PhotoWallImage } from "@/data/photoWall";
import { useLanguage } from "@/components/LanguageProvider";
import styles from "./RoomNavigation.module.css";

type PhotoLightboxProps = {
  photos: PhotoWallImage[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onClose: () => void;
};

export function PhotoLightbox({ photos, selectedId, onSelect, onClose }: PhotoLightboxProps) {
  const { language } = useLanguage();
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus({ preventScroll: true });
    return () => { if (previous?.isConnected) previous.focus({ preventScroll: true }); };
  }, []);
  const selectedIndex = selectedId ? photos.findIndex((photo) => photo.id === selectedId) : -1;
  const photo = selectedIndex >= 0 ? photos[selectedIndex] : null;

  const goTo = (offset: number) => {
    if (!photo) return;
    const nextIndex = (selectedIndex + offset + photos.length) % photos.length;
    onSelect(photos[nextIndex].id);
  };

  useEffect(() => {
    if (!photo) return;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") goTo(-1);
      if (event.key === "ArrowRight") goTo(1);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [photo, selectedIndex, photos, onClose, onSelect]);

  if (!photo) return null;

  return (
    <div
      className="photo-wall-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${photo.title} photo preview`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <button ref={closeRef} type="button" className={`${styles.button} ${styles.photoReturn}`} onClick={onClose}>← {language === "cn" ? "返回房间" : "Return to room"}</button>
      <button type="button" className="photo-wall-lightbox__close" onClick={onClose} aria-label="关闭照片，返回房间">×</button>
      <section className="photo-wall-lightbox__image" aria-label="当前照片">
        <img key={photo.id} src={photo.previewSrc} alt={photo.title} />
      </section>
      <aside className="photo-wall-lightbox__meta">
        <p className="photo-wall-lightbox__count">{String(photo.index).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}</p>
        <h2>{photo.title}</h2>
        <span>{photo.location} · {photo.date}</span>
        <p>{photo.caption}</p>
        <nav aria-label="照片预览切换">
          <button type="button" onClick={() => goTo(-1)}>← 上一张</button>
          <button type="button" onClick={() => goTo(1)}>下一张 →</button>
        </nav>
      </aside>
    </div>
  );
}
