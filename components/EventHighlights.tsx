"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

type EventVideo = {
  index: string;
  video: string;
  cover: string;
  title: { cn: string; en: string };
  description: { cn: string; en: string };
};

const videos: EventVideo[] = [
  {
    index: "01",
    video: "/projects/videos/event-highlights/videos/01_event_highlight_annual_meeting.mp4",
    cover: "/projects/videos/event-highlights/covers/01_event_highlight_annual_meeting_cover.png",
    title: { cn: "活动花絮 - 晚宴现场", en: "Event Highlight - Annual Dinner" },
    description: { cn: "记录晚宴现场的氛围、人物合影与活动瞬间。", en: "Capturing the atmosphere, group photos and key moments from the annual dinner." },
  },
  {
    index: "02",
    video: "/projects/videos/event-highlights/videos/02_event_highlight_celebration.mp4",
    cover: "/projects/videos/event-highlights/covers/02_event_highlight_celebration_cover.png",
    title: { cn: "活动花絮 - 跨年回顾", en: "Event Highlight - Year-end Review" },
    description: { cn: "回顾跨年节点的团队记忆、现场画面与重要时刻。", en: "A recap of team memories, live scenes and important moments around the year-end celebration." },
  },
  {
    index: "03",
    video: "/projects/videos/event-highlights/videos/03_event_highlight_outdoor.mp4",
    cover: "/projects/videos/event-highlights/covers/03_event_highlight_outdoor_cover.png",
    title: { cn: "活动花絮 - 开张大吉", en: "Event Highlight - Grand Opening" },
    description: { cn: "记录开张现场的仪式感、布置细节与热闹氛围。", en: "Recording the ceremony, setup details and lively atmosphere of the grand opening." },
  },
  {
    index: "04",
    video: "/projects/videos/event-highlights/videos/04_event_highlight_group_activity.mp4",
    cover: "/projects/videos/event-highlights/covers/04_event_highlight_group_activity_cover.png",
    title: { cn: "活动花絮 - 马尔代夫之旅", en: "Event Highlight - Maldives Trip" },
    description: { cn: "捕捉马尔代夫之旅中的自然景色、团队画面与旅程片段。", en: "Capturing natural scenery, team moments and travel highlights from the Maldives trip." },
  },
  {
    index: "05",
    video: "/projects/videos/event-highlights/videos/05_event_highlight_building_scene.mp4",
    cover: "/projects/videos/event-highlights/covers/05_event_highlight_building_scene_cover.png",
    title: { cn: "活动花絮 - 策略性会议", en: "Event Highlight - Strategy Meeting" },
    description: { cn: "记录策略性会议中的现场交流、团队讨论与会议氛围。", en: "Documenting live communication, team discussion and the atmosphere of the strategy meeting." },
  },
  {
    index: "06",
    video: "/projects/videos/event-highlights/videos/06_event_highlight_ceremony.mp4",
    cover: "/projects/videos/event-highlights/covers/06_event_highlight_ceremony_cover.png",
    title: { cn: "活动花絮 - 开工仪式", en: "Event Highlight - Work Commencement Ceremony" },
    description: { cn: "呈现开工仪式的现场布置、流程节点与团队精神。", en: "Presenting the setup, ceremony flow and team spirit of the work commencement event." },
  },
  {
    index: "07",
    video: "/projects/videos/event-highlights/videos/07_event_highlight_moments.mp4",
    cover: "/projects/videos/event-highlights/covers/07_event_highlight_moments_cover.png",
    title: { cn: "活动花絮 - 丽思卡尔顿", en: "Event Highlight - The Ritz-Carlton" },
    description: { cn: "记录丽思卡尔顿活动现场的高端氛围与精彩瞬间。", en: "Capturing the refined atmosphere and key moments from the Ritz-Carlton event." },
  },
  {
    index: "08",
    video: "/projects/videos/event-highlights/videos/08_event_highlight_team_activity.mp4",
    cover: "/projects/videos/event-highlights/covers/08_event_highlight_team_activity_cover.png",
    title: { cn: "活动花絮 - 团建现场", en: "Event Highlight - Team Building" },
    description: { cn: "捕捉团建现场的互动、合影与团队凝聚力。", en: "Recording team interaction, group moments and the energy of the team-building event." },
  },
];

