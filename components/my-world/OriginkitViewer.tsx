"use client";

import { useEffect, useState } from "react";
import Globe from "./OriginkitGlobe";
import { travelWorldPlaces, type TravelWorldPlace } from "@/data/travelWorld";

const markerConfig = {
  markers: travelWorldPlaces.map(({ id, lat, lng }) => ({ id, lat, lng })),
  color: "#C9A96E", size: 40,
};
const desktopDots = { color: "#dedbd3", size: 5, density: 8, allDots: false };
const mobileDots = { ...desktopDots, density: 7 };

export default function OriginkitViewer({ onSelect }: { onSelect: (place: TravelWorldPlace) => void }) {
  const [mobile, setMobile] = useState<boolean | null>(null);
  useEffect(() => { setMobile(window.matchMedia("(max-width: 767px)").matches); }, []);
  return <div className="earth-lightweight-stage">
    {mobile !== null && <Globe
      dots={mobile ? mobileDots : desktopDots} markerConfig={markerConfig}
      oceanColor="#050607" outlineColor="rgba(176,169,155,0.5)"
      graticuleColor="rgba(150,150,150,0.15)"
      initialLatitude={23} initialLongitude={-105}
      detail={5} scale={8} speed={2} smoothing={8}
      onMarkerSelect={id => {
        const place = travelWorldPlaces.find(item => item.id === id);
        if (place) onSelect(place);
      }}
    />}
  </div>;
}
