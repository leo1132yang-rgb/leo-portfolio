import { ROOM, ROOM_FURNITURE, ROOM_LAYOUT } from '@/data/leoRoomDimensions';
import { ROOM_LIFE } from '@/data/leoRoomLife';
import { CENTRAL_WORKSPACE } from '@/data/leoRoomWorkspace';
import {ROOM_COLLECTION} from '@/data/leoRoomCollection';

type Point = {x:number;y:number;z:number};
type Bounds = {min:Point;max:Point};
const box=(x:number,y:number,z:number,w:number,h:number,d:number):Bounds=>({min:{x:x-w/2-.14,y:y-h/2-.14,z:z-d/2-.14},max:{x:x+w/2+.14,y:y+h/2+.14,z:z+d/2+.14}});
export const roomCameraObstacles:Bounds[]=[
  box(ROOM_COLLECTION.position[0],.83,ROOM_COLLECTION.position[2],ROOM_COLLECTION.width,ROOM_COLLECTION.height,ROOM_COLLECTION.depth),
  box(0,.59,ROOM_LAYOUT.rug.position[2],CENTRAL_WORKSPACE.desk.width,1.06,CENTRAL_WORKSPACE.desk.depth),
  box(ROOM_FURNITURE.livingShelf[0],.45,ROOM_FURNITURE.livingShelf[2],4.05,.8,.63),
  box(ROOM_FURNITURE.bookshelf[0],1.65,ROOM_FURNITURE.bookshelf[2],1.45,3.3,.65),
  box(ROOM_LIFE.lounge.origin[0]+.2,.7,ROOM_LIFE.lounge.origin[2]-.2,1.55,1.25,1.3),
];
const inside=(p:Point,b:Bounds)=>p.x>b.min.x&&p.x<b.max.x&&p.y>b.min.y&&p.y<b.max.y&&p.z>b.min.z&&p.z<b.max.z;
const clamp=(n:number,a:number,b:number)=>Math.max(a,Math.min(b,n));
/** Simple camera-volume guard, independent of decorative mesh density. */
export function constrainRoomCamera(p:Point, chairX:number):Point {
  const next={x:clamp(p.x,-ROOM.width/2+.32,ROOM.width/2-.32),y:clamp(p.y,.38,16),z:clamp(p.z,-ROOM.depth/2+.36,38)};
  const obstacles=[...roomCameraObstacles,box(chairX, .83,ROOM_LAYOUT.rug.position[2]+CENTRAL_WORKSPACE.chair.position[2],1.12,1.5,1.0)];
  for(const b of obstacles){
    if(!inside(next,b))continue;
    const exits: [keyof Point,number][]=[['x',b.min.x],['x',b.max.x],['y',b.max.y],['z',b.min.z],['z',b.max.z]];
    exits.sort((a,c)=>Math.abs(next[a[0]]-a[1])-Math.abs(next[c[0]]-c[1]));
    next[exits[0][0]]=exits[0][1];
  }
  return next;
}

export function sweepRoomCamera(from:Point,to:Point,chairX:number):Point {
  const end=constrainRoomCamera(to,chairX);
  const start=constrainRoomCamera(from,chairX);
  const steps=Math.max(1,Math.ceil(Math.hypot(end.x-start.x,end.y-start.y,end.z-start.z)/.08));
  let safe=start;
  for(let i=1;i<=steps;i++){
    const t=i/steps,p={x:start.x+(end.x-start.x)*t,y:start.y+(end.y-start.y)*t,z:start.z+(end.z-start.z)*t};
    const checked=constrainRoomCamera(p,chairX);
    if(Math.hypot(checked.x-p.x,checked.y-p.y,checked.z-p.z)>.0001)return safe;
    safe=p;
  }
  return end;
}
