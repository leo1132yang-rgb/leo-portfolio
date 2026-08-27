"use client";
import { useLanguage } from "@/components/LanguageProvider";
import { FadeSlideUp } from "@/components/motion/FadeSlideUp";
export function EndChapter(){const {language}=useLanguage();const cn=language==="cn";return <section className="end-cinema"><FadeSlideUp><p className="eyebrow">06 / END</p><h1>{cn?<>仍在观察，<br/>还在学习，<br/>也仍在路上。</>:<>Still observing.<br/>Still learning.<br/>Still moving.</>}</h1></FadeSlideUp><FadeSlideUp delay={140}><div><p>{cn?<>看不见的根系，<br/>决定了看得见的繁茂。</>:<>Invisible roots<br/>shape visible growth.</>}</p><span>LEO 2026</span></div></FadeSlideUp></section>}
