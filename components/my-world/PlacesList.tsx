"use client";

import type { TravelRecord } from "@/data/travelData";

export function PlacesList({ records, selectedId, onSelect }: {
  records: TravelRecord[];
  selectedId: string | null;
  onSelect: (record: TravelRecord) => void;
}) {
  const groups = records.reduce<Record<string, TravelRecord[]>>((result, record) => {
    const year = record.date.match(/\d{4}/)?.[0] ?? "未归档";
    (result[year] ??= []).push(record);
    return result;
  }, {});
  const years = Object.keys(groups).sort((a, b) => b.localeCompare(a));

  return (
    <section className="travel-places" aria-label="All places">
      <header><span>ALL PLACES</span><b>{String(records.length).padStart(2, "0")}</b></header>
      <div className="travel-places__groups">
        {years.map((year) => <div key={year}><time>{year}</time><div>{groups[year].map((record) => <button key={record.id} type="button" className={selectedId === record.id ? "is-active" : ""} onClick={() => onSelect(record)}>{record.city}<span>{record.country}</span></button>)}</div></div>)}
      </div>
    </section>
  );
}
