"use client";

import AeroShardsRenderer from "./AeroShardsRenderer";

// Typed integration around the supplied renderer; its shader source is unchanged.
export interface AeroShardsProps {
  backgroundColor?: string; shardColor?: string; accentColor?: string;
  placement?: "right" | "left" | "center" | "full";
  flow?: "stream" | "vortex" | "ribbon";
  material?: "pearl" | "chrome" | "satin";
  detail?: "bold" | "balanced" | "fine";
  effect?: "none" | "dither" | "ascii";
  interaction?: "none" | "repel" | "attract";
  scale?: number; spread?: number; depth?: number; speed?: number; spin?: number;
  density?: number; shardSize?: number; stretch?: number; turbulence?: number;
  glow?: number; edgeSoftness?: number; bloom?: number; grain?: number;
  chromaticAberration?: number; transitionDuration?: number;
  interactionRadius?: number; interactionStrength?: number; rippleIntensity?: number;
  holdToGather?: boolean; paused?: boolean; className?: string;
  onError?: (error: Error) => void;
}

export default function AeroShards(props: AeroShardsProps) {
  return <AeroShardsRenderer onError={props.onError} {...props} />;
}
