"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { SystemPersonalBridge } from "@/components/ChapterBridges";

type Localized = { cn: string; en: string };

const currentStates = [
  { cn: "游泳", en: "SWIMMING", cnStatus: "正在学习", enStatus: "Learning", cnMeta: "状态 / 学习中", enMeta: "STATUS / LEARNING", color: "#8BC6B3" },
  { cn: "潜水证", en: "DIVING", cnStatus: "下一步", enStatus: "Next", cnMeta: "下一步 / 证书", enMeta: "NEXT / CERTIFICATE", color: "#6F86B8" },
  { cn: "哈苏胶片机", en: "HASSELBLAD", cnStatus: "愿望清单", enStatus: "Wishlist", cnMeta: "愿望 / 胶片机", enMeta: "WISHLIST / FILM CAMERA", color: "#D8A36A" },
];

const keywords = [
  { word: "OBSERVE", cnWord: "观察", cn: "摄影教会我先观察，再判断。", en: "Photography taught me to observe before judging." },
  { word: "CREATE", cnWord: "创意", cn: "创意不是结果，落地才是。", en: "Ideas are not the outcome. Execution is." },
  { word: "EXECUTE", cnWord: "执行", cn: "不拖泥带水，把事情干净地完成。", en: "Finish what matters cleanly." },
  { word: "SYSTEM", cnWord: "系统", cn: "好的系统，让经验能够被重复使用。", en: "Good systems make experience reusable." },
  { word: "LIVE", cnWord: "生活", cn: "工作结束之后，认真生活。", en: "When work ends, live properly." },
];

const randomLeoLines: Localized[] = [
  { cn: "路走错了，世界才会越来越大。", en: "Take the wrong road, and the world becomes bigger." },
  { cn: "摄影，是我最早理解世界的方式。", en: "Photography was the first way I learned to understand the world." },
  { cn: "喜欢把复杂的东西整理清楚。", en: "I enjoy turning complicated things into clear structures." },
  { cn: "效率不是做更多，而是干净地完成。", en: "Efficiency is not doing more. It is finishing cleanly." },
  { cn: "最近在学游泳。", en: "Recently, I have been learning to swim." },
  { cn: "下一步想考潜水证。", en: "Next, I want to get a diving certification." },
  { cn: "一直想买一台哈苏胶片机。", en: "I have been wanting a Hasselblad film camera." },
  { cn: "比起一次性的漂亮，我更在意它能不能长期运转。", en: "More than something beautiful once, I care about whether it can keep working over time." },
];

const reveal = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-70px" },
  transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

