"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { LanguageSwitch, useLanguage } from "@/components/LanguageProvider";
import { useGlobalAudio } from "@/hooks/useGlobalAudio";
import type { LeoRoomFocusId } from "@/data/leoRoomCamera";
import { photoWallImages } from "@/data/photoWall";
import type { DeskSelection } from "@/data/deskItems";
import { useRoomInteractionController } from "@/components/leo-room/useRoomInteractionController";
import { RoomModuleOverlay } from "@/components/leo-room/RoomModuleOverlay";
import vinylStyles from "@/components/leo-room/VinylListeningCorner.module.css";
import { VinylListeningCorner } from "@/components/leo-room/VinylListeningCorner";
import styles from "@/components/leo-room/RoomNavigation.module.css";

const DeskDetailOverlay = dynamic(() => import("@/components/leo-room/DeskDetailOverlay").then(mod => mod.DeskDetailOverlay), { ssr: false });
const LeoRoomScene = dynamic(() => import("@/components/LeoRoomScene").then(mod => mod.LeoRoomScene), {
  ssr: false, loading: () => <div className="leo-room__loading">ENTERING ROOM...</div>,
});
const ChildhoodGame = dynamic(() => import("@/components/leo-room/childhood/ChildhoodGame"), { ssr: false });
const PhotoLightbox = dynamic(() => import("@/components/leo-room/PhotoLightbox").then(mod => mod.PhotoLightbox), { ssr: false });
const MyWorldPage = dynamic(() => import("@/components/my-world/MyWorldPage").then(mod => mod.MyWorldPage), { ssr: false });

