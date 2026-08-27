"use client";

import { useEffect, useMemo, useState } from "react";
import { SiteNavbar } from "@/components/layout/SiteNavbar";
import { useLanguage } from "@/components/LanguageProvider";
import type { TravelRecord } from "@/data/travelData";
import { loadTravelRecords, removeTravelRecord, saveTravelRecords, upsertTravelRecord } from "@/lib/travelStore";
import { TravelGlobe } from "./TravelGlobe";
import { MemoryCard } from "./MemoryCard";
import { PlacesList } from "./PlacesList";
import { TravelEditor } from "./TravelEditor";

export function MyWorldPage() {
  const { language } = useLanguage();
  const cn = language === "cn";
  const [records, setRecords] = useState<TravelRecord[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [picked, setPicked] = useState<{ lat: number; lng: number } | null>(null);
  const [storageError, setStorageError] = useState("");

  useEffect(() => {
    setRecords(loadTravelRecords());
    setEditMode(new URLSearchParams(window.location.search).get("edit") === "true");
    setHydrated(true);
  }, []);

  const selectedIndex = records.findIndex((record) => record.id === selectedId);
  const selected = selectedIndex >= 0 ? records[selectedIndex] : null;
  const editing = editingId ? records.find((record) => record.id === editingId) ?? null : null;
  const countries = useMemo(() => new Set(records.map((record) => record.country.trim()).filter(Boolean)).size, [records]);

  const select = (record: TravelRecord) => {
    setSelectedId(record.id);
    if (!editorOpen) setPicked(null);
  };
  const persist = (next: TravelRecord[]) => {
    try {
      saveTravelRecords(next);
      setRecords(next);
      setStorageError("");
    } catch {
      setStorageError(cn ? "浏览器存储空间不足，请更换更小的照片后重试。" : "Browser storage is full. Please try a smaller image.");
    }
  };

  return (
    <main className="my-world-page">
      <SiteNavbar />
      <div className="my-world-stars" aria-hidden="true" />
      <section className="my-world-hero">
        <div className="my-world-copy">
          <p className="my-world-kicker">07 / PERSONAL EARTH ARCHIVE</p>
          <h1>{cn ? "我的地球" : "My World"}</h1>
          <span>MY WORLD</span>
          <p className="my-world-intro">{cn ? "去过的地方，会慢慢变成记忆的坐标。" : "The places we visit slowly become coordinates of memory."}</p>
          <dl className="my-world-stats">
            <div><dt>PLACES</dt><dd>{String(records.length).padStart(2, "0")}</dd></div>
            <div><dt>COUNTRIES</dt><dd>{String(countries).padStart(2, "0")}</dd></div>
            <div><dt>MEMORIES</dt><dd>{String(records.length).padStart(2, "0")}</dd></div>
          </dl>
          <p className="my-world-storage-note">{cn ? "旅行记录保存在当前浏览器中。" : "Travel records are stored in this browser."}</p>
          {editMode && <button type="button" className="my-world-add" onClick={() => { setEditingId(null); setPicked(null); setEditorOpen(true); }}>＋ {cn ? "添加一段记忆" : "Add a memory"}</button>}
        </div>

        <div className="my-world-stage">
          <TravelGlobe records={records} selectedId={selectedId} editing={editMode && editorOpen} onSelect={select} onPick={(coordinates) => { setPicked(coordinates); if (!editorOpen) { setEditingId(null); setEditorOpen(true); } }} />
          {!hydrated && <div className="my-world-loading">LOCATING MEMORIES…</div>}
          {selected && !editorOpen && <MemoryCard record={selected} index={selectedIndex} total={records.length} editable={editMode} onClose={() => setSelectedId(null)} onPrevious={() => select(records[(selectedIndex - 1 + records.length) % records.length])} onNext={() => select(records[(selectedIndex + 1) % records.length])} onEdit={() => { setEditingId(selected.id); setPicked(null); setEditorOpen(true); }} onDelete={() => { if (window.confirm(cn ? "确认删除这段旅行记忆？" : "Delete this travel memory?")) { persist(removeTravelRecord(records, selected.id)); setSelectedId(null); } }} />}
          {editMode && editorOpen && <TravelEditor record={editing} picked={picked} onCancel={() => { setEditorOpen(false); setEditingId(null); setPicked(null); }} onSave={(record) => { const next = upsertTravelRecord(records, record); persist(next); setSelectedId(record.id); setEditorOpen(false); setEditingId(null); setPicked(null); }} />}
          {storageError && <div className="my-world-error">{storageError}</div>}
        </div>
      </section>
      <PlacesList records={records} selectedId={selectedId} onSelect={select} />
      {editMode && <div className="my-world-edit-flag">EDIT MODE · LOCAL ONLY</div>}
    </main>
  );
}
