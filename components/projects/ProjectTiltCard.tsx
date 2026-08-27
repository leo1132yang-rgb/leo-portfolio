"use client";

import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";

type ProjectTiltCardProps = {
  children: ReactNode;
  className?: string;
};

const MAX_ROTATION_X = 4;
const MAX_ROTATION_Y = 5;

export function ProjectTiltCard({ children, className = "" }: ProjectTiltCardProps) {
  const innerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(finePointer.matches && !reducedMotion.matches);

    update();
    finePointer.addEventListener("change", update);
    reducedMotion.addEventListener("change", update);
    return () => {
      finePointer.removeEventListener("change", update);
      reducedMotion.removeEventListener("change", update);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const reset = () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    const inner = innerRef.current;
    if (!inner) return;
    inner.style.transform = "rotateX(0deg) rotateY(0deg)";
  };

  const onMouseMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!enabled || !innerRef.current) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const normalizedX = (event.clientX - bounds.left) / bounds.width * 2 - 1;
    const normalizedY = (event.clientY - bounds.top) / bounds.height * 2 - 1;
    const rotateY = normalizedX * MAX_ROTATION_Y;
    const rotateX = normalizedY * -MAX_ROTATION_X;

    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      if (!innerRef.current) return;
      innerRef.current.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
    });
  };

  return (
    <div
      className={`project-tilt-card${enabled ? " is-enabled" : ""}${className ? ` ${className}` : ""}`}
      onMouseMove={onMouseMove}
      onMouseLeave={reset}
    >
      <div ref={innerRef} className="project-tilt-card__inner">
        {children}
      </div>
    </div>
  );
}
