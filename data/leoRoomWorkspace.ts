import { ROOM, ROOM_LAYOUT } from "@/data/leoRoomDimensions";

const deskWidth = Math.min(ROOM.width * .37, ROOM_LAYOUT.rug.radius * 2.02);
const deskDepth = ROOM.depth * .19;
const deskHeight = ROOM.height * .21;

export const CENTRAL_WORKSPACE = {
  position: ROOM_LAYOUT.rug.position,
  desk: {
    width: deskWidth,
    depth: deskDepth,
    height: deskHeight,
    topThickness: ROOM.height * .035,
    wingWidth: deskWidth * .24,
    wingDepth: deskDepth * .72,
  },
  monitor: {
    width: deskWidth * .30,
    height: deskWidth * .30 * 9 / 16,
    depth: .055,
    centerY: .14 + deskHeight + ROOM.height * .035 / 2 + .18 + deskWidth * .30 * 9 / 32,
    z: -deskDepth * .18,
  },
  chair: {
    position: [deskWidth * .17, 0, deskDepth * .93] as [number, number, number],
    seatY: deskHeight * .59,
    width: deskWidth * .22,
  },
  deskCamera: {
    position: [ROOM.width * .28, ROOM.height * 1.13, ROOM.depth * .77] as [number, number, number],
    target: [0, deskHeight + .26, ROOM_LAYOUT.rug.position[2] + .28] as [number, number, number],
    azimuth: [.2, 1.05] as [number, number],
  },
} as const;

// Leo's Room uses an architectural scale where one world unit is treated as
// approximately one metre. Keep small desk props dimensioned here so they do
// not drift back toward oversized "demo model" proportions.
export const DESK_OBJECT_DIMENSIONS = {
  coffeeCup: {
    height: .1,
    diameter: .085,
  },
  runtianBottle: {
    height: .22,
    diameter: .065,
  },
  fujiXT5: {
    bodyWidth: .13,
    bodyHeight: .09,
    bodyDepth: .06,
    lensDiameter: .065,
    lensDepth: .07,
  },
  notebook: {
    width: .21,
    depth: .145,
    height: .018,
  },
  watch: {
    dialDiameter: .04,
  },
  keyboard: {
    width: .44,
    depth: .14,
    height: .025,
  },
  mouse: {
    length: .12,
    width: .065,
    height: .04,
  },
  phone: {
    height: .15,
    width: .074,
    depth: .009,
  },
  deskMat: {
    width: .78,
    depth: .34,
    height: .008,
  },
} as const;
