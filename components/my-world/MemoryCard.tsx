"use client";

import type { TravelRecord } from "@/data/travelData";

export function MemoryCard({ record, index, total, editable, onClose, onPrevious, onNext, onEdit, onDelete }: {
  record: TravelRecord;
  index: number;
  total: number;
  editable: boolean;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <aside className="travel-memory-card" aria-label="Travel memory">
      <button type="button" className="travel-memory-card__close" onClick={onClose} aria-label="Close memory">×</button>
      <p className="travel-memory-card__eyebrow">MEMORY COORDINATE</p>
      <h2>{record.city} <span>· {record.country}</span></h2>
      <time>{record.date || "DATE UNKNOWN"}</time>
      <div className="travel-memory-card__image">
        {record.image ? <img src={record.image} alt={`${record.city} travel memory`} /> : <div><span>{record.lat.toFixed(2)}°</span><span>{record.lng.toFixed(2)}°</span></div>}
      </div>
      <blockquote>“{record.memory}”</blockquote>
      {editable && <div className="travel-memory-card__admin"><button type="button" onClick={onEdit}>编辑</button><button type="button" onClick={onDelete}>删除</button></div>}
      <footer>
        <button type="button" onClick={onPrevious}>← 上一处</button>
        <span>{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
        <button type="button" onClick={onNext}>下一处 →</button>
      </footer>
    </aside>
  );
}
