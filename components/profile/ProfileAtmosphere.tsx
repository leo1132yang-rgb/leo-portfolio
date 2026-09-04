"use client";

import { Component, useCallback, useEffect, useState, type ReactNode } from "react";

type MetalComponent = typeof import("./MoltenMetal").default;

class BackgroundBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

export function ProfileAtmosphere() {
  const [Metal, setMetal] = useState<MetalComponent | null>(null);
  const [mobile, setMobile] = useState(false);
  const [failed, setFailed] = useState(false);
  const fail = useCallback(() => setFailed(true), []);

  useEffect(() => {
    const small = window.matchMedia("(max-width: 767px)");
    let disposed = false;
    const sync = () => setMobile(small.matches);
    sync();
    small.addEventListener("change", sync);
    // Lazy-load one background. Initialization errors only remove this layer.
      import("./MoltenMetal").then(module => {
        if (!disposed) setMetal(() => module.default);
      }).catch(() => { if (!disposed) setFailed(true); });
    return () => { disposed = true; small.removeEventListener("change", sync); };
  }, []);

  if (!Metal || failed) return null;
  return <BackgroundBoundary><div className="profile-atmosphere" aria-hidden="true">
    <Metal
      color1="#17191b" color2="#62615c" color3="#b99a6a"
      backgroundColor="#111210" lightMode={false} colorMode="molten"
      speed={0.08} scale={4} detail={mobile ? 2 : 3}
      glow={1.25} coreSize={0.1} swirl={1} fold={-0.2}
      blackPoint={0.05} brightness={1} opacity={1}
      grain={false} grainIntensity={0}
      mouseInteraction={false} mouseStrength={0} onError={fail}
    />
  </div></BackgroundBoundary>;
}
