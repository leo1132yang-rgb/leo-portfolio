"use client";

import { useEffect, useState } from "react";
import type { TravelRecord } from "@/data/travelData";

type Draft = Omit<TravelRecord, "id" | "createdAt">;
const EMPTY_DRAFT: Draft = { city: "", country: "", lat: 0, lng: 0, date: "", memory: "", image: "" };

async function compressImage(file: File) {
  const image = new Image();
  const source = URL.createObjectURL(file);
  try {
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Image could not be loaded"));
      image.src = source;
    });
    const max = 1440;
    const scale = Math.min(1, max / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(image.naturalWidth * scale);
    canvas.height = Math.round(image.naturalHeight * scale);
    canvas.getContext("2d")!.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.8);
  } finally {
    URL.revokeObjectURL(source);
  }
}

export function TravelEditor({ record, picked, onCancel, onSave }: {
  record: TravelRecord | null;
  picked: { lat: number; lng: number } | null;
  onCancel: () => void;
  onSave: (record: TravelRecord) => void;
}) {
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setDraft(record ? { city: record.city, country: record.country, lat: record.lat, lng: record.lng, date: record.date, memory: record.memory, image: record.image } : EMPTY_DRAFT);
  }, [record]);
  useEffect(() => {
    if (picked) setDraft((current) => ({ ...current, lat: picked.lat, lng: picked.lng }));
  }, [picked]);

  const update = (key: keyof Draft, value: string | number) => setDraft((current) => ({ ...current, [key]: value }));

  return (
    <aside className="travel-editor">
      <header><div><span>{record ? "EDIT MEMORY" : "NEW MEMORY"}</span><h2>{record ? "修改旅行坐标" : "添加一段记忆"}</h2></div><button type="button" onClick={onCancel}>×</button></header>
      <p className="travel-editor__tip">可直接点击地球选择经纬度，再补充地点信息。</p>
      <form onSubmit={(event) => {
        event.preventDefault();
        onSave({
          ...draft,
          id: record?.id ?? `travel-${Date.now()}`,
          createdAt: record?.createdAt ?? new Date().toISOString(),
        });
      }}>
        <div className="travel-editor__row"><label>地点名称<input required value={draft.city} onChange={(event) => update("city", event.target.value)} /></label><label>国家 / 地区<input required value={draft.country} onChange={(event) => update("country", event.target.value)} /></label></div>
        <label>日期<input required placeholder="2026.08" value={draft.date} onChange={(event) => update("date", event.target.value)} /></label>
        <label>一句话记忆<textarea required rows={3} value={draft.memory} onChange={(event) => update("memory", event.target.value)} /></label>
        <div className="travel-editor__row"><label>纬度 LAT<input required type="number" min="-90" max="90" step="0.0001" value={draft.lat} onChange={(event) => update("lat", Number(event.target.value))} /></label><label>经度 LNG<input required type="number" min="-180" max="180" step="0.0001" value={draft.lng} onChange={(event) => update("lng", Number(event.target.value))} /></label></div>
        <label className="travel-editor__upload">照片<input type="file" accept="image/*" onChange={async (event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          setBusy(true);
          try { update("image", await compressImage(file)); } finally { setBusy(false); }
        }} /><span>{busy ? "正在压缩…" : draft.image ? "已选择照片 · 点击更换" : "选择一张照片"}</span></label>
        {draft.image && <div className="travel-editor__preview"><img src={draft.image} alt="Upload preview" /><button type="button" onClick={() => update("image", "")}>移除</button></div>}
        <footer><button type="button" onClick={onCancel}>取消</button><button type="submit" disabled={busy}>保存记忆</button></footer>
      </form>
    </aside>
  );
}
