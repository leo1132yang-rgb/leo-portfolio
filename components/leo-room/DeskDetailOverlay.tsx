"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { deskItems, type DeskItemId } from "@/data/deskItems";
import { useLanguage } from "@/components/LanguageProvider";
import styles from "./DeskInteraction.module.css";

export function DeskDetailOverlay({ id, onClose }: { id: DeskItemId; onClose: () => void }) {
  const { language } = useLanguage();
  const cn = language === "cn";
  const item = deskItems[id];
  const close = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    close.current?.focus({ preventScroll: true });
    return () => previous?.focus?.({ preventScroll: true });
  }, []);
  return <aside className={styles.detail} role="dialog" aria-modal="false" aria-labelledby="desk-item-title" key={id}>
    <button ref={close} type="button" className={styles.close} onClick={onClose} aria-label={cn ? "关闭物件介绍，返回房间" : "Close detail and return to room"}>×</button>
    <p className={styles.eyebrow}>LEO’S DESK <span>/ {item.tag}</span></p>
    <h2 id="desk-item-title">{cn ? item.title : item.en}</h2>
    <p className={styles.body}>{cn ? item.cn : item.body}</p>
    {item.href && <Link className={styles.cta} href={item.href}>{cn ? item.cta : item.ctaEn}<span>↗</span></Link>}
    <p className={styles.foot}>{cn ? "ESC / 关闭 · 继续自由探索" : "ESC / CLOSE · EXPLORE FREELY"}</p>
  </aside>;
}
