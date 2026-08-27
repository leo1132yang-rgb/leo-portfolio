"use client";

import { useGlobalAudioContext } from "@/components/audio/GlobalAudioProvider";

export function useGlobalAudio() {
  return useGlobalAudioContext();
}
