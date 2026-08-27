"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

export type AudioTrackKey = "global" | "projects" | "room" | "childhood";

type AudioTrackConfig = {
  key: AudioTrackKey;
  label: string;
  src: string;
  baseVolume: number;
};

type GlobalAudioContextValue = {
  currentTrack: AudioTrackKey;
  isEnabled: boolean;
  isPlaying: boolean;
  volume: number;
  enableAudio: () => void;
  disableAudio: () => void;
  toggleAudio: () => void;
  setVolume: (volume: number) => void;
  switchTrack: (track: AudioTrackKey) => void;
};

const STORAGE_KEY = "leo-global-audio";
const CROSSFADE_MS = 1500;

export const audioTracks: Record<AudioTrackKey, AudioTrackConfig> = {
  global: {
    key: "global",
    label: "GLOBAL",
    src: "/audio/global.mp3",
    baseVolume: 0.16,
  },
  projects: {
    key: "projects",
    label: "PROJECTS",
    src: "/audio/projects.mp3",
    baseVolume: 0.14,
  },
  room: {
    key: "room",
    label: "ROOM",
    src: "/audio/room.mp3",
    baseVolume: 0.18,
  },
  childhood: {
    key: "childhood",
    label: "CHILDHOOD",
    src: "/audio/childhood.mp3",
    baseVolume: 0.13,
  },
};

const GlobalAudioContext = createContext<GlobalAudioContextValue | null>(null);

function getTrackForPath(pathname: string): AudioTrackKey {
  if (pathname.startsWith("/projects")) return "projects";
  if (pathname.startsWith("/other-side")) return "room";
  return "global";
}

function clampVolume(value: number) {
  if (Number.isNaN(value)) return 0.8;
  return Math.min(1, Math.max(0, value));
}

function targetVolumeFor(track: AudioTrackKey, masterVolume: number) {
  return audioTracks[track].baseVolume * clampVolume(masterVolume);
}

function isAutoplayPolicyError(error: unknown) {
  if (!(error instanceof DOMException)) return false;
  return error.name === "NotAllowedError" || error.name === "AbortError";
}

