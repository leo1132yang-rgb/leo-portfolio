"use client";

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { ChildhoodEngine, readProgress } from './engine';
import { drawWorld, type Art } from './render';
import { memoryEvents, scenes, unlockedPages } from './world';
import styles from './childhood.module.css';

const Reader = dynamic(() => import('../ChildhoodReadingOverlay').then(m => m.ChildhoodReadingOverlay), { ssr: false });

export function MemoryAlbum({ completed, art, initialId, onClose, onRoom }: {
  completed: string[]; art: Art; initialId?: string; onClose: () => void; onRoom: () => void;
}) {
  const [selected, setSelected] = useState(initialId && completed.includes(initialId) ? initialId : completed.at(-1));
  const [reading, setReading] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null), heading = useRef<HTMLHeadingElement>(null);
  const list = useRef<HTMLElement>(null), selectedButton = useRef<HTMLButtonElement>(null);
  const entry = memoryEvents.find(e => e.id === selected && completed.includes(e.id));
  const pages = unlockedPages(completed);
  useEffect(() => { heading.current?.focus(); }, []);
  useEffect(() => {
    const node = list.current; if (!node) return;
    const align = () => selectedButton.current?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    const observer = new ResizeObserver(align); observer.observe(node); align();
    return () => observer.disconnect();
  }, [selected, reading]);
  useEffect(() => {
    const handle = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault(); event.stopImmediatePropagation();
      if (reading) setReading(false); else onClose();
    };
    document.addEventListener('keydown', handle, true);
    return () => document.removeEventListener('keydown', handle, true);
  }, [reading, onClose]);
  useEffect(() => {
    const node = canvas.current;
    if (!node || !entry || reading) return;
    const paint = () => {
      const box = node.getBoundingClientRect();
      node.width = Math.max(1, Math.round(box.width)); node.height = Math.max(1, Math.round(box.height));
      const context = node.getContext('2d'); if (!context) return;
      // A separate, read-only scene preview never changes the player's game or save.
      const preview = new ChildhoodEngine({ ...readProgress(null), completed });
      preview.viewWidth = node.width / (node.height / 600);
      preview.changeScene(entry.scene, entry.x); preview.interact();
      if (entry.kind === 'breakfast') preview.changeScene('kitchen', 425, true);
      const time = entry.kind === 'belly' ? 7 : entry.kind === 'breakfast' ? 9 : 3;
      if (preview.encounter) preview.encounter.elapsed = time;
      preview.time = time; preview.transition = 0;
      preview.camera = Math.max(0, Math.min(scenes[preview.scene].width - preview.viewWidth, preview.x - preview.viewWidth * .48));
      drawWorld(context, art, preview, node.width, node.height, true);
    };
    const observer = new ResizeObserver(paint); observer.observe(node); paint();
    return () => observer.disconnect();
  }, [entry, art, completed, reading]);
  return <div className={styles.book} role="dialog" aria-modal="true" aria-label="互动回看">
    <div className={styles.album} inert={reading} aria-hidden={reading || undefined}>
      <header className={styles.albumHeader}><div><small>THOSE DAYS, STILL HERE</small><h2 ref={heading} tabIndex={-1}>互动回看</h2><p>已完成 {completed.length} / {memoryEvents.length} 段记忆 · 原故事 {pages.length} / 18 页</p></div><button onClick={onClose}>返回童年世界</button></header>
      <div className={styles.albumBody}>
        <nav ref={list} className={styles.albumList} aria-label="已发现和未发现的记忆">
          {memoryEvents.map((memory, i) => <button ref={entry?.id === memory.id ? selectedButton : undefined} key={memory.id} disabled={!completed.includes(memory.id)} aria-pressed={entry?.id === memory.id} onClick={() => setSelected(memory.id)}>
            <span>{String(i + 1).padStart(2, '0')}</span><strong>{completed.includes(memory.id) ? memory.title : '还未遇见的记忆'}</strong><small>{completed.includes(memory.id) ? '回看 →' : '等待探索'}</small>
          </button>)}
        </nav>
        <section className={styles.albumPage} aria-label="记忆内容">
          {entry ? <><canvas ref={canvas} aria-label={entry.title + '的场景回看'} /><div className={styles.albumCopy}><small>{scenes[entry.scene].title}</small><h3>{entry.title}</h3><p>{entry.line || '打烊以后，睡在父亲的肚皮上。'}</p>{entry.pages.length > 0 && <button onClick={() => setReading(true)}>打开原记忆册 →</button>}</div></> : <div className={styles.albumCopy}><h3>留一页，给下一次相遇。</h3><p>完成任意一段记忆互动，就能在这里回看场景和故事。</p></div>}
        </section>
      </div>
      <footer className={styles.albumFooter}><span>走过的地方，遇见的人。</span><button onClick={onRoom}>← 返回 Leo&apos;s Room</button></footer>
    </div>
    {reading && entry && <Reader open activeId={String(entry.pages[0]).padStart(2, '0')} allowedPages={pages} closeLabel="返回互动回看" onClose={() => setReading(false)} />}
  </div>;
}