export function PersonalSide({ view = "all" }: { view?: "all" | "method" | "system" | "personal" }) {
  const { language } = useLanguage();
  const [selectedKeyword, setSelectedKeyword] = useState(0);
  const [randomLineIndex, setRandomLineIndex] = useState(0);
  const [osInfoOpen, setOsInfoOpen] = useState(false);
  const osInfoRef = useRef<HTMLDivElement>(null);
  const t = (value: Localized) => value[language];

  const randomizeLine = () => {
    setRandomLineIndex((current) => {
      if (randomLeoLines.length < 2) return current;
      let next = current;
      while (next === current) next = Math.floor(Math.random() * randomLeoLines.length);
      return next;
    });
  };

  useEffect(() => {
    if (!osInfoOpen) return;
    const onOutside = (event: MouseEvent) => {
      if (!osInfoRef.current?.contains(event.target as Node)) setOsInfoOpen(false);
    };
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOsInfoOpen(false);
    };
    document.addEventListener("mousedown", onOutside);
    window.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onOutside);
      window.removeEventListener("keydown", onEscape);
    };
  }, [osInfoOpen]);

  const currentList = language === "cn"
    ? ["最近在学游泳", "下一步想考潜水证", "想买一台哈苏胶片机", "正在继续打磨个人网站", "正在整理自己的项目系统"]
    : ["Learning to swim", "Planning a diving certificate", "A Hasselblad film camera", "Refining this personal website", "Organizing my project system"];
  const offDutyList = language === "cn"
    ? ["游泳", "散步", "摄影", "看展", "胶片相机", "旅行", "观察城市", "去海边", "收集视觉细节"]
    : ["SWIM", "WALK", "PHOTOGRAPHY", "EXHIBITIONS", "FILM CAMERA", "TRAVEL", "CITY OBSERVATION", "GO TO THE SEA", "COLLECT DETAILS"];
  const pocketList = language === "cn"
    ? ["哈苏胶片机", "潜水证", "更完整的摄影项目集", "个人文章整理", "更完整的 AI 工作流系统", "去更多水下与陌生的地方", "拍一组长期胶片项目"]
    : ["Hasselblad film camera", "Diving certificate", "A fuller photography portfolio", "Personal writing archive", "A fuller AI workflow system", "More underwater and unfamiliar places", "A long-term film project"];

  return (
    <section id="method" className={`personal-side personal-side--${view} mt-0 scroll-mt-28 pt-2`}>
      <motion.section {...reveal} className="method-section light-editorial grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-end lg:gap-16">
        <div aria-hidden="true" className="overflow-hidden">
          <span className="editorial-ghost block text-[clamp(4.5rem,9vw,8.7rem)] font-medium leading-[.76] tracking-[-.085em] text-[#F5F1E8]/[.065]">ABSOLUTE<br />EFFICIENCY</span>
          <p className="field-note-marker mt-8 font-mono text-[9px] tracking-[.18em] text-[#7F7A72]">03 / METHOD</p>
          <div className="mt-5 flex h-px items-center gap-1 overflow-hidden bg-white/[.08]">
            {Array.from({ length: 28 }).map((_, index) => <i key={index} className="w-px bg-[#F5F1E8]" style={{ height: index % 7 === 0 ? "8px" : "4px", opacity: index % 7 === 0 ? .25 : .1 }} />)}
          </div>
        </div>
        <div className="max-w-[620px]">
          <h2 className="whitespace-pre-line text-3xl font-medium leading-[1.38] tracking-[-.045em] text-[#F5F1E8] md:text-[38px]">
            {language === "cn" ? "在属于工作的时间里，\n追求绝对效率。" : "In the time I give to work,\nI pursue absolute efficiency."}
          </h2>
          <div className="mt-7 max-w-[570px] space-y-4 text-sm leading-8 text-[#B7B2A8]">
            <p>{language === "cn" ? "不拖泥带水，不把工作带进生活，也不让生活干扰工作。" : "No unnecessary dragging things out. I don't let work consume life, and I don't let life interfere with work."}</p>
            <p>{language === "cn" ? "对我来说，效率的意义不是做更多，而是把该做的事情干净地完成，然后认真生活。" : "To me, efficiency isn't about doing more. It's about finishing what matters cleanly, and then living properly."}</p>
          </div>
          <div className="mt-8 flex gap-6 font-mono text-[9px] tracking-[.14em] text-[#B7B2A8]">
            {(language === "cn" ? ["专注", "边界", "完成"] : ["FOCUS", "BOUNDARY", "FINISH"]).map((item) => <span key={item}>{item}</span>)}
          </div>
        </div>
      </motion.section>

      <div className="method-system-transition editorial-transition mt-24 flex items-center gap-4 md:mt-28">
        <span>METHOD</span>
        <i />
        <p>{language === "cn" ? "方法最终沉淀为系统。" : "SYSTEM"}</p>
      </div>

      <motion.section id="system" {...reveal} className="system-section mt-12 scroll-mt-28 md:mt-14">
        <span className="field-note-marker mb-5 inline-flex">04 / SYSTEM</span>
        <div ref={osInfoRef} className="relative">
          <div className="leo-os liquid-panel rounded-[32px] p-6 md:p-9">
            <div className="relative z-10 flex items-center justify-between border-b border-white/[.09] pb-5">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-[9px] tracking-[.16em] text-[#B7B2A8]">LEO OS / v1.0</span>
                <button type="button" onClick={() => setOsInfoOpen((current) => !current)} aria-label={language === "cn" ? "关于 Leo OS" : "About Leo OS"} aria-expanded={osInfoOpen} className="flex h-4 w-4 items-center justify-center rounded-full border border-white/[.13] font-mono text-[8px] text-[#7F7A72] transition-[border-color,color,background-color] duration-200 hover:border-[#8FD3FF]/45 hover:bg-[#8FD3FF]/[.06] hover:text-[#D3EDFF]">?</button>
              </div>
              <span className="flex items-center gap-2 font-mono text-[8px] tracking-[.13em] text-[#8BC6B3]"><i className="personal-status-dot h-1.5 w-1.5 rounded-full bg-[#8BC6B3]" />ONLINE</span>
            </div>

            <div className="relative z-10 grid border-b border-white/[.09] sm:grid-cols-2">
              <div className="py-7 sm:border-r sm:border-white/[.09] sm:pr-8"><p className="font-mono text-[8px] tracking-[.15em] text-[#7F7A72]">MODE</p><p className="mt-3 text-lg text-[#F5F1E8]">{language === "cn" ? "正在构建" : "Building"}</p></div>
              <div className="py-7 sm:pl-8"><p className="font-mono text-[8px] tracking-[.15em] text-[#7F7A72]">FOCUS</p><p className="mt-3 text-lg text-[#F5F1E8]">{language === "cn" ? "品牌 × AI × 系统" : "Brand × AI × Systems"}</p></div>
            </div>

            <div className="relative z-10 border-b border-white/[.09] py-7">
              <p className="font-mono text-[8px] tracking-[.15em] text-[#7F7A72]">CURRENTLY</p>
              <div className="mt-5 grid gap-5 sm:grid-cols-3 sm:divide-x sm:divide-white/[.09]">
                {currentStates.map((item, index) => <div key={item.en} className={index === 0 ? "sm:pr-5" : index === 2 ? "sm:pl-5" : "sm:px-5"}><div className="flex items-center gap-2"><i className="personal-status-dot h-1.5 w-1.5 rounded-full" style={{ backgroundColor: item.color }} /><span className="font-mono text-[9px] tracking-[.13em] text-[#B7B2A8]">{language === "cn" ? item.cn : item.en}</span></div><p className="mt-3 text-sm text-[#F5F1E8]">{language === "cn" ? item.cnStatus : item.enStatus}</p><p className="mt-2 font-mono text-[7px] tracking-[.12em] text-[#7F7A72]">{language === "cn" ? item.cnMeta : item.enMeta}</p></div>)}
              </div>
            </div>

            <div className="relative z-10 py-7">
              <div className="flex flex-wrap gap-1.5">{keywords.map((item, index) => { const active = selectedKeyword === index; return <button key={item.word} type="button" onClick={() => setSelectedKeyword(index)} onMouseEnter={() => setSelectedKeyword(index)} className={`rounded-full px-3 py-2 font-mono text-[9px] tracking-[.12em] transition-[color,background-color,border-color] duration-200 ${active ? "border border-[#8FD3FF]/25 bg-[#8FD3FF]/[.08] text-[#D9F0FF]" : "border border-transparent text-[#7F7A72] hover:text-[#D7D3CC]"}`}>{language === "cn" ? item.cnWord : item.word}</button>; })}</div>
              <p key={`${language}-${selectedKeyword}`} className="keyword-copy mt-5 text-sm leading-7 text-[#B7B2A8]">{language === "cn" ? keywords[selectedKeyword].cn : keywords[selectedKeyword].en}</p>
            </div>

            <div className="relative z-10 grid gap-5 border-t border-white/[.09] pt-6 md:grid-cols-[1fr_auto] md:items-end">
              <div><p className="font-mono text-[8px] tracking-[.15em] text-[#D8A36A]">RANDOM LEO</p><p key={`${language}-${randomLineIndex}`} className="random-leo-line mt-3 max-w-xl text-lg leading-7 tracking-[-.025em] text-[#F5F1E8]">{t(randomLeoLines[randomLineIndex])}</p></div>
              <button type="button" onClick={randomizeLine} className="motion-button justify-self-start rounded-full border border-white/[.12] px-4 py-2.5 text-[9px] tracking-[.05em] text-[#B7B2A8] hover:border-[#D8A36A]/45 hover:bg-[#D8A36A]/[.045] hover:text-[#E7C8A6] md:justify-self-end">↻ {language === "cn" ? "换一句" : "Another one"}</button>
            </div>
          </div>
          {osInfoOpen && <div className="liquid-panel absolute right-4 top-14 z-30 w-[260px] rounded-[18px] px-4 py-4"><p className="relative z-10 whitespace-pre-line text-[11px] leading-6 text-[#B7B2A8]">{language === "cn" ? "由好奇心、咖啡，\n以及开得有点多的浏览器标签页驱动。" : "Built with curiosity, caffeine,\nand probably too many browser tabs."}</p><p className="relative z-10 mt-3 font-mono text-[8px] tracking-[.12em] text-[#7F7A72]">— Leo OS</p></div>}
        </div>
      </motion.section>

      <div className="system-personal-transition"><SystemPersonalBridge language={language} /></div>

      <motion.section id="personal" {...reveal} className="personal-section pocket-light relative mt-16 scroll-mt-28 md:mt-20">
        <span aria-hidden="true" className="pocket-tape absolute -top-3 left-8 hidden text-[7px] uppercase tracking-[.14em] text-[#B7B2A8] sm:block">Personal Stuff</span>
        <span aria-hidden="true" className="passport-stamp absolute -right-2 top-8 hidden md:flex"><span>LEO</span><span>KEEP EXPLORING</span><span>OBSERVE / CREATE</span></span>
        <div><p className="field-note-marker font-mono text-[8px] tracking-[.16em] text-[#D8A36A]">05 / PERSONAL</p><h2 className="mt-3 text-2xl font-medium tracking-[-.04em] text-[#F5F1E8] md:text-3xl">{language === "cn" ? "Leo 的口袋" : "Leo Pocket"}</h2><p className="mt-2 text-[11px] text-[#7F7A72]">{language === "cn" ? "一些工作之外、却同样重要的东西。" : "Things outside work that matter just as much."}</p></div>

        <div className="mt-9 grid gap-4 lg:grid-cols-[1.08fr_.92fr]">
          <article className="pocket-paper liquid-panel rounded-[24px] p-6 md:p-7"><div className="relative z-10 flex items-start justify-between gap-5"><div><p className="font-mono text-[8px] tracking-[.15em] text-[#D8A36A]">POCKET PROFILE</p><h3 className="mt-4 text-2xl font-medium tracking-[-.04em] text-[#F5F1E8]">李阳 Leo</h3><p className="mt-3 text-sm leading-7 text-[#B7B2A8]">Brand Operator / Creative Designer / Photographer</p></div><span className="rounded-full border border-[#D8A36A]/25 px-3 py-2 font-mono text-[8px] tracking-[.12em] text-[#D8A36A]">LEO / 2026</span></div><div className="relative z-10 mt-8 flex flex-wrap gap-2 text-[10px] text-[#B7B2A8]"><span className="rounded-full border border-white/[.09] px-3 py-2">{language === "cn" ? "工作与生活在不同城市和场景之间流动。" : "Work and life move between different cities and scenes."}</span></div><p className="relative z-10 mt-10 max-w-md text-lg leading-8 tracking-[-.02em] text-[#F5F1E8]">“{language === "cn" ? "我喜欢把零散的经验，整理成可持续使用的方法。" : "I like turning scattered experience into methods that can keep being used."}”</p></article>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1"><article className="rounded-[22px] border border-white/[.09] bg-white/[.035] p-5"><p className="font-mono text-[8px] tracking-[.15em] text-[#8BC6B3]">CURRENTLY</p><ul className="mt-4 space-y-2.5 text-[12px] leading-5 text-[#B7B2A8]">{currentList.map((item) => <li key={item} className="flex gap-2"><span className="text-[#D8A36A]">•</span>{item}</li>)}</ul></article><article className="rounded-[22px] border border-white/[.09] bg-white/[.025] p-5"><p className="font-mono text-[8px] tracking-[.15em] text-[#7F7A72]">OFF DUTY</p><div className="mt-4 flex flex-wrap gap-2">{offDutyList.map((item) => <span key={item} className="rounded-full border border-white/[.09] px-2.5 py-1.5 text-[9px] tracking-[.04em] text-[#B7B2A8]">{item}</span>)}</div></article></div>
          <article className="rounded-[22px] border border-[#D8A36A]/15 bg-[#D8A36A]/[.035] p-6 lg:col-span-2"><div className="flex flex-wrap items-baseline justify-between gap-4"><p className="font-mono text-[8px] tracking-[.15em] text-[#D8A36A]">LEO'S POCKET LIST</p><span className="font-mono text-[8px] tracking-[.12em] text-[#7F7A72]">IN PROGRESS</span></div><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{pocketList.map((item, index) => <div key={item} className="border-l border-[#D8A36A]/25 pl-3 text-[11px] leading-5 text-[#B7B2A8]"><span className="mr-2 font-mono text-[8px] text-[#D8A36A]">0{index + 1}</span>{item}</div>)}</div></article>
        </div>
      </motion.section>

    </section>
  );
}
