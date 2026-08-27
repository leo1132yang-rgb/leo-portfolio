"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import type { Language } from "@/components/LanguageProvider";

function useBridgeReveal() {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.unobserve(entry.target);
      },
      { threshold: 0.18 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

export function JourneyMethodBridge({ language }: { language: Language }) {
  const { ref, visible } = useBridgeReveal();
  const left = language === "cn" ? ["观察", "叙事", "执行", "结构"] : ["Observe", "Narrative", "Execute", "Structure"];
  const right = language === "cn" ? ["专注", "边界", "完成"] : ["Focus", "Boundary", "Finish"];

  return (
    <section ref={ref} className={`chapter-bridge journey-method-bridge ${visible ? "is-visible" : ""}`} aria-label={language === "cn" ? "从经历到方法" : "From experience to method"}>
      <div className="bridge-side bridge-side--past">
        <p>WHAT I GAINED</p>
        <span>{language === "cn" ? "我获得了什么" : "What I gained"}</span>
        <div>{left.map((item) => <i key={item}>{item}</i>)}</div>
      </div>
      <div className="bridge-connector" aria-hidden="true"><span>EXPERIENCE</span><b /><em>METHOD</em></div>
      <div className="bridge-side bridge-side--next">
        <p>HOW I USE THEM</p>
        <span>{language === "cn" ? "我如何使用它们" : "How I use them"}</span>
        <div>{right.map((item) => <i key={item}>{item}</i>)}</div>
      </div>
      <p className="bridge-summary">
        {language === "cn" ? <>经历塑造能力，<br />方法让能力形成结果。</> : <>Experience shapes ability.<br />Method turns it into outcomes.</>}
      </p>
      <div className="bridge-chapter-marker">03 / METHOD</div>
    </section>
  );
}

export function SystemPersonalBridge({ language }: { language: Language }) {
  const { ref, visible } = useBridgeReveal();
  const signals = language === "cn"
    ? [{ en: "WATER", cn: "水下", tone: "water" }, { en: "FILM", cn: "胶片", tone: "film" }, { en: "CURIOSITY", cn: "好奇", tone: "curiosity" }]
    : [{ en: "WATER", cn: "Water", tone: "water" }, { en: "FILM", cn: "Film", tone: "film" }, { en: "CURIOSITY", cn: "Curiosity", tone: "curiosity" }];

  return (
    <section ref={ref} className={`chapter-bridge system-personal-bridge ${visible ? "is-visible" : ""}`} aria-label={language === "cn" ? "从系统到个人" : "From system to personal"}>
      <p className="system-bridge-meta">LEO OS <span /> SYSTEM VIEW</p>
      <div className="system-bridge-line" aria-hidden="true"><i /><i /><i /></div>
      <p className="system-bridge-title">BEYOND THE SYSTEM</p>
      <h3>{language === "cn" ? "系统之外" : "Beyond the system"}</h3>
      <div className="system-bridge-signals">
        {signals.map((signal) => <span className={`signal-${signal.tone}`} key={signal.en}><b>{signal.en}</b><i>{signal.cn}</i></span>)}
      </div>
      <p className="bridge-summary">
        {language === "cn" ? <>系统记录我如何工作，<br />口袋收藏构成我的东西。</> : <>The system records how I work.<br />The pocket holds what makes me who I am.</>}
      </p>
      <div className="bridge-chapter-marker">05 / PERSONAL <span>LEO POCKET</span></div>
    </section>
  );
}

export function PersonalEndBridge({ language, children }: { language: Language; children: ReactNode }) {
  const { ref, visible } = useBridgeReveal();

  return (
    <section ref={ref} className={`personal-end-bridge ${visible ? "is-visible" : ""}`} aria-label={language === "cn" ? "个人章节收尾" : "Personal chapter ending"}>
      <div className="personal-end-bridge__content">
        <p className="personal-end-archive">05 / PERSONAL <span /> {language === "cn" ? "个人章节暂时写到这里。" : "ARCHIVE CLOSED"}</p>
        <p className="personal-end-line">
          {language === "cn" ? <>我还在观察，<br />还在学习，<br />也还在路上。</> : <>Still observing.<br />Still learning.<br />Still moving.</>}
        </p>
        <i className="personal-end-dot" aria-hidden="true" />
        <p className="personal-end-marker">06 / END</p>
      </div>
      <div className="personal-end-bridge__final">{children}</div>
    </section>
  );
}
