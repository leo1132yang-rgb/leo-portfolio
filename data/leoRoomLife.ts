import { CENTRAL_WORKSPACE } from "./leoRoomWorkspace";
import { ROOM_STRUCTURE } from "./leoRoomDimensions";

export const ROOM_LIFE = {
  lightDuration: .8,
  chairRail: { min: -CENTRAL_WORKSPACE.desk.width / 2 + .9, max: CENTRAL_WORKSPACE.desk.width / 2 - .9 },
  lounge: {
    origin: [5.8, 0, .55] as [number, number, number],
    chairOrigin: [.2, .03, -.2] as [number, number, number],
    yaw: -.32,
    cushionY: .48,
    cushionThickness: .27,
    eyeAboveSeat: .83,
  },
  windowTarget: [ROOM_STRUCTURE.halfWidth + .11, 1.58, ROOM_STRUCTURE.window.centerZ + .2] as [number, number, number],
  standPosition: [4.5, 1.75, 2.6] as [number, number, number],
  standTarget: [6.1, 1.5, .9] as [number, number, number],
  sitDuration: 1.8,
  standDuration: 1.1,
  lookYaw: 42 * Math.PI / 180,
  lookPitch: 16 * Math.PI / 180,
} as const;
