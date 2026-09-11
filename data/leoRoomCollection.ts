// Replace individual entries with future reference models without changing focus or Room handlers.
export const ROOM_COLLECTION = {
  position: [3.55, 0, .3] as [number, number, number],
  width: 1.06, height: 1.66, depth: .48,
  figures: [
    {id:'heart',pose:'heart',row:0,column:0,yaw:.10},
    {id:'hello',pose:'wave',row:0,column:1,yaw:-.12},
    {id:'traveler',pose:'traveler',row:1,column:0,yaw:.14},
    {id:'music',pose:'music',row:1,column:1,yaw:-.08},
    {id:'chef',pose:'chef',row:2,column:0,yaw:.08},
    {id:'flower',pose:'flower',row:2,column:1,yaw:-.14},
  ] as const,
};
export type StitchPose = typeof ROOM_COLLECTION.figures[number]['pose'];
