"use client";

import Link from "next/link";
import { useRef } from "react";
import { useScroll, useReducedMotion } from "framer-motion";
import { SiteNavbar } from "@/components/layout/SiteNavbar";
import { useLanguage } from "@/components/LanguageProvider";
import { careerStages } from "@/data/careerStages";
import { EvolvingVisual } from "./EvolvingVisual";
import styles from "./EvolvingProfile.module.css";

const concepts = ["OBSERVE", "COMPOSE", "NARRATE", "IDENTIFY", "ASSEMBLE", "CONNECT", "ORCHESTRATE"];

export function EvolvingProfile() {
  const { language } = useLanguage();
  const cn = language === "cn";
  const journey = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: journey, offset: ["start start", "end end"] });
  const reduced = useReducedMotion();

  return <div className={styles.page}>
    <SiteNavbar />
    <main>
      <div className={styles.journey} ref={journey}>
        <div className={styles.visual} aria-hidden="true">
          <header className={styles.identity}><span>LEO / EVOLVING SYSTEM</span><span>PROFILE · 2015—NOW</span></header>
          <EvolvingVisual progress={scrollYProgress} reduced={!!reduced} />
          <div className={styles.visualFoot}><span>OBSERVATION → ORGANISATION</span><span>{cn ? "滚动，让经验形成结构 ↓" : "SCROLL TO SEE THE STRUCTURE ↓"}</span></div>
        </div>
        <div className={styles.records}>
          {careerStages.map((stage, index) => <section key={stage.id} className={styles.record} aria-labelledby={`evolving-${stage.id}`}>
            <div className={styles.note}>
              <p className={styles.index}>{stage.id}<span> / {concepts[index]}</span></p>
              <time>{stage.date[language]}</time>
              <h2 id={`evolving-${stage.id}`}>{stage.title[language]}</h2>
              <p className={styles.summary}>{stage.summary[language]}</p>
              {index === 0 && <h1 className={styles.intro}>{cn ? "从看见，到连接。" : "From seeing to connecting."}</h1>}
              {index === 6 && <div className={styles.facts}>
                <p>{cn ? "约 500 人企业微信后台架构 · 500+ 前线线上学习" : "WeCom architecture for around 500 people · learning for 500+ frontline colleagues"}</p>
                <p>{cn ? "AI 知识库 / 工作流 · 活动 / 视觉 / 内容 · 平台运营 / IT 支持" : "AI knowledge & workflows · events, visuals & content · platform operations & IT support"}</p>
              </div>}
              <details className={styles.details}><summary>{cn ? "真实阶段记录" : "Full chapter record"}<span>＋</span></summary>
                {stage.intro.map(item => <p key={item.cn}>{item[language]}</p>)}
                {stage.groups.map(group => <div key={group.title.cn}><h3>{group.title[language]}</h3><ul>{group.items.map(item => <li key={item.cn}>{item[language]}</li>)}</ul></div>)}
              </details>
            </div>
          </section>)}
          <footer className={styles.ending}>
            <p className={styles.index}>CONTINUOUS / NOT COMPLETE</p>
            <h2>Leo <span>/ 李阳</span></h2>
            <p className={styles.summary}>{cn ? "品牌运营 · 视觉表达 · 系统搭建 · AI 工作流" : "Brand operations · Visual expression · Systems · AI workflows"}</p>
            <div className={styles.ctas}>
              <Link href="/projects">{cn ? "查看项目作品" : "Explore projects"}<span>↗</span></Link>
              <Link href="/other-side">{cn ? "进入 Leo’s Room" : "Enter Leo’s Room"}<span>↗</span></Link>
              <a href="mailto:leoyang1132@outlook.com">{cn ? "联系我" : "Contact me"}<span>↗</span></a>
            </div>
          </footer>
        </div>
      </div>
    </main>
  </div>;
}
