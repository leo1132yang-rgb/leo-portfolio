import { INITIAL_TRAVEL_RECORDS, type TravelRecord } from "@/data/travelData";

export const TRAVEL_STORAGE_KEY = "leo-my-world-records-v1";

export function loadTravelRecords(): TravelRecord[] {
  if (typeof window === "undefined") return INITIAL_TRAVEL_RECORDS;
  try {
    const raw = window.localStorage.getItem(TRAVEL_STORAGE_KEY);
    if (!raw) return INITIAL_TRAVEL_RECORDS;
    const records = JSON.parse(raw) as TravelRecord[];
    return Array.isArray(records) ? records : INITIAL_TRAVEL_RECORDS;
  } catch {
    return INITIAL_TRAVEL_RECORDS;
  }
}

export function saveTravelRecords(records: TravelRecord[]) {
  window.localStorage.setItem(TRAVEL_STORAGE_KEY, JSON.stringify(records));
}

export function upsertTravelRecord(records: TravelRecord[], next: TravelRecord) {
  const index = records.findIndex((record) => record.id === next.id);
  if (index < 0) return [...records, next];
  return records.map((record) => (record.id === next.id ? next : record));
}

export function removeTravelRecord(records: TravelRecord[], id: string) {
  return records.filter((record) => record.id !== id);
}
