"use client";
import { useEffect, useState } from 'react';
// Small portrait screens and touch-only landscape phones use the same input tier.
export const ROOM_MOBILE_QUERY = '(max-width: 767px), (pointer: coarse) and (max-height: 600px)';
export function useRoomMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const query = window.matchMedia(ROOM_MOBILE_QUERY);
    const update = () => setMobile(query.matches);
    update(); query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, []);
  return mobile;
}
