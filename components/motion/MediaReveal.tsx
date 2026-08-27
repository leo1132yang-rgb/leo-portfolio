"use client";
import { useEffect, useRef, type ReactNode } from "react";
export function MediaReveal({ children, className = "" }: { children: ReactNode; className?: string }) { const ref = useRef<HTMLDivElement>(null); useEffect(() => { const el = ref.current; if (!el) return; const io = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { el.classList.add("is-visible"); io.disconnect(); } }, { threshold: .1 }); io.observe(el); return () => io.disconnect(); }, []); return <div ref={ref} className={`media-reveal ${className}`}>{children}</div>; }
