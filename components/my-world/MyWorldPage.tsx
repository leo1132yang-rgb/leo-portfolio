"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { SiteNavbar } from "@/components/layout/SiteNavbar";
import { useLanguage } from "@/components/LanguageProvider";
import { getTravelPlacePhotos, travelWorldPlaces, type TravelWorldPlace } from "@/data/travelWorld";
import { WORLD_LAND_PATHS } from "@/data/worldMapPaths";

const MAP_WIDTH = 1000;
const MAP_HEIGHT = 520;
const HOME_ID = "hong-kong";
const HOME_COORDINATE = { lat: 22.3193, lng: 114.1694 };

const ROBINSON_X = [1, 0.9986, 0.9954, 0.99, 0.9822, 0.973, 0.96, 0.9427, 0.9216, 0.8962, 0.8679, 0.835, 0.7986, 0.7597, 0.7186, 0.6732, 0.6213, 0.5722, 0.5322];
const ROBINSON_Y = [0, 0.062, 0.124, 0.186, 0.248, 0.31, 0.372, 0.434, 0.4958, 0.5571, 0.6176, 0.6769, 0.7346, 0.7903, 0.8435, 0.8936, 0.9394, 0.9761, 1];

function interpolateRobinson(values: number[], lat: number) {
  const absoluteLat = Math.abs(lat);
  const index = Math.min(17, Math.floor(absoluteLat / 5));
  const progress = (absoluteLat - index * 5) / 5;
  return values[index] + (values[index + 1] - values[index]) * progress;
}

