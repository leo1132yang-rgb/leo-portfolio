"use client";

import dynamic from "next/dynamic";
import { Component, Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { SiteNavbar } from "@/components/layout/SiteNavbar";
import { useLanguage } from "@/components/LanguageProvider";
import { worldIntroCopy, worldName } from "@/data/worldCopy";
import RippleDistortion from "./RippleDistortion";
import styles from "./OtherSideEntry.module.css";
// Keep return controls styled while the room's JS is prewarmed independently.
import "@/components/leo-room/RoomNavigation.module.css";

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
  const copy = worldIntroCopy[language];
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
  const prompt = failed ? copy.retry : waiting ? copy.waiting : copy.enter;

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
        <div className={styles.invitation}>
          <section className={styles.content} aria-labelledby="world-welcome-title">
            <p className={styles.eyebrow}>{worldName.en}</p>
            <h1 id="world-welcome-title" className={styles.title}>{copy.title}</h1>
            <div className={styles.copy}>{copy.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
            <div className={styles.actions}>
              <button type="button" className={styles.enter} onClick={enterRoom} disabled={waiting || leaving} aria-busy={waiting} aria-label={prompt}>
                <span aria-live="polite">{prompt}</span>{!waiting && <span aria-hidden="true"> →</span>}
              </button>
              <a className={styles.feedback} href="mailto:leoyang1132@outlook.com">{copy.feedback} ↗</a>
            </div>
          </section>
        </div>
      </RippleDistortion>
    </main>
    </>}
  </div>;
}
