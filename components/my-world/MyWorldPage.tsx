"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { SiteNavbar } from "@/components/layout/SiteNavbar";
import { useLanguage } from "@/components/LanguageProvider";
import { getTravelPlacePhotos, travelWorldPlaces, type TravelWorldPlace } from "@/data/travelWorld";

const MAP_WIDTH = 1000;
const MAP_HEIGHT = 520;
const HOME_ID = "hong-kong";
const HOME_COORDINATE = { lat: 22.3193, lng: 114.1694 };

const LAND_SHAPES: Array<Array<[number, number]>> = [
  [[-168,72],[-145,70],[-127,62],[-122,50],[-130,37],[-118,25],[-99,16],[-83,23],[-72,41],[-58,53],[-65,65],[-96,72],[-126,76]],
  [[-82,13],[-72,7],[-66,-8],[-58,-26],[-65,-44],[-73,-55],[-81,-35],[-78,-11]],
  [[-18,36],[4,45],[26,38],[43,21],[48,2],[38,-16],[30,-35],[12,-34],[-4,-8],[-15,15]],
  [[-10,72],[28,70],[50,58],[75,60],[98,73],[132,70],[170,55],[152,36],[126,31],[113,14],[96,6],[80,23],[57,25],[42,40],[23,35],[8,47]],
  [[44,30],[64,31],[79,23],[89,13],[79,8],[62,18]],
  [[101,22],[111,17],[121,23],[132,34],[143,39],[144,28],[128,20],[118,5],[105,7]],
  [[112,-10],[153,-12],[161,-31],[145,-44],[117,-35]],
  [[-52,84],[-18,80],[-27,62],[-48,60]],
  [[-7,57],[9,58],[22,66],[16,71],[-4,70]],
  [[138,45],[146,41],[143,34],[133,33],[130,40]],
  [[120,24],[122,20],[121,18],[119,21]],
  [[100,14],[104,12],[103,7],[99,10]],
  [[72,9],[81,8],[80,1],[73,2]],
  [[-157,21],[-154,20],[-155,18],[-158,19]],
  [[-8,28],[-2,28],[-4,23],[-10,24]],
];

function project(lng: number, lat: number) {
  const compression = .96 - Math.abs(lat) / 90 * .18;
  const x = MAP_WIDTH / 2 + (lng / 180) * (MAP_WIDTH / 2) * compression;
  const y = ((90 - lat) / 180) * MAP_HEIGHT;
  return { x, y };
}

