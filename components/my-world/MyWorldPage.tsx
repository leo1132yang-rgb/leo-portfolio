"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { SiteNavbar } from "@/components/layout/SiteNavbar";
import { useLanguage } from "@/components/LanguageProvider";
import { getTravelPlacePhotos, travelWorldArcs, travelWorldPlaces, type TravelWorldPlace } from "@/data/travelWorld";

const World = dynamic(() => import("@/components/ui/globe").then((module) => module.World), {
  ssr: false,
  loading: () => <div className="my-world-loading">LOADING WORLD...</div>,
});

const globeConfig = {
  pointSize: 3.6,
  globeColor: "#07131f",
  showAtmosphere: true,
  atmosphereColor: "#f4efe6",
  atmosphereAltitude: .1,
  emissive: "#07131f",
  emissiveIntensity: .1,
  shininess: .82,
  polygonColor: "rgba(255,255,255,0.52)",
  ambientLight: "#6ea6b8",
  directionalLeftLight: "#f1e3ca",
  directionalTopLight: "#dcecf2",
  pointLight: "#e4d1a1",
  arcTime: 1700,
  arcLength: .82,
  rings: 1,
  maxRings: 3,
  initialPosition: { lat: 22.3193, lng: 114.1694 },
  autoRotate: true,
  autoRotateSpeed: .32,
};

export function MyWorldPage() {
  const { language } = useLanguage();
  const cn = language === "cn";
  const [selectedId, setSelectedId] = useState("hong-kong");
  const selected = travelWorldPlaces.find((place) => place.id === selectedId) ?? travelWorldPlaces[0];
  const selectedIndex = travelWorldPlaces.findIndex((place) => place.id === selected.id);
  const selectedPhotos = getTravelPlacePhotos(selected);
  const countries = useMemo(() => new Set(travelWorldPlaces.map((place) => cn ? place.countryZh : place.countryEn)).size, [cn]);
  const memories = useMemo(() => new Set(travelWorldPlaces.flatMap((place) => place.photoIds)).size, []);

  const selectPlace = (place: TravelWorldPlace) => setSelectedId(place.id);
  const step = (direction: 1 | -1) => {
    const nextIndex = (selectedIndex + direction + travelWorldPlaces.length) % travelWorldPlaces.length;
    setSelectedId(travelWorldPlaces[nextIndex].id);
  };

  return (
    <main className="my-world-page">
      <SiteNavbar />
      <div className="my-world-stars" aria-hidden="true" />
      <section className="my-world-hero">
        <motion.div
          className="my-world-copy"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .72, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="my-world-kicker">LEO&apos;S WORLD</p>
          <h1>{cn ? "我的地球" : "MY WORLD"}</h1>
          <span>LEO&apos;S WORLD</span>
          <p className="my-world-intro">
            {cn ? <>我走过的地方，<br />最终都变成了照片、故事和记忆。</> : <>Places I&apos;ve been,<br />stories I brought back.</>}
          </p>
          <dl className="my-world-stats">
            <div><dt>PLACES</dt><dd>{String(travelWorldPlaces.length).padStart(2, "0")}</dd></div>
            <div><dt>MEMORIES</dt><dd>{String(memories).padStart(2, "0")}</dd></div>
            <div><dt>HOME</dt><dd>{cn ? "香港" : "HK"}</dd></div>
          </dl>
          <Link href="/other-side" className="my-world-back">← {cn ? "返回另一面" : "Back to The Other Side"}</Link>
        </motion.div>

        <motion.div
          className="my-world-stage"
          initial={{ opacity: 0, scale: .96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: .68, ease: [0.16, 1, 0.3, 1], delay: .12 }}
        >
          <World
            data={travelWorldArcs}
            globeConfig={globeConfig}
            places={travelWorldPlaces}
            selectedId={selected.id}
            language={language}
            onPlaceClick={selectPlace}
          />
          <div className="travel-globe__hint">{cn ? "拖动旋转 · 滚轮缩放 · 点击坐标" : "DRAG · ZOOM · TAP A COORDINATE"}</div>
        </motion.div>

        <motion.aside
          className="travel-memory-card travel-memory-card--world"
          key={selected.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .32, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="travel-memory-card__eyebrow">MEMORY COORDINATE</p>
          <h2>{cn ? selected.nameZh : selected.nameEn} <span>{cn ? selected.countryZh : selected.countryEn}</span></h2>
          <time>{selected.date}</time>
          <div className="travel-memory-card__image">
            {selectedPhotos[0] ? <img src={selectedPhotos[0].thumbnailSrc} alt={selectedPhotos[0].title} /> : <div><span>{selected.lat.toFixed(2)}°</span><span>{selected.lng.toFixed(2)}°</span></div>}
          </div>
          <blockquote>{cn ? selected.caption : selected.caption}</blockquote>
          {selectedPhotos.length > 1 && (
            <div className="travel-memory-card__thumbs" aria-label="Related memories">
              {selectedPhotos.slice(0, 4).map((photo) => <img key={photo.id} src={photo.thumbnailSrc} alt={photo.title} />)}
            </div>
          )}
          <footer>
            <button type="button" onClick={() => step(-1)}>← {cn ? "上一处" : "Prev"}</button>
            <span>{String(selectedIndex + 1).padStart(2, "0")} / {String(travelWorldPlaces.length).padStart(2, "0")}</span>
            <button type="button" onClick={() => step(1)}>{cn ? "下一处" : "Next"} →</button>
          </footer>
        </motion.aside>
      </section>

      <section className="travel-places" aria-label="All places">
        <header><span>ALL PLACES</span><b>{cn ? `${countries} 个国家 / 地区` : `${countries} countries / regions`}</b></header>
        <div className="travel-places__groups">
          <div>
            <time>{cn ? "记忆坐标" : "Coordinates"}</time>
            <div>
              {travelWorldPlaces.map((place) => (
                <button type="button" key={place.id} className={place.id === selected.id ? "is-active" : ""} onClick={() => selectPlace(place)}>
                  {cn ? place.nameZh : place.nameEn}<span>{place.date.split(" / ")[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
