"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import styles from "./RoomNavigation.module.css";

// Content is portalled beside the persistent room. Restore exactly the inert
// flags and focus we borrowed; never remount the room to close a module.
export function RoomModuleOverlay({ children, label, returnLabel, onClose }: { children: ReactNode; label: string; returnLabel: string; onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    const siblings = Array.from(document.body.children).filter((node): node is HTMLElement => node instanceof HTMLElement && node !== element);
    const inert = siblings.map(node => node.inert);
    siblings.forEach(node => { node.inert = true; });
    document.body.style.overflow = "hidden";
    element.focus({ preventScroll: true });
    const trap = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const items = Array.from(element.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], [tabindex="0"]')).filter(node => node.getClientRects().length > 0);
      const first = items[0], last = items[items.length - 1];
      if (!first) { event.preventDefault(); return; }
      if (event.shiftKey && (document.activeElement === first || document.activeElement === element)) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || document.activeElement === element)) { event.preventDefault(); first.focus(); }
    };
    element.addEventListener("keydown", trap);
    return () => {
      element.removeEventListener("keydown", trap);
      siblings.forEach((node, index) => { node.inert = inert[index]; });
      document.body.style.overflow = overflow;
      if (previous?.isConnected) previous.focus({ preventScroll: true });
    };
  }, []);
  return createPortal(<div ref={root} className={styles.module} role="dialog" aria-modal="true" aria-label={label} tabIndex={-1}>
    <button type="button" className={`${styles.button} ${styles.moduleReturn}`} onClick={onClose}>← {returnLabel}</button>
    {children}
  </div>, document.body);
}
