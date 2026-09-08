import { ROOM, ROOM_LAYOUT } from "@/data/leoRoomDimensions";

// User-selected display scale: double the calibrated desktop props together.
export const DESK_PROP_SCALE = 2;

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
    width: .598,
    height: .598 * 9 / 16,
    depth: .055,
    centerY: .14 + deskHeight + ROOM.height * .035 / 2 + .10 + .598 * 9 / 32,
    z: -.08,
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

// Props use metres (1 world unit = 1 m). The existing 4.81 m studio table and
// chair are deliberately NOT rescaled here: furniture is outside this pass.
// Physical dimensions below are independent of the oversized table width.
export const DESK_OBJECT_DIMENSIONS = {
  coffeeCup: {
    height: .1,
    diameter: .085,
  },
  runtianBottle: {
    // Approximation of the supplied small green-cap / blue-white-label bottle.
    // The reference appears to read 380 ml; this is not a measured product CAD.
    height: .205,
    diameter: .057,
  },
  fujiXT5: {
    bodyWidth: .13,
    bodyHeight: .09,
    bodyDepth: .06,
    lensDiameter: .065,
    lensDepth: .07,
  },
  notebook: {
    width: .148,
    depth: .21,
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
