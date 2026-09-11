"use client";

import { useRoomMobile } from './leo-room/useRoomMobile';
import { RoomTouchSurface } from './leo-room/RoomTouchSurface';
import Link from "next/link";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { LanguageSwitch, useLanguage } from "@/components/LanguageProvider";
import { useGlobalAudio } from "@/hooks/useGlobalAudio";
import type { LeoRoomFocusId } from "@/data/leoRoomCamera";
import { photoWallImages } from "@/data/photoWall";
import { travelGlobeName, worldName } from "@/data/worldCopy";
import type { DeskSelection } from "@/data/deskItems";
import { useRoomInteractionController } from "@/components/leo-room/useRoomInteractionController";
import { RoomModuleOverlay } from "@/components/leo-room/RoomModuleOverlay";
import vinylStyles from "@/components/leo-room/VinylListeningCorner.module.css";
import { VinylListeningCorner } from "@/components/leo-room/VinylListeningCorner";
import { LoungeMusicPlayer } from './leo-room/LoungeMusicPlayer';
import styles from "@/components/leo-room/RoomNavigation.module.css";

const DeskDetailOverlay = dynamic(() => import("@/components/leo-room/DeskDetailOverlay").then(mod => mod.DeskDetailOverlay), { ssr: false });
const LeoRoomScene = dynamic(() => import("@/components/LeoRoomScene").then(mod => mod.LeoRoomScene), {
  ssr: false, loading: () => <div className="leo-room__loading">ENTERING ROOM...</div>,
});
const ChildhoodGame = dynamic(() => import("@/components/leo-room/childhood/ChildhoodGame"), { ssr: false });
const PhotoLightbox = dynamic(() => import("@/components/leo-room/PhotoLightbox").then(mod => mod.PhotoLightbox), { ssr: false });
const MyWorldPage = dynamic(() => import("@/components/my-world/MyWorldPage").then(mod => mod.MyWorldPage), { ssr: false });

