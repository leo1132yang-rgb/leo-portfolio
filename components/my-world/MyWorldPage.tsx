"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { SiteNavbar } from "@/components/layout/SiteNavbar";
import { useLanguage } from "@/components/LanguageProvider";
import { getTravelPlacePhotos, travelWorldPlaces, type TravelWorldPlace } from "@/data/travelWorld";

const EarthModelViewer = dynamic(() => import("@/components/my-world/EarthModelViewer"), {
  ssr: false,
  loading: () => (
    <div className="earth-model-stage">
      <div className="earth-model-loading">
        <span>MY WORLD</span>
        <b>LOADING EARTH...</b>
      </div>
    </div>
  ),
});

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
          initial={{ opacity: 0, x: isSheet ? 0 : 44, y: isSheet ? 80 : 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: isSheet ? 0 : 44, y: isSheet ? 80 : 0 }}
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
              <blockquote>{place.id === "hong-kong" && cn ? "这里不是旅程的终点，而是大多数故事开始的地方。" : place.caption}</blockquote>

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

  return (
    <main className="my-world-page my-world-page--earth">
      <SiteNavbar />
      <div className="my-world-stars" aria-hidden="true" />

      <motion.section
        className={`my-world-earth-layout${selected ? " is-memory-open" : ""}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: .48, ease: [0.22, 1, 0.36, 1] }}
      >
        <aside className="my-world-earth-copy">
          <p className="my-world-kicker">MY WORLD</p>
          <h1>{cn ? "我的地球" : "My World"}</h1>
          <p className="my-world-earth-lead">
            {cn ? "从香港出发，去过的地方都变成了照片与故事。" : "From Hong Kong, the places I’ve been become photos, coordinates, and stories."}
          </p>
          <Link href="/other-side" className="my-world-back">← {cn ? "返回另一面" : "Back to The Other Side"}</Link>
        </aside>

        <section className="my-world-earth-panel">
          <EarthModelViewer selected={selected} language={language} onSelect={(place) => setSelectedId(place.id)} />
          <div className="my-world-map-hint">
            <span>{cn ? "点击亮点，查看记忆" : "TAP A PLACE TO EXPLORE"}</span>
          </div>
        </section>

        <div className="my-world-place-count">PLACES · {travelWorldPlaces.length}</div>
      </motion.section>

      <TravelMemoryDrawer place={selected} photos={selectedPhotos} language={language} onClose={() => setSelectedId(null)} />
    </main>
  );
}