function project(lng: number, lat: number) {
  const xCoefficient = interpolateRobinson(ROBINSON_X, lat);
  const yCoefficient = interpolateRobinson(ROBINSON_Y, lat) * (lat < 0 ? -1 : 1);
  const x = MAP_WIDTH / 2 + (lng / 180) * 430 * xCoefficient;
  const y = MAP_HEIGHT / 2 - yCoefficient * 225;
  return { x, y };
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

function focusTransform(place: TravelWorldPlace | null) {
  if (!place || place.id === HOME_ID) return "translate3d(0px,0px,0) scale(1)";
  const point = project(place.lng, place.lat);
  const tx = (MAP_WIDTH / 2 - point.x) * .075;
  const ty = (MAP_HEIGHT / 2 - point.y) * .075;
  return `translate3d(${tx.toFixed(1)}px,${ty.toFixed(1)}px,0) scale(1.1)`;
}

function shouldShowLabel(place: TravelWorldPlace, selected: boolean) {
  return selected || place.id === HOME_ID;
}

function WorldTravelMap({
  places,
  selected,
  language,
  onSelect,
}: {
  places: TravelWorldPlace[];
  selected: TravelWorldPlace | null;
  language: "cn" | "en";
  onSelect: (place: TravelWorldPlace) => void;
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const cn = language === "cn";
  const selectedPath = selected && selected.id !== HOME_ID ? connectionPath(selected) : null;

  return (
    <motion.div
      className="world-map-stage"
      initial={{ opacity: 0, scale: .98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: .7, ease: [0.22, 1, 0.36, 1] }}
    >
      <svg className="world-map-svg" viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} role="img" aria-label={cn ? "Leo 的旅行足迹地图" : "Leo's travel memory map"}>
        <defs>
          <linearGradient id="worldPanelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0b1822" stopOpacity=".92" />
            <stop offset="48%" stopColor="#061018" stopOpacity=".96" />
            <stop offset="100%" stopColor="#020507" stopOpacity=".98" />
          </linearGradient>
          <radialGradient id="worldOceanGlow" cx="62%" cy="42%" r="70%">
            <stop offset="0%" stopColor="#22383d" stopOpacity=".14" />
            <stop offset="54%" stopColor="#0c1b21" stopOpacity=".055" />
            <stop offset="100%" stopColor="#010305" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="worldLandSurface" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2c3d42" stopOpacity=".2" />
            <stop offset="48%" stopColor="#3f504f" stopOpacity=".18" />
            <stop offset="100%" stopColor="#8a7652" stopOpacity=".12" />
          </linearGradient>
          <radialGradient id="worldAsiaGlow" cx="68%" cy="43%" r="28%">
            <stop offset="0%" stopColor="#d6b46a" stopOpacity=".17" />
            <stop offset="42%" stopColor="#5f746d" stopOpacity=".08" />
            <stop offset="100%" stopColor="#020506" stopOpacity="0" />
          </radialGradient>
          <pattern id="worldLandDots" width="8" height="8" patternUnits="userSpaceOnUse">
            <circle cx="1.6" cy="1.8" r=".72" fill="#a8b7b5" opacity=".18" />
            <circle cx="5.8" cy="5.6" r=".48" fill="#d6b46a" opacity=".08" />
          </pattern>
          <pattern id="worldFineGrid" width="52" height="52" patternUnits="userSpaceOnUse">
            <path d="M52 0H0V52" fill="none" stroke="#b9c8c8" strokeOpacity=".028" strokeWidth="1" />
          </pattern>
          <clipPath id="worldLandClip">
            {WORLD_LAND_PATHS.map((path, index) => <path key={index} d={path} />)}
          </clipPath>
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
          <filter id="worldLandGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.6" result="blur" />
            <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.44 0 0 0 0 0.68 0 0 0 0 0.72 0 0 0 .42 0" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect className="world-map-panel-bg" x="10" y="16" width="980" height="488" rx="28" fill="url(#worldPanelGradient)" />
        <rect className="world-map-panel-grid" x="34" y="42" width="932" height="436" rx="20" fill="url(#worldFineGrid)" />
        <ellipse className="world-map-ocean-glow" cx="590" cy="252" rx="455" ry="208" fill="url(#worldOceanGlow)" />
        <g className="world-map-latlng" aria-hidden="true">
          {[-60, -30, 0, 30, 60].map((lat) => {
            const y = project(0, lat).y;
            return <line key={`lat-${lat}`} x1="48" y1={y} x2="952" y2={y} />;
          })}
          {[-120, -60, 0, 60, 120].map((lng) => {
            const x = project(lng, 0).x;
            return <line key={`lng-${lng}`} x1={x} y1="58" x2={x} y2="462" />;
          })}
        </g>

        <g className="world-map-float" style={{ transform: focusTransform(selected) }}>
          <g className="world-map-land-aura" filter="url(#worldLandGlow)" aria-hidden="true">
            {WORLD_LAND_PATHS.map((path, index) => <path key={index} d={path} />)}
          </g>
          <g className="world-map-land-surface" aria-hidden="true">
            {WORLD_LAND_PATHS.map((path, index) => <path key={index} d={path} />)}
          </g>
          <rect className="world-map-asia-glow" x="38" y="44" width="924" height="432" clipPath="url(#worldLandClip)" fill="url(#worldAsiaGlow)" />
          <rect className="world-map-land-dots" x="38" y="44" width="924" height="432" clipPath="url(#worldLandClip)" fill="url(#worldLandDots)" />
          <g className="world-map-land">
            {WORLD_LAND_PATHS.map((path, index) => <path key={index} d={path} />)}
          </g>

          <g className="world-map-lines">
            {selectedPath && <path d={selectedPath} className="world-map-line-active" />}
          </g>

          <g className="world-map-nodes">
            {places.map((place, index) => {
              const point = project(place.lng, place.lat);
              const active = place.id === selected?.id;
              const hovered = place.id === hoveredId;
              const home = place.id === HOME_ID;
              const showLabel = shouldShowLabel(place, active || hovered);
              const label = cn ? place.nameZh : place.nameEn.toUpperCase();
              return (
                <motion.g
                  key={place.id}
                  className={`world-map-node${active ? " is-active" : ""}${hovered ? " is-hovered" : ""}${home ? " is-home" : ""}`}
                  style={{ transformOrigin: `${point.x}px ${point.y}px` }}
                  initial={{ opacity: 0, scale: .75 }}
                  animate={{ opacity: 1, scale: active || hovered ? 1.4 : home ? 1.08 : 1 }}
                  transition={{ duration: .22, delay: index * .025, ease: [0.22, 1, 0.36, 1] }}
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
                  {(home || active || hovered) && <circle className="world-map-node__ring" cx={point.x} cy={point.y} r={home ? 11 : 9} />}
                  <circle className="world-map-node__dot" cx={point.x} cy={point.y} r={home ? 5.6 : active || hovered ? 4.8 : 3.35} />
                  {showLabel && (
                    <g className={`world-map-label${home ? " is-origin" : ""}`}>
                      <line x1={point.x + 8} y1={point.y - 8} x2={point.x + 28} y2={point.y - 22} />
                      <text x={point.x + 32} y={point.y - 28}>{place.nameEn.toUpperCase()}</text>
                      <text x={point.x + 32} y={point.y - 13} className="world-map-label__date">
                        {cn ? `${place.nameZh} · ${place.date.split(" / ")[0]}` : `${place.nameZh} · ${place.date.split(" / ")[0]}`}
                      </text>
                      {home && <text x={point.x + 32} y={point.y + 1} className="world-map-label__origin">ORIGIN</text>}
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

function TravelMemoryDrawer({
  place,
  photos,
  language,
  onClose,
}: {
  place: TravelWorldPlace | null;
  photos: ReturnType<typeof getTravelPlacePhotos>;
  language: "cn" | "en";
  onClose: () => void;
}) {
  const cn = language === "cn";
  const [isSheet, setIsSheet] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 860px)");
    const update = () => setIsSheet(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <AnimatePresence>
      {place && (
        <motion.aside
          className="travel-memory-drawer"
          initial={{ opacity: 0, x: 44, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 44, y: 0 }}
          transition={{ duration: .56, ease: [0.22, 1, 0.36, 1] }}
          drag={isSheet ? "y" : false}
          dragConstraints={{ top: 0, bottom: 120 }}
          dragElastic={{ top: 0, bottom: .18 }}
          onDragEnd={(_, info) => {
            if (info.offset.y > 90 || info.velocity.y > 650) onClose();
          }}
          aria-live="polite"
        >
          <div className="travel-memory-drawer__handle" aria-hidden="true" />
          <button type="button" className="travel-memory-drawer__close" onClick={onClose}>
            × <span>CLOSE</span>
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={place.id}
              className="travel-memory-drawer__content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: .32, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="travel-memory-drawer__eyebrow">TRAVEL MEMORY</p>
              <h2>
                {cn ? place.nameZh : place.nameEn}
                <span>{cn ? place.nameEn.toUpperCase() : place.countryEn.toUpperCase()}</span>
              </h2>
              <time>{place.date}</time>
              <blockquote>{place.id === HOME_ID && cn ? "这里不是旅程的终点，而是大多数故事开始的地方。" : place.caption}</blockquote>

              {photos.length > 0 && (
                <div className={`travel-memory-drawer__photos is-count-${Math.min(photos.length, 3)}`}>
                  {photos.slice(0, 3).map((photo, index) => (
                    <img
                      key={photo.id}
                      src={photo.thumbnailSrc ?? photo.previewSrc ?? photo.src}
                      alt={photo.title}
                      loading="lazy"
                      decoding="async"
                      className={index === 0 ? "is-primary" : ""}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

export function MyWorldPage() {
  const { language } = useLanguage();
  const cn = language === "cn";
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = selectedId ? travelWorldPlaces.find((place) => place.id === selectedId) ?? null : null;
  const selectedPhotos = selected ? getTravelPlacePhotos(selected) : [];
  const selectPlace = (place: TravelWorldPlace) => setSelectedId(place.id);
  const closeMemory = () => setSelectedId(null);

  return (
    <main className="my-world-page my-world-page--map">
      <SiteNavbar />
      <div className="my-world-stars" aria-hidden="true" />
      <motion.section
        className={`my-world-map-layout${selected ? " is-memory-open" : ""}`}
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
          <Link href="/other-side" className="my-world-back">← {cn ? "返回另一面" : "Back to The Other Side"}</Link>
        </aside>

        <section className="my-world-map-panel">
          <WorldTravelMap places={travelWorldPlaces} selected={selected} language={language} onSelect={selectPlace} />
          <div className="my-world-map-hint">
            <span>{cn ? "点击亮点，查看记忆" : "TAP A PLACE TO EXPLORE"}</span>
          </div>
        </section>

        <div className="my-world-place-count">PLACES · {travelWorldPlaces.length}</div>
      </motion.section>
      <TravelMemoryDrawer place={selected} photos={selectedPhotos} language={language} onClose={closeMemory} />
    </main>
  );
}
