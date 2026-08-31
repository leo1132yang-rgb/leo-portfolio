import { ROOM_LAYOUT } from "@/data/leoRoomDimensions";
import { CENTRAL_WORKSPACE } from "@/data/leoRoomWorkspace";

export type LeoRoomFocusId = "journey" | "gallery" | "digital" | "travel" | "desk";

export type LeoRoomCameraTarget = {
  position: [number, number, number];
  target: [number, number, number];
};

export type LeoRoomExploreProfile = {
  fov: number;
  minDistance: number;
  maxDistance: number;
  minPolarAngle: number;
  maxPolarAngle: number;
  minAzimuthAngle: number;
  maxAzimuthAngle: number;
};

// The Room has one continuous exploration camera. These are deliberately
// short-lived destinations for object interactions, not selectable views.
export const leoRoomOverviewCamera: LeoRoomCameraTarget = {
  position: [-4.6, 7.4, 15.7],
  target: [0, 1.12, -.55],
};

export const leoRoomMobileOverviewCamera: LeoRoomCameraTarget = {
  position: [-4.9, 7.8, 16.9],
  target: [0, 1.06, -.35],
};

export const leoRoomExploreProfiles: Record<"desktop" | "mobile", LeoRoomExploreProfile> = {
  desktop: {
    fov: 48,
    minDistance: 2.8,
    maxDistance: 18.5,
    minPolarAngle: .82,
    maxPolarAngle: 1.54,
    minAzimuthAngle: -1.02,
    maxAzimuthAngle: .45,
  },
  mobile: {
    fov: 54,
    minDistance: 4.4,
    maxDistance: 20.5,
    minPolarAngle: .78,
    maxPolarAngle: 1.5,
    minAzimuthAngle: -1.18,
    maxAzimuthAngle: .58,
  },
};

export const leoRoomFocusTargets: Record<LeoRoomFocusId, LeoRoomCameraTarget> = {
  desk: CENTRAL_WORKSPACE.deskCamera,
  journey: { position: [-3.1, 2.9, 3.5], target: ROOM_LAYOUT.journey.position },
  gallery: { position: [-3.1, 2.9, 2.5], target: ROOM_LAYOUT.gallery.position },
  digital: { position: [2.45, 2.9, 2.5], target: ROOM_LAYOUT.digital.position },
  travel: { position: [3.0, 2.8, .6], target: ROOM_LAYOUT.travel.position },
};
