"use client";

import { useEffect, useMemo, useState, type MouseEvent } from "react";
import type { ChildhoodStoryId } from "@/data/childhoodStories";

type ChildhoodReadingOverlayProps = {
  open: boolean;
  activeId: ChildhoodStoryId;
  onClose: () => void;
};

const STORY_PAGE_COUNT = 18;
const PAGE_TRANSITION_MS = 380;

const childhoodStoryPages = Array.from({ length: STORY_PAGE_COUNT }, (_, index) => {
  const number = String(index + 1).padStart(2, "0");
  return {
    id: number,
    src: `/room/childhood-story/${number}.png`,
  };
});

type PageDirection = -1 | 1;

export function ChildhoodReadingOverlay({ open, activeId, onClose }: ChildhoodReadingOverlayProps) {
  const initialIndex = useMemo(() => {
    const parsed = Number.parseInt(activeId, 10);
    if (Number.isNaN(parsed)) return 0;
    return Math.min(Math.max(parsed - 1, 0), STORY_PAGE_COUNT - 1);
  }, [activeId]);

  const [pageIndex, setPageIndex] = useState(initialIndex);
  const [previousPageIndex, setPreviousPageIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<PageDirection>(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPressingPage, setIsPressingPage] = useState(false);
  const page = childhoodStoryPages[pageIndex];
  const previousPage = previousPageIndex === null ? null : childhoodStoryPages[previousPageIndex];

  useEffect(() => {
    if (!open) return;
    setPageIndex(initialIndex);
    setPreviousPageIndex(null);
    setIsTransitioning(false);
    setIsPressingPage(false);
  }, [initialIndex, open]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open || previousPageIndex === null) return;
    const timer = window.setTimeout(() => setPreviousPageIndex(null), PAGE_TRANSITION_MS + 40);
    return () => window.clearTimeout(timer);
  }, [open, previousPageIndex]);

  useEffect(() => {
    if (!open) return;
    const nearbyIndexes = [
      (pageIndex - 1 + STORY_PAGE_COUNT) % STORY_PAGE_COUNT,
      (pageIndex + 1) % STORY_PAGE_COUNT,
    ];
    const preloaded = nearbyIndexes.map((index) => {
      const image = new Image();
      image.decoding = "async";
      image.src = childhoodStoryPages[index].src;
      return image;
    });
    return () => {
      preloaded.forEach((image) => {
        image.onload = null;
        image.onerror = null;
      });
    };
  }, [open, pageIndex, isTransitioning]);

  const move = (nextDirection: PageDirection) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setDirection(nextDirection);
    setPreviousPageIndex(pageIndex);
    setPageIndex((current) => (current + nextDirection + STORY_PAGE_COUNT) % STORY_PAGE_COUNT);
    window.setTimeout(() => setIsTransitioning(false), PAGE_TRANSITION_MS);
  };

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") move(1);
      if (event.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, pageIndex]);

  const handleImageClick = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    move(event.clientX < rect.left + rect.width / 2 ? -1 : 1);
  };

  return (
    <section
      className={`childhood-reader childhood-reader--story${open ? " is-open" : ""} is-${direction === 1 ? "next" : "prev"}`}
      aria-hidden={!open}
      aria-label="LEO'S CHILDHOOD"
    >
      <div className="childhood-reader__shade" onClick={onClose} aria-hidden="true" />
      <img className="childhood-reader__ambient" src={page.src} alt="" aria-hidden="true" />

      <div className="childhood-reader__stage" role="dialog" aria-modal="true" aria-labelledby="childhood-reader-title">
        <header className="childhood-reader__topbar">
          <div>
            <h2 id="childhood-reader-title">LEO&apos;S CHILDHOOD</h2>
            <p>从白马李家出发</p>
          </div>
          <div>
            <span className="childhood-reader__page-count" aria-live="polite">
              {previousPage && (
                <i key={`count-out-${previousPage.id}`} className="childhood-reader__page-count-out" aria-hidden="true">
                  {String(previousPageIndex! + 1).padStart(2, "0")} / {STORY_PAGE_COUNT}
                </i>
              )}
              <i key={`count-in-${page.id}`} className="childhood-reader__page-count-in">
                {String(pageIndex + 1).padStart(2, "0")} / {STORY_PAGE_COUNT}
              </i>
            </span>
            <button type="button" onClick={onClose} aria-label="关闭童年故事">×</button>
          </div>
        </header>

        <button type="button" className="childhood-reader__nav childhood-reader__nav--prev" onClick={() => move(-1)} aria-label="上一页">←</button>
        <button type="button" className="childhood-reader__nav childhood-reader__nav--next" onClick={() => move(1)} aria-label="下一页">→</button>

        <div
          className={`childhood-reader__page-wrap${isPressingPage ? " is-pressing" : ""}${previousPage ? " has-transition" : ""}`}
          onClick={handleImageClick}
          onPointerDown={() => setIsPressingPage(true)}
          onPointerUp={() => setIsPressingPage(false)}
          onPointerLeave={() => setIsPressingPage(false)}
        >
          {previousPage && (
            <div
              key={`previous-${previousPage.id}`}
              className="childhood-reader__story-page childhood-reader__story-page--out"
              aria-hidden="true"
            >
              <img className="childhood-reader__story-image" src={previousPage.src} alt="" />
              <span className="childhood-reader__paper-edge" aria-hidden="true" />
            </div>
          )}
          <div
            key={page.id}
            className="childhood-reader__story-page childhood-reader__story-page--in"
          >
            <img className="childhood-reader__story-image" src={page.src} alt={`Leo's Childhood ${page.id}`} />
            <span className="childhood-reader__paper-edge" aria-hidden="true" />
            <span className="childhood-reader__page-shadow" aria-hidden="true" />
          </div>

          <button
            type="button"
            className="childhood-reader__hover-zone childhood-reader__hover-zone--prev"
            onClick={(event) => {
              event.stopPropagation();
              move(-1);
            }}
            aria-label="上一页"
          >
            <span>← <b>PREV</b></span>
          </button>
          <button
            type="button"
            className="childhood-reader__hover-zone childhood-reader__hover-zone--next"
            onClick={(event) => {
              event.stopPropagation();
              move(1);
            }}
            aria-label="下一页"
          >
            <span><b>NEXT</b> →</span>
          </button>
        </div>

        <footer className="childhood-reader__segments" aria-label="童年故事阅读进度">
          {childhoodStoryPages.map((item, index) => (
            <button
              type="button"
              key={item.id}
              className={index === pageIndex ? "is-active" : index < pageIndex ? "is-read" : ""}
              onClick={() => {
                if (isTransitioning || index === pageIndex) return;
                setIsTransitioning(true);
                setDirection(index >= pageIndex ? 1 : -1);
                setPreviousPageIndex(pageIndex);
                setPageIndex(index);
                window.setTimeout(() => setIsTransitioning(false), PAGE_TRANSITION_MS);
              }}
              aria-label={`第 ${item.id} 页`}
            />
          ))}
        </footer>
      </div>
    </section>
  );
}
