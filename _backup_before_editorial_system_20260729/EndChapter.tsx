"use client";

import { useLanguage } from "@/components/LanguageProvider";

export function EndChapter() {
  const { language } = useLanguage();
  return <section className="mx-auto max-w-3xl py-12 text-center md:py-20"><p className="font-mono text-[9px] tracking-[.16em] text-[#737D91]">06 / END</p><p className="mt-10 text-2xl leading-[1.5] tracking-[-.04em] text-[#F5F7FB] md:text-4xl">{language === "cn" ? <>我还在观察，<br />还在学习，<br />也还在路上。</> : <>Still observing.<br />Still learning.<br />Still moving.</>}</p><div className="mx-auto my-12 h-px w-12 bg-white/[.14]" /><p className="text-2xl font-medium leading-[1.55] tracking-[-.04em] text-[#F3F1EC] md:text-4xl">{language === "cn" ? <>看不见的根系，<br />决定了看得见的繁茂。</> : <>Invisible roots<br />shape visible growth.</>}</p></section>;
}
