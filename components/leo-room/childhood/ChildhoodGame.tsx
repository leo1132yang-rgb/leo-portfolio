"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import dynamic from 'next/dynamic';
import { createPortal } from "react-dom";
import { useGlobalAudio } from "@/hooks/useGlobalAudio";
import { ChildhoodEngine, readProgress, SAVE_KEY, type Input } from "./engine";
import { drawWorld, type Art } from "./render";
import { memoryEvents, scenes, smallInteractions, unlockedPages } from "./world";
import { MemoryAlbum } from './MemoryAlbum';
import styles from "./childhood.module.css";
import { ChildhoodDialogue } from "./ChildhoodDialogue";
import type { DialogueView } from "./dialogue";

const Reader = dynamic(() => import('../ChildhoodReadingOverlay').then(m => m.ChildhoodReadingOverlay), { ssr: false });
const EMPTY_INPUT: Input = { left: false, right: false, jump: false };
type Snapshot = { completed: string[]; title: string; subtitle: string; nearby: string; event: string; dialogue: DialogueView; cinematic: boolean; notice: string; ending: boolean };
const initialSnapshot: Snapshot = { completed: [], title: "白马李家", subtitle: "ACT 01 / 家门口的夏天", nearby: "", event: "", dialogue: null, cinematic: false, notice: "", ending: false };

