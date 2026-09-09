"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { vinylTracks } from '@/data/vinylTracks';
import { AudioTransport, type TransportState } from '@/lib/audio/AudioTransport';
export type AudioTrackKey = 'global'|'projects'|'room'|'childhood';
export const audioTracks = {
  global:{key:'global',label:'GLOBAL',src:'/audio/global.mp3',baseVolume:.16},
  projects:{key:'projects',label:'PROJECTS',src:'/audio/projects.mp3',baseVolume:.14},
  room:{key:'room',label:'ROOM',src:'/audio/room.mp3',baseVolume:.18},
  childhood:{key:'childhood',label:'CHILDHOOD',src:'/audio/childhood.mp3',baseVolume:.13},
};
const STORAGE_KEY='leo-global-audio';
const routeFor=(path:string):AudioTrackKey=>path.startsWith('/projects')?'projects':path.startsWith('/other-side')?'room':'global';
const clamp=(n:number)=>Number.isFinite(n)?Math.max(0,Math.min(1,n)):.8;
function useAudioModel(){
 const pathname=usePathname(), routeTrack=routeFor(pathname);
 const [override,setOverride]=useState<{path:string;track:AudioTrackKey}|null>(null);
 const currentTrack=override?.path===pathname?override.track:routeTrack;
 const [isEnabled,setEnabled]=useState(false),[volume,setVolumeState]=useState(.8),[ready,setReady]=useState(false);
 const [vinylId,setVinylId]=useState(vinylTracks[0].id),[vinylWantsPlay,setVinylWantsPlay]=useState(false);
 const [roomMounted,setRoomMounted]=useState(false);
 const [media,setMedia]=useState<TransportState>({key:'',status:'idle',time:0,duration:0});
 const [vinylErrors,setVinylErrors]=useState<Record<string,boolean>>({});
 const element=useRef<HTMLAudioElement>(null), engine=useRef<AudioTransport|null>(null);
 const latest=useRef({vinylId,vinylWantsPlay,currentTrack,isEnabled,roomMounted});latest.current={vinylId,vinylWantsPlay,currentTrack,isEnabled,roomMounted};
 useEffect(()=>{try{const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');setEnabled(saved?.isEnabled??true);setVolumeState(clamp(saved?.volume??.8));}catch{setEnabled(true);}setReady(true);},[]);
 useEffect(()=>{if(ready)try{localStorage.setItem(STORAGE_KEY,JSON.stringify({isEnabled,volume}));}catch{}},[isEnabled,volume,ready]);
 useEffect(()=>{
   const transport=new AudioTransport(element.current!,state=>{setMedia(state);if(state.key.startsWith('vinyl-')&&(state.status==='error'||state.status==='playing'))setVinylErrors(e=>e[state.key]===(state.status==='error')?e:{...e,[state.key]:state.status==='error'});},key=>{
     const s=latest.current;if(!s.roomMounted||s.currentTrack!=='room'||!s.vinylWantsPlay||!s.isEnabled||key!==s.vinylId)return;
     const next=vinylTracks[(vinylTracks.findIndex(t=>t.id===key)+1)%vinylTracks.length];transport.restart(next.id);setVinylId(next.id);
   });engine.current=transport;return()=>{transport.dispose();engine.current=null;};
 },[]);
 const vinylTrack=vinylTracks.find(t=>t.id===vinylId)!;
 const usingVinyl=roomMounted&&currentTrack==='room';
 const source=usingVinyl?vinylTrack.src:audioTracks[currentTrack].src;
 const sourceKey=usingVinyl?vinylId:currentTrack;
 const shouldPlay=ready&&isEnabled&&(!usingVinyl||vinylWantsPlay);
 const [retry,setRetry]=useState(0);
 useEffect(()=>{engine.current?.configure(sourceKey,source,shouldPlay,audioTracks[currentTrack].baseVolume*volume,!usingVinyl);},[sourceKey,source,shouldPlay,currentTrack,volume,usingVinyl,retry]);
 useEffect(()=>{
   if(media.status!=='blocked'||!shouldPlay)return;
   const resume=()=>setRetry(n=>n+1);
   window.addEventListener('pointerdown',resume,{once:true});window.addEventListener('keydown',resume,{once:true});
   return()=>{window.removeEventListener('pointerdown',resume);window.removeEventListener('keydown',resume);};
 },[media.status,shouldPlay]);
 const switchTrack=useCallback((track:AudioTrackKey)=>setOverride(old=>old?.path===pathname&&old.track===track?old:{path:pathname,track}),[pathname]);
 const registerVinyl=useCallback(()=>{setRoomMounted(true);return()=>setRoomMounted(false);},[]);
 const selectVinyl=useCallback((id:string)=>{if(!vinylTracks.some(t=>t.id===id))return;if(id!==latest.current.vinylId)engine.current?.restart(id);setVinylId(id);},[]);
 const toggleVinyl=useCallback(()=>{setVinylWantsPlay(p=>!p);setRetry(n=>n+1);},[]);
 const seekVinyl=useCallback((time:number)=>{if(latest.current.currentTrack==='room'&&latest.current.roomMounted)engine.current?.seek(time);},[]);
 const enableAudio=useCallback(()=>setEnabled(true),[]),disableAudio=useCallback(()=>setEnabled(false),[]),toggleAudio=useCallback(()=>setEnabled(v=>!v),[]),setVolume=useCallback((n:number)=>setVolumeState(clamp(n)),[]);
 const isPlaying=media.key===sourceKey&&media.status==='playing'&&shouldPlay;
 return {element,currentTrack,isEnabled,isPlaying,volume,enableAudio,disableAudio,toggleAudio,setVolume,switchTrack,registerVinyl,selectVinyl,toggleVinyl,seekVinyl,vinylTrack,vinylWantsPlay,vinylIsPlaying:usingVinyl&&isPlaying,vinylStatus:usingVinyl&&media.key===vinylId?media.status:'paused',vinylTime:media.key===vinylId?media.time:0,vinylDuration:media.key===vinylId?media.duration:0,vinylErrors};
}
type AudioValue=Omit<ReturnType<typeof useAudioModel>,'element'>;
const GlobalAudioContext=createContext<AudioValue|null>(null);
export function GlobalAudioProvider({children}:{children:ReactNode}){
 const {element,...value}=useAudioModel();
 return <GlobalAudioContext.Provider value={value}><audio ref={element} data-global-sound="true" preload="metadata" hidden/>{children}</GlobalAudioContext.Provider>;
}
export function useGlobalAudioContext(){const value=useContext(GlobalAudioContext);if(!value)throw Error('useGlobalAudio must be used within GlobalAudioProvider');return value;}