export function OtherSide({ onRoomReady }: { onRoomReady?: () => void } = {}) {
  const { language } = useLanguage();
  const { switchTrack, registerVinyl, toggleVinyl, vinylIsPlaying, vinylWantsPlay, vinylTrack } = useGlobalAudio();
  const [vinylOpen, setVinylOpen] = useState(false);
  const activateVinyl = useCallback(() => { setVinylOpen(true); toggleVinyl(); }, [toggleVinyl]);
  const cn = language === "cn";
  const interaction = useRoomInteractionController();
  const { activeHotspot, interactionState, content, contentOpen, returnToExplore, openContent } = interaction;
  const [showExploreHint, setShowExploreHint] = useState(true);
  useEffect(registerVinyl, [registerVinyl]);
  useEffect(() => interaction.registerVinylAction(activateVinyl), [interaction.registerVinylAction, activateVinyl]);
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
    }
    interaction.focusHotspot(id);
  };
  const selectDeskItem = (selection: DeskSelection) => {
    if (!contentOpen) openContent({ type: "desk", selection });
  };
  const focused = activeHotspot && !contentOpen && !interaction.seatActive;
  const focusLabel = activeHotspot === "bookshelf" ? (cn ? "私人书架" : "Bookshelf") : activeHotspot === "journey" ? "Childhood" : activeHotspot === "travel" ? "My World" : activeHotspot === "gallery" ? "Photo Wall" : activeHotspot === "desk" ? "Desk" : "Digital Lab";

  return (
    <main className={"leo-room" + (readingOpen ? " is-reading" : "") + (showVinyl ? " " + vinylStyles.listeningRoom : "")} data-room-state={interactionState} data-room-lighting={interaction.lightingMode} data-shelf-lamp={interaction.shelfLampOn} data-vinyl-playing={vinylIsPlaying} data-vinyl-intent={vinylWantsPlay} data-vinyl-track={vinylTrack.id} data-drawer-open={interaction.drawerOpen} data-reading-book={interaction.readingBook} data-living-item={interaction.activeLivingShelfItem ?? ""} data-plant-touch={interaction.plantTouch} data-chair-x={interaction.chairX.toFixed(3)} data-seat-active={interaction.seatActive} data-room-hotspot={activeHotspot ?? ""} data-room-content={content?.type ?? ""} onPointerDown={() => setShowExploreHint(false)}>
      <div inert={contentOpen}>
        <nav hidden={interaction.seatActive} className={styles.navigation} aria-label={cn ? "房间控制" : "Room controls"}>
          <Link href="/" className={styles.button}>{cn ? "退出房间" : "Exit room"} ↗</Link>
          {focused && <button type="button" className={styles.button} onClick={returnToExplore}>← {cn ? "返回探索" : "Back to explore"}</button>}
          <LanguageSwitch />
        </nav>
        <header className={"leo-room__heading " + styles.heading} hidden={interaction.seatActive}>
          <p>{cn ? "LEO 的另一面" : "THE OTHER SIDE"}</p>
          <h1>Leo&apos;s Room <i>/ Leo&apos;s Office</i></h1>
          <span>{cn ? "拖动观察空间，点击热点靠近。随时返回探索。" : "Drag to look around. Select a hotspot. Return to exploring anytime."}</span>
          <button type="button" className="leo-room__world-entry" onClick={() => focusWall("travel")}>
            <small>MY WORLD</small><b>{cn ? "我的地球" : "Travel memory globe"}</b><i>→</i>
          </button>
        </header>
        <div className="leo-room__canvas">
          <LeoRoomScene onReady={onRoomReady} interaction={interaction}
            onWallFocus={focusWall} onDeskFocus={() => focusWall("desk")}
            onChildhoodActivate={() => focusWall("journey")}
            onPhotoSelect={photo => { if (!contentOpen) openContent({ type: "photo", id: photo.id }); }}
            photoLightboxEnabled={activeHotspot === "gallery" && interactionState === "FOCUSED"}
            onDeskItemSelect={selectDeskItem} />
        </div>
        {showVinyl && <VinylListeningCorner onClose={() => setVinylOpen(false)} />}
        {focused && <aside className={styles.focus} aria-live="polite">
          <p>{focusLabel}<small>{activeHotspot === "desk" ? (cn ? "点击桌面物件，探索工作方式" : "Select an object to explore") : activeHotspot === "gallery" ? (cn ? "点击照片，查看故事" : "Select a photo to read its story") : (cn ? "拖动即可继续探索 · ESC 取消" : "Drag to explore · ESC to cancel")}</small></p>
          {activeHotspot === "journey" && <button type="button" className={styles.button} onClick={() => openContent({ type: "childhood" })}>{cn ? "探索童年世界" : "Explore childhood"} →</button>}
          {activeHotspot === "travel" && <button type="button" className={styles.button} onClick={() => openContent({ type: "world" })}>{cn ? "进入 My World" : "Enter My World"} →</button>}
          {activeHotspot === "digital" && <Link className={styles.button} href="/leo-os">{cn ? "查看内容" : "View content"} ↗</Link>}
          <button type="button" className={styles.button} onClick={returnToExplore}>{cn ? "返回探索" : "Back to explore"} ×</button>
        </aside>}
        <div className={styles.status} hidden={interaction.seatActive}>
          <span aria-live="polite">{interactionState === "FREE_EXPLORE" ? "FREE EXPLORE" : interactionState === "RESTORING" ? "RETURNING TO EXPLORE" : "FOCUS · " + focusLabel.toUpperCase()}</span>
          <button type="button" className={styles.button} onClick={interaction.resetView}>RESET VIEW</button>
        </div>
        {showExploreHint && !interaction.seatActive && <div className="leo-room__hint" style={{ bottom: 76 }}><b>⌘</b>{cn ? "拖动探索 · 滚轮 / 双指缩放" : "DRAG TO EXPLORE · SCROLL / PINCH TO ZOOM"}</div>}
      </div>

      {interaction.seatActive && <aside className={styles.seatStatus}><span>{interactionState === "SITTING" ? "坐着看看" : interactionState === "STANDING_UP" ? "正在起身" : "慢慢坐下"}</span><button type="button" onClick={interaction.standUp} disabled={interactionState === "STANDING_UP"}>起身 <small>ESC</small></button></aside>}

      {(content?.type === "desk" || readingOpen) &&
        <nav className={styles.navigation}><button type="button" className={styles.button} onClick={returnToExplore}>← {cn ? "返回房间" : "Return to room"}</button></nav>
      }
      {content?.type === "desk" && <DeskDetailOverlay id={content.selection.id} onClose={returnToExplore} />}
      {readingOpen && <ChildhoodGame onClose={returnToExplore} />}
      {content?.type === "world" && <RoomModuleOverlay label="My World" returnLabel={cn ? "返回房间" : "Return to room"} onClose={returnToExplore}><MyWorldPage embedded /></RoomModuleOverlay>}
      {content?.type === "photo" && <PhotoLightbox photos={photoWallImages} selectedId={content.id} onSelect={interaction.selectPhoto} onClose={returnToExplore} />}
    </main>
  );
}
