"use client";

import { Component, useCallback, useEffect, useState, type ReactNode } from "react";

type AeroComponent = typeof import("./AeroShards").default;

class BackgroundBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

export function ProfileAtmosphere() {
  const [Aero, setAero] = useState<AeroComponent | null>(null);
  const [mobile, setMobile] = useState(false);
  const [failed, setFailed] = useState(false);
  const fail = useCallback(() => setFailed(true), []);

  useEffect(() => {
    const small = window.matchMedia("(max-width: 767px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false;
    const sync = () => setMobile(small.matches);
    sync();
    small.addEventListener("change", sync);
    // The supplied renderer handles later reduced-motion changes and GPU errors.
    // Unsupported devices keep the original Profile background, without a canvas.
    if ("gpu" in navigator && !reduced.matches) {
      import("./AeroShards").then(module => {
        if (!disposed) setAero(() => module.default);
      }).catch(() => { if (!disposed) setFailed(true); });
    }
    return () => { disposed = true; small.removeEventListener("change", sync); };
  }, []);

  if (!Aero || failed) return null;
  return <BackgroundBoundary><div className="profile-atmosphere" aria-hidden="true">
    <Aero
      backgroundColor="#111210" shardColor="#8A8172" accentColor="#b99a6a"
      placement="full" flow="stream" material="satin" detail="bold" effect="none"
      scale={1} spread={0.8} depth={0.65} speed={0.22} spin={0.18}
      interaction="none" density={mobile ? 0.45 : 0.65}
      shardSize={mobile ? 0.7 : 0.8} stretch={1} turbulence={0.45}
      glow={0.28} edgeSoftness={1} bloom={mobile ? 0.1 : 0.16}
      grain={mobile ? 0 : 0.015} chromaticAberration={0}
      rippleIntensity={0} holdToGather={false} onError={fail}
    />
  </div></BackgroundBoundary>;
}
