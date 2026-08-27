"use client";

import { useEffect, useRef } from "react";

const interactiveSelector = [
  "a",
  "button",
  "[role='button']",
  "[data-cursor='interactive']",
  ".project-card",
  ".video-card",
].join(",");

const nativeCursorSelector = [
  "input",
  "textarea",
  "select",
  "[contenteditable='true']",
  "video",
  "iframe",
].join(",");

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    if (!finePointer.matches) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    let pointerX = 0;
    let pointerY = 0;
    let frame: number | null = null;

    const render = () => {
      cursor.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
      frame = null;
    };

    document.documentElement.classList.add("has-sun-cursor");

    const handleMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (frame === null) frame = window.requestAnimationFrame(render);

      const target = event.target instanceof Element ? event.target : null;
      const useNativeCursor = Boolean(target?.closest(nativeCursorSelector));
      const isInteractive = Boolean(target?.closest(interactiveSelector));

      cursor.classList.toggle("sun-cursor--hidden", useNativeCursor);
      cursor.classList.toggle("sun-cursor--active", isInteractive && !useNativeCursor);
      cursor.classList.add("sun-cursor--visible");
    };

    const handleDown = () => cursor.classList.add("sun-cursor--pressed");
    const handleUp = () => cursor.classList.remove("sun-cursor--pressed");
    const handleLeave = () => cursor.classList.remove("sun-cursor--visible");

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("mousedown", handleDown);
    window.addEventListener("mouseup", handleUp);
    document.documentElement.addEventListener("mouseleave", handleLeave);

    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      document.documentElement.classList.remove("has-sun-cursor");
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <div ref={cursorRef} className="sun-cursor" aria-hidden="true">
      <svg viewBox="0 0 38 38" role="presentation">
        <g className="sun-cursor-rays" stroke="#F4C76A" strokeLinecap="round" strokeWidth="1.5">
          <path d="M24 8.5v3" />
          <path d="m33.2 12.3-2.1 2.1" />
          <path d="M36.5 21.5h-3" />
          <path d="m33.2 30.7-2.1-2.1" />
          <path d="M24 34.5v-3" />
          <path d="m14.8 30.7 2.1-2.1" />
          <path d="m14.8 12.3 2.1 2.1" />
        </g>

        <circle className="sun-cursor-face" cx="24" cy="21.5" r="8.2" fill="#D8A84E" />
        <circle cx="21.3" cy="20.4" r=".75" fill="#4A3821" />
        <circle cx="26.7" cy="20.4" r=".75" fill="#4A3821" />
        <circle cx="19.2" cy="23" r="1.15" fill="#E89272" opacity=".42" />
        <circle cx="28.8" cy="23" r="1.15" fill="#E89272" opacity=".42" />
        <path
          className="sun-cursor-smile"
          d="M21.7 23.1c.8.75 1.55 1.05 2.3 1.05s1.5-.3 2.3-1.05"
          fill="none"
          stroke="#4A3821"
          strokeLinecap="round"
          strokeWidth="1"
        />

        <path
          className="sun-cursor-pointer"
          d="M0 .2 2.1 24l5.05-5.05L11.25 27l3.45-1.8-4.12-7.93 7.05-.75L0 .2Z"
          fill="#F4F7FF"
          stroke="#6E572D"
          strokeLinejoin="round"
          strokeWidth="1"
        />
        <path d="M1.7 2.6 3.2 19.9l3.42-3.4 4.62 8.95" fill="none" stroke="#F4C76A" strokeLinecap="round" strokeWidth="1.15" />
      </svg>
    </div>
  );
}