export default function ChildhoodGame({ onClose }: { onClose: () => void }) {
  const root = useRef<HTMLElement>(null), canvas = useRef<HTMLCanvasElement>(null);
  const engine = useRef<ChildhoodEngine | null>(null), inputs = useRef<Input>({ ...EMPTY_INPUT });
  const loadedArt = useRef<Art | null>(null);
  const [bookEntry, setBookEntry] = useState<string | undefined>();
  const [bookKind, setBookKind] = useState<'stories' | 'moments'>('stories');
  const [mounted, setMounted] = useState(false), [ready, setReady] = useState(false), [error, setError] = useState("");
  const [started, setStarted] = useState(false), [menu, setMenu] = useState(false), [book, setBook] = useState(false);
  const [snapshot, setSnapshot] = useState<Snapshot>(initialSnapshot), [retry, setRetry] = useState(0), [saveWarning, setSaveWarning] = useState(false);
  const paused = useRef(true);
  const { isEnabled, toggleAudio } = useGlobalAudio();
  const pages = unlockedPages(snapshot.completed);
  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { paused.current = !started || menu || book; inputs.current = { ...EMPTY_INPUT }; engine.current?.idle.interrupt(); }, [started, menu, book]);

  const persist = useCallback(() => {
    if (!engine.current) return;
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(engine.current.progress)); }
    catch { setSaveWarning(true); }
  }, []);
  const close = useCallback(() => { persist(); onClose(); }, [persist, onClose]);
  const focusGame = () => root.current?.focus();

  useEffect(() => {
    if (!mounted || !canvas.current) return;
    let alive = true, frame = 0, previous = 0, lastPublish = 0, lastSave = 0, drawnWidth = 0, drawnHeight = 0, dialogueRevision = -1;
    let raw: string | null = null;
    try { raw = localStorage.getItem(SAVE_KEY); } catch { setSaveWarning(true); }
    const game = new ChildhoodEngine(readProgress(raw)); engine.current = game;
    const node = canvas.current, ctx = node.getContext("2d", { alpha: false });
    const oldFocus = document.activeElement as HTMLElement | null;
    const oldOverflow = document.body.style.overflow; document.body.style.overflow = "hidden";
    const background = Array.from(document.body.children).filter((el): el is HTMLElement => el instanceof HTMLElement && el !== root.current && !el.contains(root.current));
    const inertStates = background.map(el => el.inert); background.forEach(el => { el.inert = true; });
    root.current?.focus();
    if (!ctx) { setError("浏览器暂时无法打开画布。请重新打开 Childhood。"); document.body.style.overflow = oldOverflow; background.forEach((el, i) => { el.inert = inertStates[i]; }); return; }
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const resize = () => {
      const box = node.getBoundingClientRect();
      const ratio = Math.min(1.5, window.devicePixelRatio || 1);
      node.width = Math.max(1, Math.round(box.width * ratio)); node.height = Math.max(1, Math.round(box.height * ratio));
      game.viewWidth = node.width / (node.height / 600);
      game.camera = Math.max(0, Math.min(scenes[game.scene].width - game.viewWidth, game.x - game.viewWidth * .45));
    };
    const observer = new ResizeObserver(resize); observer.observe(node); resize();
    const images: HTMLImageElement[] = [];
    let art: Art | null = null;
    const publish = () => {
      const encounter = game.encounter, event = encounter?.event;
      const ending = event?.kind === "ending";
      setSnapshot({ completed: [...game.completed], title: game.scene === "street" || game.scene === 'schoolroad' && game.x > 1050 ? game.act.title : scenes[game.scene].title,
        subtitle: game.act.subtitle,
        nearby: game.nearby?.value.title || "", event: event?.title || "",
        dialogue: game.dialogue.view,
        cinematic: !!event && ["belly", "breakfast", "ending"].includes(event.kind),
        notice: game.noticeTime > 0 ? game.notice : "", ending: !!ending });
    };
    publish();
    const loop = (now: number) => {
      if (!alive || !art) return;
      const dt = previous ? (now - previous) / 1000 : 0; previous = now;
      if (!paused.current) game.update(dt, inputs.current);
      if (!paused.current || drawnWidth !== node.width || drawnHeight !== node.height) {
        drawWorld(ctx, art, game, node.width, node.height, motion.matches); drawnWidth = node.width; drawnHeight = node.height;
      }
      if (!paused.current && (now - lastPublish > 100 || dialogueRevision !== game.dialogue.revision)) { publish(); lastPublish = now; dialogueRevision = game.dialogue.revision; }
      if (now - lastSave > 2000) { persist(); lastSave = now; }
      frame = requestAnimationFrame(loop);
    };
    const visibility = () => {
      inputs.current = { ...EMPTY_INPUT }; previous = 0;
      cancelAnimationFrame(frame);
      if (document.hidden) persist(); else if (art) frame = requestAnimationFrame(loop);
    };
    const blur = () => { inputs.current = { ...EMPTY_INPUT }; persist(); };
    document.addEventListener("visibilitychange", visibility); window.addEventListener("blur", blur); window.addEventListener("pagehide", persist);
    setError(""); setReady(false);
    const names = ["countryside", "town", "interiors", "characters", "father-memory", "props", "reservoir", "nature-places", "outskirts", "town-block", "market-block", "arcade-room", "heng-room", "gandong-room", "grandpa-kitchen"] as const;
    Promise.all(names.map(name => new Promise<[typeof name, HTMLImageElement]>((resolve, reject) => {
      const image = new Image(); images.push(image); image.decoding = "async";
      image.onload = () => resolve([name, image]); image.onerror = () => reject(new Error(name));
      image.src = `/childhood-game/${name}.webp`;
    }))).then(entries => {
      if (!alive) return;
      art = Object.fromEntries(entries) as Art; loadedArt.current = art; setReady(true); frame = requestAnimationFrame(loop);
    }).catch(() => { if (alive) setError("有一张场景图片没有加载完成，请重试。"); });
    return () => {
      alive = false; persist(); cancelAnimationFrame(frame); observer.disconnect();
      document.removeEventListener("visibilitychange", visibility); window.removeEventListener("blur", blur); window.removeEventListener("pagehide", persist);
      images.forEach(image => { image.onload = null; image.onerror = null; image.src = ""; });
      art = null; loadedArt.current = null; engine.current = null; inputs.current = { ...EMPTY_INPUT };
      document.body.style.overflow = oldOverflow;
      background.forEach((el, i) => { el.inert = inertStates[i]; });
      if (oldFocus?.isConnected) oldFocus.focus();
    };
  }, [mounted, retry, persist]);

  useEffect(() => {
    if (!mounted) return;
    const handle = (event: KeyboardEvent) => {
      const down = event.type === "keydown";
      if (book && bookKind === 'moments' && event.key === 'Escape') return;
      if (event.key === "Escape") {
        event.preventDefault(); event.stopPropagation();
        if (down && !event.repeat) {
          if (book) { setBook(false); focusGame(); }
          else if (!started) close();
          else { setMenu(value => !value); focusGame(); }
        } return;
      }
      if (event.key === "Tab" && down) {
        const scope = book ? root.current?.querySelector('[class*="book"]') : menu ? root.current?.querySelector('[class*="menuShade"]') : root.current;
        const list = Array.from(scope?.querySelectorAll<HTMLElement>('button:not(:disabled), summary, [tabindex="0"]') || []).filter(el => el.getClientRects().length && !el.closest('[aria-hidden="true"]'));
        const first = list[0], last = list[list.length - 1];
        if (!scope?.contains(document.activeElement) || document.activeElement === root.current) { event.preventDefault(); (event.shiftKey ? last : first)?.focus(); }
        else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
        return;
      }
      if (!started || menu || book) return;
      if (engine.current?.encounter && ["e", "s", " "].includes(event.key.toLowerCase())) {
        event.preventDefault(); event.stopPropagation();
        if (!down && event.key === " ") inputs.current.jump = false;
        if (down && !event.repeat) engine.current.interact();
        return;
      }
      if (event.target instanceof HTMLElement && event.target.closest("button") && (event.key === " " || event.key === "Enter")) return;
      const key = event.key.toLowerCase();
      if (["arrowleft", "a", "arrowright", "d", "arrowup", "w", " ", "e", "s"].includes(key)) { event.preventDefault(); event.stopPropagation(); }
      if (key === "a" || key === "arrowleft") inputs.current.left = down;
      if (key === "d" || key === "arrowright") inputs.current.right = down;
      if (key === "w" || key === "arrowup" || key === " ") inputs.current.jump = down;
      if ((key === "e" || key === "s") && down && !event.repeat) engine.current?.interact();
    };
    window.addEventListener("keydown", handle, true); window.addEventListener("keyup", handle, true);
    return () => { window.removeEventListener("keydown", handle, true); window.removeEventListener("keyup", handle, true); };
  }, [mounted, started, menu, book, bookKind, close]);

  function hold(event: PointerEvent<HTMLButtonElement>, key: keyof Input, down: boolean) {
    event.preventDefault();
    if (down) event.currentTarget.setPointerCapture(event.pointerId);
    inputs.current[key] = down;
  }
  const interact = () => { if (!paused.current) engine.current?.interact(); focusGame(); };
  const openBook = (id?: string) => {
    persist(); setBookEntry(id);
    setBookKind(id && !memoryEvents.find(e => e.id === id)?.pages.length ? 'moments' : 'stories');
    setBook(true); setMenu(false);
  };
  const openMoments = () => { persist(); setBookEntry(undefined); setBookKind('moments'); setBook(true); setMenu(false); };
  if (!mounted) return null;
  return createPortal(
    <section ref={root} tabIndex={-1} role="dialog" aria-modal="true" aria-label="Leo 的童年像素世界" className={`${styles.game} ${snapshot.cinematic && !menu && !book ? styles.cinematic : ""}`}>
      <header className={styles.topbar}>
        <div className={styles.wordmark}>LEO&apos;S <strong>CHILDHOOD</strong><small>一个关于成长的像素世界</small></div>
        <div className={styles.hud} aria-label="探索进度"><span><i>✦</i><b>{String(snapshot.completed.length).padStart(2, "0")}</b><small>MEMORIES / {memoryEvents.length}</small></span><button disabled={!pages.length} onClick={() => openBook()} aria-label="打开童年记忆册"><i>▤</i><b>{String(pages.length).padStart(2, "0")}</b><small>STORY / 18</small></button></div>
        <nav className={styles.nav} aria-label="童年菜单">
          <button onClick={toggleAudio} aria-label={isEnabled ? "关闭声音" : "打开声音"}>声音 {isEnabled ? "开" : "关"}</button>
          {started && <button onClick={() => setMenu(v => !v)}>菜单</button>}
          <button className={styles.back} onClick={close}>← 返回 Leo&apos;s Room</button>
        </nav>
      </header>
      <div className={styles.stage}>
        <canvas ref={canvas} className={styles.canvas} aria-label="可左右探索的童年世界。使用方向键移动，空格跳跃，E 互动。" />
        {started && !menu && !book && <div className={styles.location}><span>{snapshot.subtitle}</span><h2>{snapshot.title}</h2></div>}
        {started && !menu && !book && !snapshot.event && ['shop', 'kitchen'].includes(engine.current?.scene || '') && <aside className={styles.routeGuide} aria-label="鸭鸭楼层指引"><strong>{engine.current?.scene === 'shop' ? '↑ 继续探索：二楼厨房与家' : '→ 继续探索：门后的床铺与仓库'}</strong><span>走近{engine.current?.scene === 'shop' ? '楼梯' : '木门'}，按 E 或点「互动」进入</span><small>{engine.current?.scene === 'shop' ? '回到街道：往左或往右走到道路尽头' : '回到一楼：往左或往右走到道路尽头'}</small></aside>}
        {!started && <div className={styles.start}>
          <span className={styles.eyebrow}>JIANGXI, CHINA / 那些年的夏天</span>
          <h1>那时候，<br />世界就在家门口。</h1>
          <p>走过石头路，穿过后山。<br />跟着父亲，再往前一点。</p>
          <div className={styles.exploreGuide}><strong>共 {memoryEvents.length + smallInteractions.length} 个内容互动</strong><span>{memoryEvents.length} 段记忆 · {smallInteractions.length} 处日常小互动</span><span>完成后可回看互动，对应故事会收录进原记忆册。</span></div>
          {error ? <><p role="alert">{error}</p><button className={styles.primary} onClick={() => setRetry(v => v + 1)}>重新加载</button></> : <button className={styles.primary} disabled={!ready} onClick={() => { setStarted(true); focusGame(); }}>{!ready ? "正在走进童年…" : snapshot.completed.length ? "CONTINUE  ▸  继续探索" : "PRESS START  ▸"}</button>}
          <small>自由探索 · 发现记忆 · 打开故事</small>
        </div>}
        {started && snapshot.nearby && !menu && !book && !snapshot.event && <button className={styles.prompt} onClick={interact}><kbd>E</kbd><span>{snapshot.nearby}</span><b>互动</b></button>}
        {snapshot.dialogue && !menu && !book && <ChildhoodDialogue dialogue={snapshot.dialogue} ending={snapshot.ending} onAdvance={interact} />}
        {snapshot.notice && !snapshot.event && !menu && !book && <div className={styles.unlocked} role="status"><span>✦ MEMORY UNLOCKED</span><p>{snapshot.notice}</p><button onClick={() => openBook(memoryEvents.find(e => e.title === snapshot.notice)?.id)}>{memoryEvents.find(e => e.title === snapshot.notice)?.pages.length ? "在记忆册中观看 →" : "回看这段互动 →"}</button></div>}
        {menu && <div className={styles.menuShade}><div className={styles.menu} role="dialog" aria-label="童年菜单"><span className={styles.eyebrow}>A LITTLE PAUSE</span><h2>记住的，都还在。</h2><p>已发现 {snapshot.completed.length} / {memoryEvents.length} 段记忆 · 原故事 {pages.length} / 18 页</p><button className={styles.primary} onClick={() => { setMenu(false); focusGame(); }}>继续探索 →</button><button onClick={() => openBook()} disabled={!pages.length}>打开记忆册 ({pages.length} / 18)</button><button onClick={openMoments} disabled={!snapshot.completed.length}>回看已完成的互动 ({snapshot.completed.length} / {memoryEvents.length})</button><details><summary>已经遇见的记忆</summary><ul>{memoryEvents.filter(e => snapshot.completed.includes(e.id)).map(e => <li key={e.id}>{e.title}</li>)}</ul></details><p className={styles.help}>← → / A D 移动 · 空格 / W / ↑ 跳跃<br />E / S 互动 · Esc 暂停<br />看到微光时，停下来遇见一段记忆。</p><button onClick={close}>← 返回 Leo&apos;s Room</button></div></div>}
      </div>
      <footer className={styles.footer}>
        <span className={styles.keyboard}><kbd>←</kbd><kbd>→</kbd> 移动 <kbd>SPACE</kbd> 跳跃 <kbd>E</kbd> 互动 <kbd>ESC</kbd> 菜单</span>
        <span className={styles.footerNote}>{saveWarning ? "此浏览器无法保存进度，本次探索仍可继续" : "那些日子，一直都在。"}</span>
        <span className={styles.footerBrand}>CHILDHOOD / LEO&apos;S ROOM</span>
      </footer>
      {started && !menu && !book && <div className={styles.touchControls} aria-label="触屏操作">
        <div>{(["left", "right"] as const).map(key => <button key={key} disabled={!!snapshot.event} aria-label={key === "left" ? "向左移动" : "向右移动"} onPointerDown={e => hold(e, key, true)} onPointerUp={e => hold(e, key, false)} onPointerCancel={e => hold(e, key, false)} onLostPointerCapture={() => { inputs.current[key] = false; }}>{key === "left" ? "←" : "→"}</button>)}</div>
        <div><button disabled={!!snapshot.event} aria-label="跳跃" onPointerDown={e => hold(e, "jump", true)} onPointerUp={e => hold(e, "jump", false)} onPointerCancel={e => hold(e, "jump", false)} onLostPointerCapture={() => { inputs.current.jump = false; }}>跳跃</button><button disabled={!snapshot.nearby || !!snapshot.event} onClick={interact}>互动</button></div>
      </div>}
      {book && bookKind === 'stories' && pages.length > 0 && <div className={styles.book}><Reader open activeId={String(memoryEvents.find(e => e.id === bookEntry)?.pages[0] || pages[0]).padStart(2, '0')} allowedPages={pages} closeLabel="返回童年世界" onClose={() => { setBook(false); focusGame(); }} /><button className={styles.bookRoomBack} onClick={close}>← 返回 Leo&apos;s Room</button></div>}
      {book && bookKind === 'moments' && loadedArt.current && <MemoryAlbum art={loadedArt.current} completed={snapshot.completed} initialId={bookEntry} onClose={() => { setBook(false); focusGame(); }} onRoom={close} />}
    </section>, document.body,
  );
}
