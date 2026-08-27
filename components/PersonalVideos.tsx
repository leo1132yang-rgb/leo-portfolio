"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

type PersonalVideo = {
  index: string;
  video: string;
  cover: string;
  title: { cn: string; en: string };
  description: { cn: string; en: string };
};

const videos: PersonalVideo[] = [
  {
    index: "01",
    video: "/projects/videos/personal-videos/videos/01_personal_video.mp4",
    cover: "/projects/videos/personal-videos/covers/01_personal_video_cover.png",
    title: { cn: "个人视频 - 海边记录", en: "Personal Video - Seaside Record" },
    description: {
      cn: "记录海边氛围、人物状态与生活片段。",
      en: "Capturing seaside atmosphere, personal moments and everyday scenes.",
    },
  },
  {
    index: "02",
    video: "/projects/videos/personal-videos/videos/02_personal_video.mp4",
    cover: "/projects/videos/personal-videos/covers/02_personal_video_cover.png",
    title: { cn: "个人视频 - 城市片段", en: "Personal Video - City Moment" },
    description: {
      cn: "整理城市画面、节奏与日常观察。",
      en: "Recording city visuals, rhythm and daily observations.",
    },
  },
  {
    index: "03",
    video: "/projects/videos/personal-videos/videos/03_personal_video.mp4",
    cover: "/projects/videos/personal-videos/covers/03_personal_video_cover.png",
    title: { cn: "个人视频 - 香港印象", en: "Personal Video - Hong Kong Impression" },
    description: {
      cn: "捕捉香港城市气质、街景与视觉印象。",
      en: "Capturing the mood, street scenes and visual impression of Hong Kong.",
    },
  },
];

export function PersonalVideos() {
  const { language } = useLanguage();
  const [activeVideo, setActiveVideo] = useState<PersonalVideo | null>(null);
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
          <p className="text-[9px] uppercase tracking-[.18em] text-[#C9A86A]">Personal Videos</p>
          <h2 className="mt-3 text-2xl font-medium tracking-[-.035em] text-[#F7F7FF] md:text-3xl">
            {language === "cn" ? "个人视频" : "Personal Videos"}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#898AA1]">
            {language === "cn"
              ? "整理个人创作、日常记录、城市观察与轻量化视频内容。"
              : "A collection of personal creations, daily records, city observations and lightweight video works."}
          </p>
        </div>
        <span className="shrink-0 text-[9px] uppercase tracking-[.16em] text-[#C9A86A]">3 Videos</span>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {videos.map((item, index) => (
          <motion.button
            key={item.video}
            type="button"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 0.35, delay: index * 0.05 }}
            whileHover={{ y: -3 }}
            onClick={() => setActiveVideo(item)}
            className="group overflow-hidden rounded-2xl border border-white/10 bg-[#15182A]/90 text-left transition-colors duration-200 hover:border-[#C9A86A]/40 hover:bg-[#191D34]"
          >
            <div className="relative aspect-video overflow-hidden bg-[#0D1020]">
              <Image
                src={item.cover}
                alt={language === "cn" ? `${item.title.cn}封面` : `${item.title.en} cover`}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-[260ms] group-hover:scale-[1.02]"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080A14]/60 via-transparent to-transparent" />
              <span className="absolute bottom-4 left-4 rounded-full border border-white/15 bg-[#0B0D18]/75 px-3 py-1.5 text-[8px] uppercase tracking-[.12em] text-[#D8D8E5]">
                Personal Video
              </span>
              <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[#0B0D18]/80 text-xs text-[#F7F7FF] transition group-hover:border-[#C9A86A]/60 group-hover:text-[#C9A86A]">
                ▶
              </span>
            </div>
            <div className="p-5">
              <p className="text-[8px] uppercase tracking-[.14em] text-[#C9A86A]">Personal Video</p>
              <h3 className="mt-3 text-lg font-medium text-[#F7F7FF]">
                {item.title[language]}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[#898AA1]">
                {item.description[language]}
              </p>
              <span className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-[9px] uppercase tracking-[.12em] text-[#C9A86A]">
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
            aria-label={language === "cn" ? `播放${activeVideo.title.cn}` : `Play ${activeVideo.title.en}`}
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
                  <p className="text-[8px] uppercase tracking-[.16em] text-[#C9A86A]">Personal Video</p>
                  <h3 className="mt-1 text-lg font-medium text-[#F7F7FF]">
                    {activeVideo.title[language]}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-lg text-[#9FA0B8] transition hover:border-[#C9A86A]/50 hover:text-white"
                  aria-label={language === "cn" ? "关闭视频" : "Close video"}
                >
                  ×
                </button>
              </div>
              <video
                ref={videoRef}
                src={activeVideo.video}
                poster={activeVideo.cover}
                controls
                preload="none"
                className="max-h-[78vh] w-full bg-black"
              >
                {language === "cn" ? "您的浏览器不支持视频播放。" : "Your browser does not support video playback."}
              </video>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