export function EventHighlights() {
  const { language } = useLanguage();
  const [activeVideo, setActiveVideo] = useState<EventVideo | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const closeModal = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.removeAttribute("src");
      videoRef.current.load();
    }
    setActiveVideo(null);
  };

  useEffect(() => {
    if (!activeVideo) return;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeVideo]);

  return (
    <section className="mt-20">
      <div className="flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[9px] uppercase tracking-[.18em] text-[#7C8CFF]">Event Highlights</p>
          <h2 className="mt-3 text-2xl font-medium tracking-[-.035em] text-[#F7F7FF] md:text-3xl">
            {language === "cn" ? "活动花絮视频" : "Event Highlights"}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#898AA1]">
            {language === "cn"
              ? "记录现场氛围、活动流程与人物瞬间，把一次活动从执行现场转化为可传播的品牌内容。"
              : "Capturing atmosphere, event flow and human moments, turning live execution into shareable brand content."}
          </p>
        </div>
        <span className="shrink-0 text-[9px] uppercase tracking-[.16em] text-[#AAB2FF]">8 Videos</span>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((item, index) => (
          <motion.button
            key={item.video}
            type="button"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.35, delay: index * 0.05 }}
            whileHover={{ y: -3 }}
            onClick={() => setActiveVideo(item)}
            className="group overflow-hidden rounded-2xl border border-white/10 bg-[#15182A]/90 text-left transition-colors duration-200 hover:border-[#7C8CFF]/40 hover:bg-[#191D34]"
          >
            <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-[#0D1020]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_20%,rgba(124,140,255,.18),transparent_34%),radial-gradient(circle_at_20%_80%,rgba(69,214,216,.1),transparent_40%)]" />
              <Image
                src={item.cover}
                alt={language === "cn" ? `活动花絮 ${item.index} 封面` : `Event Highlight ${item.index} cover`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-[260ms] group-hover:scale-[1.02]"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080A14]/55 via-transparent to-transparent" />
              <div className="absolute inset-5 rounded-xl border border-white/[.06]" />
              <span className="relative text-[11px] uppercase tracking-[.22em] text-white/35">Event Highlight {item.index}</span>
              <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[#0B0D18]/80 text-xs text-[#F7F7FF] transition group-hover:border-[#7C8CFF]/60 group-hover:text-[#AAB2FF]">
                ▶
              </span>
            </div>
            <div className="p-5">
              <p className="text-[8px] uppercase tracking-[.14em] text-[#7C8CFF]">Event Highlight</p>
              <h3 className="mt-3 text-lg font-medium text-[#F7F7FF]">
                {item.title[language]}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[#898AA1]">
                {item.description[language]}
              </p>
              <span className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-[9px] uppercase tracking-[.12em] text-[#AAB2FF]">
                {language === "cn" ? "播放视频" : "Play Video"}
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {activeVideo && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={language === "cn" ? `播放活动花絮 ${activeVideo.index}` : `Play Event Highlight ${activeVideo.index}`}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050509]/92 p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) closeModal();
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="w-full max-w-5xl overflow-hidden rounded-2xl border border-white/15 bg-[#0E1020]"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div>
                  <p className="text-[8px] uppercase tracking-[.16em] text-[#7C8CFF]">Event Highlight</p>
                  <h3 className="mt-1 text-lg font-medium text-[#F7F7FF]">
                    {activeVideo.title[language]}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-lg text-[#9FA0B8] transition hover:border-[#7C8CFF]/50 hover:text-white"
                  aria-label={language === "cn" ? "关闭视频" : "Close video"}
                >
                  ×
                </button>
              </div>
              <video ref={videoRef} src={activeVideo.video} poster={activeVideo.cover} controls preload="none" className="max-h-[78vh] w-full bg-black">
                {language === "cn" ? "您的浏览器不支持视频播放。" : "Your browser does not support video playback."}
              </video>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
