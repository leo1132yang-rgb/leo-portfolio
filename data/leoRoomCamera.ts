import { ROOM_LAYOUT } from "@/data/leoRoomDimensions";
import { CENTRAL_WORKSPACE } from "@/data/leoRoomWorkspace";

export type LeoRoomFocusId = "journey" | "gallery" | "digital" | "travel";
export type LeoRoomPresetId = "overview" | "desk" | LeoRoomFocusId;

export type LeoRoomCameraPreset = {
  position: [number, number, number];
  target: [number, number, number];
  azimuth: [number, number];
};

export const leoRoomCameraPresets: Record<LeoRoomPresetId, LeoRoomCameraPreset> = {
  overview: {
    position: [-3.8, 6.6, 13.2],
    target: [0, 1.12, -.5],
    azimuth: [-.82, .28],
  },
  desk: CENTRAL_WORKSPACE.deskCamera,
  journey: {
    position: [-3.1, 2.9, 3.5],
    target: ROOM_LAYOUT.journey.position,
    azimuth: [.48, 1.08],
  },
  gallery: {
    position: [-3.1, 2.9, 2.5],
    target: ROOM_LAYOUT.gallery.position,
    azimuth: [-.42, .42],
  },
  digital: {
    position: [2.45, 2.9, 2.5],
    target: ROOM_LAYOUT.digital.position,
    azimuth: [-.4, .4],
  },
  travel: {
    position: [3.0, 2.8, .6],
    target: ROOM_LAYOUT.travel.position,
    azimuth: [-1.14, -.5],
  },
};

export const leoRoomPresetLabels: Array<{ id: LeoRoomPresetId; label: string }> = [
  { id: "overview", label: "OVERVIEW" },
  { id: "desk", label: "DESK" },
  { id: "journey", label: "CHILDHOOD" },
  { id: "gallery", label: "GALLERY" },
  { id: "digital", label: "DIGITAL" },
  { id: "travel", label: "TRAVEL" },
];