export function OtherSide({ onRoomReady }: { onRoomReady?: () => void } = {}) {
  const mobile = useRoomMobile();
  const [mobileActions,setMobileActions]=useState(false);
  const [mobileSheetOpen,setMobileSheetOpen]=useState(false);
  const { language } = useLanguage();
  const audio=useGlobalAudio();
  const { switchTrack, registerVinyl, toggleVinyl, vinylIsPlaying, vinylWantsPlay, vinylTrack } = audio;
  const audioRef=useRef(audio);audioRef.current=audio;
  const [vinylOpen, setVinylOpen] = useState(false);
  const activateVinyl = useCallback(() => { setVinylOpen(true); toggleVinyl(); }, [toggleVinyl]);
  const cn = language === "cn";
  const interaction = useRoomInteractionController();
  const { activeHotspot, interactionState, content, contentOpen, returnToExplore, openContent } = interaction;
  const [showExploreHint, setShowExploreHint] = useState(true);
  const closeVinyl = useCallback(() => {
    setVinylOpen(false);
    setMobileSheetOpen(false);
    returnToExplore();
  }, [returnToExplore]);
  const changeVinylSheet = useCallback((open: boolean) => {
    setMobileSheetOpen(open);
    if (!open) interaction.takeCameraControl();
  }, [interaction.takeCameraControl]);
  useEffect(registerVinyl, [registerVinyl]);
  useEffect(() => interaction.registerVinylAction(activateVinyl), [interaction.registerVinylAction, activateVinyl]);
  useEffect(()=>{
    if(interactionState==='APPROACHING_SEAT'){setVinylOpen(false);setMobileActions(false);setMobileSheetOpen(false);}
    // Only request playback on entering the settled seat; pausing later stays paused.
    if(interactionState==='SITTING'&&!audioRef.current.vinylWantsPlay)audioRef.current.playVinyl();
  },[interactionState]);
  const readingOpen = content?.type === "childhood";
  const showVinyl = vinylOpen && !contentOpen && !interaction.seatActive;

  useEffect(() => { switchTrack(readingOpen ? "childhood" : "room"); }, [readingOpen, switchTrack]);
  useEffect(() => {
    const timer = window.setTimeout(() => setShowExploreHint(false), 5000);
    return () => window.clearTimeout(timer);
  }, []);

  const focusWall = (id: LeoRoomFocusId) => {
    if (contentOpen) return;
    setShowExploreHint(false);
    if (activeHotspot === id && interactionState === "FOCUSED") {
      if (id === "journey") { openContent({ type: "childhood" }); return; }
      if (id === "travel") { openContent({ type: "world" }); return; }
      if (id === "digital") { window.location.assign("/open-world"); return; }
    }
    interaction.focusHotspot(id);
  };
  const selectDeskItem = (selection: DeskSelection) => {
    if (!contentOpen) openContent({ type: "desk", selection });
  };
  const focused = activeHotspot && !contentOpen && !interaction.seatActive;
  const focusLabel = activeHotspot === "collection" ? (cn ? "史迪仔收藏" : "Stitch collection") : activeHotspot === "vinyl" ? (cn ? "黑胶区" : "Vinyl") : activeHotspot === "lounge" ? (cn ? "休息区" : "Lounge") : activeHotspot === "bookshelf" ? (cn ? "私人书架" : "Bookshelf") : activeHotspot === "journey" ? "Childhood" : activeHotspot === "travel" ? travelGlobeName[language] : activeHotspot === "gallery" ? "Photo Wall" : activeHotspot === "desk" ? (cn ? "工作台" : "Desk") : (cn ? "开放世界" : "Open World");

  return (
    <main className={"leo-room" + (mobile ? " " + styles.mobileRoot : "") + (readingOpen ? " is-reading" : "") + (showVinyl ? " " + vinylStyles.listeningRoom : "")} data-room-mobile={mobile} data-vinyl-open={showVinyl} data-room-state={interactionState} data-aquarium-bright={interaction.aquariumBright} data-room-lighting={interaction.lightingMode} data-shelf-lamp={interaction.shelfLampOn} data-vinyl-playing={vinylIsPlaying} data-vinyl-intent={vinylWantsPlay} data-vinyl-track={vinylTrack.id} data-drawer-open={interaction.drawerOpen} data-reading-book={interaction.readingBook} data-living-item={interaction.activeLivingShelfItem ?? ""} data-plant-touch={interaction.plantTouch} data-chair-x={interaction.chairX.toFixed(3)} data-seat-active={interaction.seatActive} data-room-hotspot={activeHotspot ?? ""} data-room-content={content?.type ?? ""} onPointerDown={() => setShowExploreHint(false)}>
      <div inert={contentOpen}>
        <nav hidden={interaction.seatActive} className={styles.navigation} aria-label={cn ? "房间控制" : "Room controls"}>
          <Link href="/" className={styles.button}>{cn ? "退出房间" : "Exit room"} ↗</Link>
          {focused && <button type="button" className={styles.button} onClick={returnToExplore}>← {cn ? "返回探索" : "Back to explore"}</button>}
          <LanguageSwitch />
          {<button className={styles.button} aria-expanded={mobileActions} onClick={()=>setMobileActions(v=>!v)}>{cn?'探索':'Explore'}</button>}
        </nav>
        <header className={"leo-room__heading " + styles.heading} hidden={interaction.seatActive || !!focused}>
          <p>LEO’S ROOM / CREATIVE SPACE</p>
          <h1>{worldName[language]}</h1>
          <span>{cn ? "拖动观察 · 右键拖动平移 · 点击区域靠近细看。" : "Drag to look, right-drag to move. Select an area to inspect."}</span>
          <button type="button" className="leo-room__world-entry" onClick={() => focusWall("travel")}>
            <small>TRAVEL GLOBE</small><b>{travelGlobeName[language]}</b><i>→</i>
          </button>
        </header>
        <RoomTouchSurface mobile={mobile}>
          <LeoRoomScene onReady={onRoomReady} interaction={mobileSheetOpen ? {...interaction,controlsEnabled:false,objectsEnabled:false}:interaction}
            onWallFocus={focusWall} onDeskFocus={() => focusWall("desk")}
            onChildhoodActivate={() => focusWall("journey")}
            onPhotoSelect={photo => { if (!contentOpen) openContent({ type: "photo", id: photo.id }); }}
            photoLightboxEnabled={interaction.photoLightboxEnabled}
            onDeskItemSelect={selectDeskItem} />
        </RoomTouchSurface>
        {mobileActions && !contentOpen && !interaction.seatActive && <aside className={styles.mobileMenu} aria-label={cn?'探索房间':'Explore room'}>{[
          [cn?'童年':'Childhood',()=>focusWall('journey')],[travelGlobeName[language],()=>focusWall('travel')],[cn?'照片墙':'Photo Wall',()=>focusWall('gallery')],[cn?'工作台':'Desk',()=>focusWall('desk')],[cn?'史迪仔收藏':'Stitch collection',()=>focusWall('collection')],
          [cn?'鱼缸灯':'Aquarium',interaction.toggleAquarium],[cn?'黑胶区':'Vinyl',()=>focusWall('vinyl')],[cn?'休息区':'Lounge',()=>focusWall('lounge')],[cn?'抽屉':'Drawer',()=>interaction.interactLivingShelf('drawer')],[cn?'全屋灯':'Room light',interaction.toggleLighting],[cn?'球灯':'Shelf lamp',()=>interaction.interactLivingShelf('lamp')],[cn?'椅子':'Chair',()=>interaction.showMicroHint('chair')],[cn?'坐下听音乐':'Sit and listen',interaction.sitDown],[cn?'书架':'Bookshelf',()=>focusWall('bookshelf')]
        ].map(([label,action])=><button key={String(label)} onClick={()=>{setMobileActions(false);(action as ()=>void)();}}>{String(label)}</button>)}</aside>}
        {mobile && !showVinyl && !focused && !contentOpen && !interaction.seatActive && !mobileActions && !interaction.microHint && interaction.activeLivingShelfItem && <aside className={styles.mobileAction}><button style={{fontSize:12,padding:'0 16px'}} onClick={()=>interaction.interactLivingShelf(interaction.activeLivingShelfItem!)}>{({lamp:cn?'切换球灯':'Lamp',vinyl:cn?'播放黑胶':'Play vinyl',drawer:interaction.drawerOpen?(cn?'关上抽屉':'Close drawer'):(cn?'打开抽屉':'Open drawer'),book:cn?'阅读':'Read',plant:cn?'轻触植物':'Touch plant'})[interaction.activeLivingShelfItem]}</button></aside>}
        {mobile && interaction.microHint === 'chair' && !contentOpen && !interaction.seatActive && <aside style={showVinyl?{bottom:'calc(142px + env(safe-area-inset-bottom))'}:undefined} className={styles.mobileAction} aria-label={cn?'移动椅子':'Move chair'}><button onClick={()=>interaction.moveChair(interaction.chairX-.55)} aria-label={cn?'椅子向左':'Move chair left'}>‹</button><span>{cn?'移动椅子':'Move chair'}</span><button onClick={()=>interaction.moveChair(interaction.chairX+.55)} aria-label={cn?'椅子向右':'Move chair right'}>›</button><button onClick={()=>interaction.showMicroHint(null)} aria-label={cn?'完成':'Done'}>×</button></aside>}
        {showVinyl && <VinylListeningCorner registerDismiss={interaction.registerTransientDismiss} onSheetChange={changeVinylSheet} onClose={closeVinyl} />}
        {focused && !(mobile && showVinyl) && <aside className={styles.focus} aria-live="polite">
          <p>{focusLabel}<small>{activeHotspot === "desk" ? (cn ? "点击桌面物件，探索工作方式" : "Select an object to explore") : activeHotspot === "gallery" ? (cn ? "点击照片，查看故事" : "Select a photo to read its story") : (cn ? "可拖动微调 · ESC 留在附近探索" : "Adjust freely · ESC to stay and explore")}</small></p>
          {activeHotspot === "journey" && <button type="button" className={styles.button} onClick={() => openContent({ type: "childhood" })}>{cn ? "探索童年世界" : "Explore childhood"} →</button>}
          {activeHotspot === "travel" && <button type="button" className={styles.button} onClick={() => openContent({ type: "world" })}>{cn ? "探索旅行地球" : "Explore Travel Globe"} →</button>}
          {activeHotspot === "vinyl" && <button className={styles.button} onClick={()=>interaction.interactLivingShelf("vinyl")}>{cn ? "聆听黑胶" : "Listen"} ♫</button>}
          {activeHotspot === "lounge" && <button className={styles.button} onClick={interaction.sitDown}>{cn ? "坐下听音乐" : "Sit and listen"}</button>}
          {activeHotspot === "digital" && <a className={styles.button} href="/open-world">{cn ? "进入开放世界 · 开车出发" : "Enter open world"} ↗</a>}
          <button type="button" className={styles.button} onClick={returnToExplore}>{cn ? "返回探索" : "Back to explore"} ×</button>
        </aside>}
        <div className={styles.status} hidden={interaction.seatActive}>
          <span aria-live="polite">{interactionState === "FREE_EXPLORE" ? "FREE EXPLORE" : interactionState === "RESTORING" ? "RETURNING TO EXPLORE" : "FOCUS · " + focusLabel.toUpperCase()}</span>
          <button type="button" className={styles.button} onClick={interaction.resetView}>{cn ? "回到主视觉" : "Back to Main View"}</button>
        </div>
        {showExploreHint && !mobile && !interaction.seatActive && <div className="leo-room__hint" style={{ bottom: 76 }}><b>⌘</b>{cn ? "拖动观察 · 右键平移 · 滚轮靠近" : "DRAG TO LOOK · RIGHT-DRAG TO MOVE · SCROLL TO APPROACH"}</div>}
      </div>

      {interactionState==='SITTING'&&<LoungeMusicPlayer onStandUp={interaction.standUp}/>}
      {interaction.seatActive && interactionState!=='SITTING' && <aside className={styles.seatStatus}><span>{interactionState === "STANDING_UP" ? (cn?'正在起身':'Standing up') : (cn?'慢慢坐下':'Taking a seat')}</span><button type="button" onClick={interaction.standUp} disabled={interactionState === "STANDING_UP"}>{cn?'起身':'Stand up'} <small>ESC</small></button></aside>}

      {(content?.type === "desk" || readingOpen) &&
        <nav className={styles.navigation}><button type="button" className={styles.button} onClick={returnToExplore}>← {cn ? "返回房间" : "Return to room"}</button></nav>
      }
      {content?.type === "desk" && <DeskDetailOverlay id={content.selection.id} onClose={returnToExplore} />}
      {readingOpen && <ChildhoodGame onClose={returnToExplore} />}
      {content?.type === "world" && <RoomModuleOverlay label={travelGlobeName[language]} returnLabel={cn ? "返回我的世界" : "Back to Leo’s World"} onClose={returnToExplore}><MyWorldPage embedded /></RoomModuleOverlay>}
      {content?.type === "photo" && <PhotoLightbox photos={photoWallImages} selectedId={content.id} onSelect={interaction.selectPhoto} onClose={interaction.closePhotoLightbox} />}
    </main>
  );
}