function polygonPath(points: Array<[number, number]>) {
  return points.map(([lng, lat], index) => {
    const point = project(lng, lat);
    return `${index === 0 ? "M" : "L"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
  }).join(" ") + " Z";
}

function connectionPath(place: TravelWorldPlace) {
  const start = project(HOME_COORDINATE.lng, HOME_COORDINATE.lat);
  const end = project(place.lng, place.lat);
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const curve = Math.min(82, Math.max(18, Math.abs(dx) * .08 + Math.abs(dy) * .05));
  const control = {
    x: start.x + dx * .52,
    y: start.y + dy * .48 - curve,
  };
  return `M${start.x.toFixed(1)} ${start.y.toFixed(1)} Q${control.x.toFixed(1)} ${control.y.toFixed(1)} ${end.x.toFixed(1)} ${end.y.toFixed(1)}`;
}

function focusTransform(place: TravelWorldPlace) {
  if (place.id === HOME_ID) return "translate3d(0px,0px,0) scale(1)";
  const point = project(place.lng, place.lat);
  const tx = (MAP_WIDTH / 2 - point.x) * .075;
  const ty = (MAP_HEIGHT / 2 - point.y) * .075;
  return `translate3d(${tx.toFixed(1)}px,${ty.toFixed(1)}px,0) scale(1.1)`;
}

function shouldShowLabel(place: TravelWorldPlace, selected: boolean) {
  return selected || place.id === HOME_ID || ["taipei", "maldives", "altay", "qinghai-lake", "pattaya"].includes(place.id);
}

function WorldTravelMap({
  places,
  selected,
  language,
  onSelect,
}: {
  places: TravelWorldPlace[];
  selected: TravelWorldPlace;
  language: "cn" | "en";
  onSelect: (place: TravelWorldPlace) => void;
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const cn = language === "cn";
  const selectedPath = selected.id === HOME_ID ? null : connectionPath(selected);

  return (
    <motion.div
      className="world-map-stage"
      initial={{ opacity: 0, scale: .98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: .7, ease: [0.22, 1, 0.36, 1] }}
    >
      <svg className="world-map-svg" viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} role="img" aria-label={cn ? "Leo 的旅行足迹地图" : "Leo's travel memory map"}>
        <defs>
          <radialGradient id="worldNodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e3d1a0" stopOpacity=".75" />
            <stop offset="44%" stopColor="#d6b46a" stopOpacity=".18" />
            <stop offset="100%" stopColor="#d6b46a" stopOpacity="0" />
          </radialGradient>
          <filter id="worldSoftGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g className="world-map-float" style={{ transform: focusTransform(selected) }}>
          <g className="world-map-land">
            {LAND_SHAPES.map((shape, index) => <path key={index} d={polygonPath(shape)} />)}
          </g>

          <g className="world-map-lines">
            {places.filter((place) => place.id !== HOME_ID).map((place) => (
              <path key={place.id} d={connectionPath(place)} className={place.id === selected.id ? "is-selected" : ""} />
            ))}
            {selectedPath && <path d={selectedPath} className="world-map-line-active" />}
          </g>

          <g className="world-map-nodes">
            {places.map((place, index) => {
              const point = project(place.lng, place.lat);
              const active = place.id === selected.id;
              const hovered = place.id === hoveredId;
              const home = place.id === HOME_ID;
              const showLabel = shouldShowLabel(place, active || hovered);
              const label = cn ? place.nameZh : place.nameEn.toUpperCase();
              return (
                <motion.g
                  key={place.id}
                  className={`world-map-node${active ? " is-active" : ""}${home ? " is-home" : ""}`}
                  style={{ transformOrigin: `${point.x}px ${point.y}px` }}
                  initial={{ opacity: 0, scale: .75 }}
                  animate={{ opacity: 1, scale: active || hovered ? 1.18 : 1 }}
                  transition={{ duration: .32, delay: index * .035, ease: [0.22, 1, 0.36, 1] }}
                  onMouseEnter={() => setHoveredId(place.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onFocus={() => setHoveredId(place.id)}
                  onBlur={() => setHoveredId(null)}
                  onClick={() => onSelect(place)}
                  tabIndex={0}
                  role="button"
                  aria-label={label}
                >
                  <circle className="world-map-node__hit" cx={point.x} cy={point.y} r="18" />
                  {(home || active) && <circle className="world-map-node__ring" cx={point.x} cy={point.y} r={home ? 12 : 10} />}
                  <circle className="world-map-node__dot" cx={point.x} cy={point.y} r={home ? 5.6 : active ? 5.2 : 4.1} />
                  {showLabel && (
                    <g className="world-map-label">
                      <line x1={point.x + 8} y1={point.y - 8} x2={point.x + 28} y2={point.y - 22} />
                      <text x={point.x + 32} y={point.y - 26}>{label}</text>
                      <text x={point.x + 32} y={point.y - 12} className="world-map-label__date">{place.date.split(" / ")[0]}</text>
                    </g>
                  )}
                </motion.g>
              );
            })}
          </g>
        </g>
      </svg>
      <div className="world-map-caption">DOT MEMORY MAP · HONG KONG AS ORIGIN</div>
    </motion.div>
  );
}

export function MyWorldPage() {
  const { language } = useLanguage();
  const cn = language === "cn";
  const [selectedId, setSelectedId] = useState(HOME_ID);
  const selected = travelWorldPlaces.find((place) => place.id === selectedId) ?? travelWorldPlaces[0];
  const selectedPhotos = getTravelPlacePhotos(selected);
  const countries = useMemo(() => new Set(travelWorldPlaces.map((place) => cn ? place.countryZh : place.countryEn)).size, [cn]);
  const memories = useMemo(() => new Set(travelWorldPlaces.flatMap((place) => place.photoIds)).size, []);

  const selectPlace = (place: TravelWorldPlace) => setSelectedId(place.id);

  return (
    <main className="my-world-page my-world-page--map">
      <SiteNavbar />
      <div className="my-world-stars" aria-hidden="true" />
      <motion.section
        className="my-world-map-layout"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: .48, ease: [0.22, 1, 0.36, 1] }}
      >
        <aside className="my-world-map-copy">
          <p className="my-world-kicker">MY WORLD</p>
          <h1>{cn ? "我的足迹" : "Places I’ve Been"}</h1>
          <p className="my-world-map-lead">
            {cn ? "世界没有变小，只是有一些地方，开始和我有关。" : <>The world didn’t get smaller.<br />Some places simply became part of my story.</>}
          </p>
          <dl className="my-world-stats my-world-stats--map">
            <div><dt>PLACES</dt><dd>{String(travelWorldPlaces.length).padStart(2, "0")}</dd></div>
            <div><dt>COUNTRIES</dt><dd>{String(countries).padStart(2, "0")}</dd></div>
            <div><dt>MEMORIES</dt><dd>{String(memories).padStart(2, "0")}</dd></div>
          </dl>
          <Link href="/other-side" className="my-world-back">← {cn ? "返回另一面" : "Back to The Other Side"}</Link>

          <motion.div
            className="travel-memory-card travel-memory-card--map"
            key={selected.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .36, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="travel-memory-card__eyebrow">SELECTED PLACE</p>
            <h2>{cn ? selected.nameZh : selected.nameEn}<span>{cn ? selected.nameEn.toUpperCase() : selected.countryEn}</span></h2>
            <time>{selected.date}</time>
            <blockquote>{selected.id === HOME_ID && cn ? "这里不是旅程的终点，而是大多数故事开始的地方。" : selected.caption}</blockquote>
            <div className="travel-memory-card__photos">
              {selectedPhotos.slice(0, 3).map((photo) => (
                <img key={photo.id} src={photo.thumbnailSrc ?? photo.previewSrc ?? photo.src} alt={photo.title} />
              ))}
            </div>
          </motion.div>
        </aside>

        <section className="my-world-map-panel">
          <WorldTravelMap places={travelWorldPlaces} selected={selected} language={language} onSelect={selectPlace} />
        </section>

        <section className="travel-places travel-places--map" aria-label="Visited places">
          <header><span>VISITED PLACES</span><b>{cn ? "已留下足迹" : "Places I unlocked"}</b></header>
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
      </motion.section>
    </main>
  );
}
