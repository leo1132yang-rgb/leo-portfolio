"use client";

import dynamic from "next/dynamic";
import { Component, Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { SiteNavbar } from "@/components/layout/SiteNavbar";
import { useLanguage } from "@/components/LanguageProvider";
import RippleDistortion from "./RippleDistortion";
import styles from "./OtherSideEntry.module.css";

const OtherSide = dynamic(() => import("@/components/OtherSide").then(module => module.OtherSide), {
  ssr: false,
  loading: () => <div className={styles.loading}>ENTERING ROOM...</div>,
});

class WarmupBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export function OtherSideEntry() {
  const { language } = useLanguage();
  const [showIntro, setShowIntro] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [requested, setRequested] = useState(false);
  const [chunksReady, setChunksReady] = useState(false);
  const [coreReady, setCoreReady] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [assets, setAssets] = useState<typeof import("@/components/leo-room/preloadRoomAssets") | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const markCoreReady = useCallback(() => setCoreReady(true), []);
  const markSceneReady = useCallback(() => setSceneReady(true), []);
  const markFailed = useCallback(() => setFailed(true), []);

  useEffect(() => {
    let cancelled = false;
    // Start immediately, concurrently. Importing the scene does not instantiate Canvas.
    Promise.all([
      import("@/components/leo-room/preloadRoomAssets").then(module => {
        if (cancelled) return;
        module.preloadRoomAssets(attempt > 0);
        setAssets(module);
      }),
      import("@/components/LeoRoomScene"),
      import("@/components/OtherSide"),
    ]).then(() => { if (!cancelled) setChunksReady(true); })
      .catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; };
  }, [attempt]);

  useEffect(() => () => { if (timer.current !== null) clearTimeout(timer.current); }, []);

  useEffect(() => {
    if (!requested || !sceneReady) return;
    setLeaving(true);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timer.current = setTimeout(() => setShowIntro(false), reduced ? 0 : 400);
    return () => { if (timer.current !== null) clearTimeout(timer.current); };
  }, [requested, sceneReady]);

  const enterRoom = () => {
    setRequested(true);
    if (failed) {
      setFailed(false);
      setAssets(null);
      setCoreReady(false);
      setChunksReady(false);
      setAttempt(value => value + 1);
    }
  };

  const mountRoom = requested && chunksReady && coreReady;
  const waiting = requested && !failed;
  const prompt = failed
    ? (language === "cn" ? "加载未完成，点击重试" : "Loading interrupted — retry")
    : waiting ? (language === "cn" ? "正在进入房间…" : "ENTERING ROOM…")
    : (language === "cn" ? "点击进入我的房间" : "Enter my room");

  return <div className={styles.gate}>
    {showIntro && assets && <WarmupBoundary key={attempt} onError={markFailed}><Suspense fallback={null}><assets.RoomCoreAssetsReady onReady={markCoreReady} /></Suspense></WarmupBoundary>}
    {mountRoom && <OtherSide onRoomReady={markSceneReady} />}
    {showIntro && <>
    {!mountRoom && <SiteNavbar variant="hero" />}
    <main className={`${styles.intro} ${leaving ? styles.leaving : ""}`}>
      <RippleDistortion
        src="/room/leo-cosmic-galaxy.png"
        brushSize={150} strength={0.15} swirl={0.7} rings={4}
        spread={5} fade={3} spacing={15} dispersion={0} glint={0}
        tintAmount={0.05} quality="low" trigger="hover"
      >
        <button type="button" className={styles.enter} onClick={enterRoom} disabled={waiting || leaving} aria-busy={waiting} aria-label={prompt}>
          <span className={styles.title}>OTHER SIDE</span>
          <span className={styles.subtitle}>另一面</span>
          <span className={styles.prompt} aria-live="polite">{prompt}{!waiting && <span aria-hidden="true"> →</span>}</span>
        </button>
      </RippleDistortion>
    </main>
    </>}
  </div>;
}
