"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { LanguageSwitch, useLanguage } from "@/components/LanguageProvider";

const links = [
  ["Intro", "关于我", "intro"],
  ["Projects", "项目作品", "projects"],
  ["AI Library", "AI 知识库", "ai-library"],
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 20);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-500 ${
        scrolled ? "border-white/10 bg-[#0D0F1A]/92 backdrop-blur-xl" : "border-transparent bg-[#0D0F1A]/72"
      }`}
    >
      <div className="mx-auto flex h-[76px] max-w-[1200px] items-center justify-between gap-5 px-5 md:px-10">
        <a href="#intro" className="shrink-0 text-sm font-medium tracking-[.06em]">李阳 Leo</a>
        <nav className="flex items-center gap-4 sm:gap-7 md:gap-10">
          {links.map(([en, cn, id]) => (
            <a key={id} href={`/#${id}`} className="group text-right">
              <span className="block text-[9px] tracking-[.08em] text-[#C9C9C2] transition group-hover:text-[#C9A86A] sm:text-[10px]">{language === "cn" ? cn : en}</span>
              <span className="mt-1 hidden text-[8px] text-white/30 md:block">{language === "cn" ? en : cn}</span>
            </a>
          ))}
        </nav>
        <LanguageSwitch />
      </div>
    </motion.header>
  );
}
