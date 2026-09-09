"use client";
import { useRef, type ReactNode } from 'react';
/** One capture-phase tap gate for every 3D handler. UI lives outside this surface. */
export function RoomTouchSurface({ mobile, children }: { mobile: boolean; children: ReactNode }) {
  const gesture = useRef({ x: 0, y: 0, moved: false, pointers: new Set<number>(), lastTap: -Infinity });
  return <div className="leo-room__canvas" style={mobile ? { touchAction: 'none', overscrollBehavior: 'contain' } : undefined}
    onPointerDownCapture={e => { const g = gesture.current; if (!g.pointers.size) { g.x=e.clientX;g.y=e.clientY;g.moved=false; } g.pointers.add(e.pointerId);if(g.pointers.size>1)g.moved=true; }}
    onPointerMoveCapture={e => { const g=gesture.current;if(g.pointers.size&&Math.hypot(e.clientX-g.x,e.clientY-g.y)>9)g.moved=true; }}
    onPointerUpCapture={e => gesture.current.pointers.delete(e.pointerId)}
    onPointerCancelCapture={e => {gesture.current.pointers.delete(e.pointerId);gesture.current.moved=true;}}
    onClickCapture={e => {const g=gesture.current,now=performance.now();if(g.moved||(mobile&&now-g.lastTap<350)){e.stopPropagation();e.preventDefault();return;}g.lastTap=now;}}
  >{children}</div>;
}
