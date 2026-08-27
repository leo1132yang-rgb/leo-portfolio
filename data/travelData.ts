export type TravelRecord = {
  id: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  date: string;
  memory: string;
  image: string;
  createdAt: string;
};

export const INITIAL_TRAVEL_RECORDS: TravelRecord[] = [
  {
    id: "seoul-2025",
    city: "首尔",
    country: "韩国",
    lat: 37.5665,
    lng: 126.978,
    date: "2025.12",
    memory: "那天晚上很冷，但街上的灯很好看。",
    image: "",
    createdAt: "2025-12-01T00:00:00.000Z",
  },
];
