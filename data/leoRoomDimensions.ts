export const ROOM = {
  width: 13,
  depth: 8,
  height: 3.8,
  wall: .18,
} as const;

const halfWidth = ROOM.width / 2;
const halfDepth = ROOM.depth / 2;

export const ROOM_STRUCTURE = {
  halfWidth,
  halfDepth,
  ceilingEdgeDepth: .56,
  ceilingEdgeWidth: .38,
  baseTrimHeight: .18,
  baseTrimDepth: .11,
  window: {
    width: 3.3,
    height: 2.35,
    sill: .48,
    centerZ: 1.25,
  },
} as const;

export const ROOM_LAYOUT = {
  journey: {
    position: [-halfWidth + ROOM.wall / 2 + .015, 2.05, -.3] as [number, number, number],
    scale: .76,
  },
  gallery: {
    position: [-3.15, 2.2, -halfDepth + ROOM.wall / 2 + .025] as [number, number, number],
    scale: .62,
  },
  digital: {
    position: [2.45, 2.2, -halfDepth + ROOM.wall / 2 + .025] as [number, number, number],
    scale: .65,
  },
  travel: {
    position: [halfWidth - ROOM.wall / 2 - .015, 2.15, -2.08] as [number, number, number],
    scale: .7,
  },
  rug: {
    position: [0, 0, .42] as [number, number, number],
    radius: 2.4,
  },
} as const;

export const ROOM_LIGHTING = {
  coveY: ROOM.height - .1,
  backZ: -halfDepth + ROOM.wall + .07,
  leftX: -halfWidth + ROOM.wall + .07,
  rightX: halfWidth - ROOM.wall - .07,
  backStripLength: ROOM.width - .9,
  sideStripLength: ROOM.depth - .9,
  trackY: ROOM.height - .16,
  trackZ: -halfDepth + 1.35,
  trackLength: Math.min(6.6, ROOM.width - 2),
} as const;
