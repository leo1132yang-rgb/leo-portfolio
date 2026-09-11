import { ROOM_LAYOUT } from "@/data/leoRoomDimensions";
import { CENTRAL_WORKSPACE } from "@/data/leoRoomWorkspace";

export type LeoRoomFocusId = "journey" | "gallery" | "digital" | "travel" | "desk" | "bookshelf" | "vinyl" | "lounge" | "collection";

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
  position: [1.7, 5.0, 13.4],
  target: [0, 1.5, -.8],
};

export const leoRoomMobileOverviewCamera: LeoRoomCameraTarget = {
  position: [1.0, 9, 29],
  target: [-.4, 1.1, -.7],
};

export const leoRoomExploreProfiles: Record<"desktop" | "mobile", LeoRoomExploreProfile> = {
  desktop: {
    fov: 54,
    minDistance: .65,
    maxDistance: 25,
    minPolarAngle: .35,
    maxPolarAngle: 1.68,
    minAzimuthAngle: -2.5,
    maxAzimuthAngle: 2.5,
  },
  mobile: {
    fov: 60,
    minDistance: .9,
    maxDistance: 38,
    minPolarAngle: .4,
    maxPolarAngle: 1.65,
    minAzimuthAngle: -2.5,
    maxAzimuthAngle: 2.5,
  },
};

export const leoRoomFocusTargets: Record<LeoRoomFocusId, LeoRoomCameraTarget> = {
  collection: {position:[3.55,1.45,2.95],target:[3.55,.99,.3]},
  bookshelf: { position: [5.8, 2.0, -1.1], target: [6.55, 1.62, -4.4] },
  desk: CENTRAL_WORKSPACE.deskCamera,
  vinyl: { position: [-2.65, 2.05, -2.65], target: [-2.68, .94, -4.63] },
  lounge: { position: [3.5, 2.3, 4.2], target: [5.8, .85, .55] },
  journey: { position: [-2.25, 2.4, 2.8], target: ROOM_LAYOUT.journey.position },
  gallery: { position: [-3.8, 2.95, -.8], target: ROOM_LAYOUT.gallery.position },
  digital: { position: [2.45, 2.55, -.8], target: ROOM_LAYOUT.digital.position },
  travel: { position: [3.8, 2.4, -.7], target: ROOM_LAYOUT.travel.position },
};

// Visible subject dimensions, used to fit portrait screens without cropping.
export const leoRoomInspectSize: Record<LeoRoomFocusId, [number,number]> = {
  collection:[1.16,1.8],
  journey:[4.8,3.25], gallery:[4.6,2.9], desk:[4.9,2.6], bookshelf:[1.6,3.4],
  digital:[4.3,2.4], travel:[2.25,2.3], vinyl:[1.15,1.0], lounge:[2.9,2.5],
};