function createAudio(track: AudioTrackKey) {
  const audio = new Audio(audioTracks[track].src);
  audio.loop = true;
  audio.preload = "auto";
  audio.crossOrigin = "anonymous";
  audio.volume = 0;
  audio.addEventListener("error", () => {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[GlobalAudio] Could not load track "${track}" from ${audioTracks[track].src}.`);
    }
  });
  return audio;
}

function fadeAudio(audio: HTMLAudioElement, from: number, to: number, duration = CROSSFADE_MS, onDone?: () => void) {
  const startedAt = performance.now();
  let frame = 0;

  const tick = (now: number) => {
    const progress = Math.min(1, (now - startedAt) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    audio.volume = Math.max(0, Math.min(1, from + (to - from) * eased));
    if (progress < 1) {
      frame = requestAnimationFrame(tick);
      return;
    }
    onDone?.();
  };

  frame = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(frame);
}

export function GlobalAudioProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const routeTrack = useMemo(() => getTrackForPath(pathname), [pathname]);
  const [currentTrack, setCurrentTrack] = useState<AudioTrackKey>(routeTrack);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [preferencesReady, setPreferencesReady] = useState(false);
  const [pendingAutoplay, setPendingAutoplay] = useState(false);
  const [volumeState, setVolumeState] = useState(0.8);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const trackRef = useRef<AudioTrackKey>(routeTrack);
  const fadeCancelRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setIsEnabled(true);
        return;
      }
      const saved = JSON.parse(raw) as { isEnabled?: boolean; volume?: number };
      setIsEnabled(typeof saved.isEnabled === "boolean" ? saved.isEnabled : true);
      if (typeof saved.volume === "number") setVolumeState(clampVolume(saved.volume));
    } catch {
      // Storage is non-critical; the site should never fail because audio preferences cannot be read.
      setIsEnabled(true);
    } finally {
      setPreferencesReady(true);
    }
  }, []);

  useEffect(() => {
    if (!preferencesReady) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ isEnabled, volume: volumeState }));
    } catch {
      // Ignore storage write failures.
    }
  }, [isEnabled, preferencesReady, volumeState]);

  const stopCurrent = useCallback(() => {
    fadeCancelRef.current?.();
    fadeCancelRef.current = null;
    const currentAudio = audioRef.current;
    if (!currentAudio) {
      setIsPlaying(false);
      return;
    }
    const from = currentAudio.volume;
    fadeCancelRef.current = fadeAudio(currentAudio, from, 0, CROSSFADE_MS, () => {
      currentAudio.pause();
      currentAudio.src = "";
      currentAudio.load();
      if (audioRef.current === currentAudio) audioRef.current = null;
      setIsPlaying(false);
    });
  }, []);

  const startTrack = useCallback(async (track: AudioTrackKey) => {
    trackRef.current = track;
    setCurrentTrack(track);
    if (!isEnabled || !preferencesReady) return;

    const previousAudio = audioRef.current;
    if (previousAudio && previousAudio.dataset.track === track) {
      try {
        await previousAudio.play();
        setPendingAutoplay(false);
        setIsPlaying(true);
        fadeCancelRef.current?.();
        fadeCancelRef.current = fadeAudio(previousAudio, previousAudio.volume, targetVolumeFor(track, volumeState));
      } catch (error) {
        if (isAutoplayPolicyError(error)) {
          setPendingAutoplay(true);
        } else if (process.env.NODE_ENV !== "production") {
          console.warn(`[GlobalAudio] Playback failed for "${track}".`, error);
        }
        setIsPlaying(false);
      }
      return;
    }

    fadeCancelRef.current?.();
    const nextAudio = createAudio(track);
    nextAudio.dataset.track = track;
    audioRef.current = nextAudio;

    try {
      await nextAudio.play();
      setPendingAutoplay(false);
      setIsPlaying(true);
      if (process.env.NODE_ENV !== "production") console.log(`[GlobalAudio] switch -> ${track}`);
      fadeAudio(nextAudio, 0, targetVolumeFor(track, volumeState));
    } catch (error) {
      if (isAutoplayPolicyError(error)) {
        setPendingAutoplay(true);
      } else if (process.env.NODE_ENV !== "production") {
        console.warn(`[GlobalAudio] Playback failed for "${track}".`, error);
      }
      setIsPlaying(false);
    }

    if (previousAudio) {
      const from = previousAudio.volume;
      fadeAudio(previousAudio, from, 0, CROSSFADE_MS, () => {
        previousAudio.pause();
        previousAudio.src = "";
        previousAudio.load();
      });
    }
  }, [isEnabled, preferencesReady, volumeState]);

  useEffect(() => {
    startTrack(routeTrack);
  }, [routeTrack, startTrack]);

  useEffect(() => {
    const currentAudio = audioRef.current;
    if (!currentAudio) return;
    fadeCancelRef.current?.();
    fadeCancelRef.current = fadeAudio(currentAudio, currentAudio.volume, targetVolumeFor(trackRef.current, volumeState), 420);
  }, [volumeState]);

  const enableAudio = useCallback(() => {
    setIsEnabled(true);
  }, []);

  useEffect(() => {
    if (!preferencesReady) return;
    if (isEnabled) {
      startTrack(trackRef.current);
      return;
    }
    stopCurrent();
  }, [isEnabled, preferencesReady, startTrack, stopCurrent]);

  const disableAudio = useCallback(() => {
    setPendingAutoplay(false);
    setIsEnabled(false);
  }, []);

  useEffect(() => {
    if (!pendingAutoplay || !isEnabled || !preferencesReady) return;

    const resume = () => {
      setPendingAutoplay(false);
      startTrack(trackRef.current);
    };

    window.addEventListener("pointerdown", resume, { once: true, passive: true });
    window.addEventListener("click", resume, { once: true, passive: true });
    window.addEventListener("keydown", resume, { once: true });
    return () => {
      window.removeEventListener("pointerdown", resume);
      window.removeEventListener("click", resume);
      window.removeEventListener("keydown", resume);
    };
  }, [isEnabled, pendingAutoplay, preferencesReady, startTrack]);

  const switchTrack = useCallback((track: AudioTrackKey) => {
    startTrack(track);
  }, [startTrack]);

  const setVolume = useCallback((nextVolume: number) => {
    setVolumeState(clampVolume(nextVolume));
  }, []);

  const value = useMemo<GlobalAudioContextValue>(() => ({
    currentTrack,
    isEnabled,
    isPlaying,
    volume: volumeState,
    enableAudio,
    disableAudio,
    toggleAudio: () => {
      if (isEnabled) disableAudio();
      else enableAudio();
    },
    setVolume,
    switchTrack,
  }), [currentTrack, disableAudio, enableAudio, isEnabled, isPlaying, setVolume, switchTrack, volumeState]);

  return <GlobalAudioContext.Provider value={value}>{children}</GlobalAudioContext.Provider>;
}

export function useGlobalAudioContext() {
  const context = useContext(GlobalAudioContext);
  if (!context) throw new Error("useGlobalAudio must be used within GlobalAudioProvider");
  return context;
}
