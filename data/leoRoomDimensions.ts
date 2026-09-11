export const ROOM = {
  width: 16,
  depth: 10.4,
  height: 4.15,
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
    position: [-6.8, 2.05, .75] as [number, number, number],
    scale: .82,
    yaw: 1.15,
  },
  gallery: {
    position: [-3.8, 2.5, -halfDepth + ROOM.wall / 2 + .025] as [number, number, number],
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
    position: [0, 0, 1.15] as [number, number, number],
    radius: 2.4,
  },
} as const;

// Furniture stays at its existing size; only its position follows the larger shell.
export const ROOM_FURNITURE = {
  bookshelf: [6.55, 0, -4.65] as [number, number, number],
  livingShelf: [-3.8, 0, -4.63] as [number, number, number],
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
