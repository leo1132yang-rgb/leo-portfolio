"use client";

import Link from "next/link";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { SiteNavbar } from "@/components/layout/SiteNavbar";
import { useLanguage, type Language } from "@/components/LanguageProvider";
import { careerStages, type Stage } from "@/data/careerStages";
import styles from "./ProfileFilmstrip.module.css";

const sceneNames = ["THE FIRST FRAME", "LEARNING TO SEE", "IMAGE INTO WORDS", "CREATOR → OPERATOR", "PAUSE. REFRAME.", "ABILITIES CONVERGE", "SYSTEM → NOW"];
// Existing personal photographs, not historical evidence of a school or employer.
const fragments = [
  { src: "/room/photo-wall/web/01.webp", note: "QINGHAI / 2021.10", alt: "青海湖 / Qinghai Lake" },
  { src: "/room/photo-wall/web/4f828f37bd4bd8ae1ecb7bc14b2fcc4e.webp", note: "CHAERHAN / 2021.10", alt: "察尔汗盐湖 / Chaerhan Salt Lake" },
  { src: "/room/photo-wall/web/02fe25b5032e68a58f46ae79a634a387.webp", note: "ZHUHAI / 2024.02", alt: "珠海 / Zhuhai" },
];
const convergence = ["PHOTOGRAPHY", "WRITING", "BRAND", "VISUAL", "CONTENT", "SYSTEM", "AI"];

function Photograph({ which }: { which: number }) {
  const photo = fragments[which];
  return <figure className={styles.fragment}><img src={photo.src} alt={photo.alt} width={800} height={600} loading="lazy" decoding="async" /><figcaption>{photo.note}</figcaption></figure>;
}

function SceneArt({ index, language }: { index: number; language: Language }) {
  const cn = language === "cn";
  if (index === 0) return <div className={styles.firstFrame} aria-hidden="true"><span className={styles.hugeYear}>2015</span><div className={styles.viewfinder}><i /><i /><i /><i /><span>LIGHT / FRAME / OBSERVE</span><b>+</b></div><span className={styles.filmNote}>01 / THE BEGINNING</span><em>{cn ? "先学会看，再决定表达。" : "First, learn to see."}</em></div>;
  if (index === 1) return <div className={styles.contactSheet}><div className={styles.artHeadline} aria-hidden="true">IMAGE<span>FRAME / LIGHT</span></div><Photograph which={0} /><Photograph which={1} /><p className={styles.photoNote}>{cn ? "个人摄影片段 · 非学校档案" : "PERSONAL PHOTOGRAPHS · NOT SCHOOL RECORDS"}</p></div>;
  if (index === 2) return <div className={styles.manuscript}><span>03 / A CHANGE OF MEDIUM</span><p className={styles.struck}>IMAGE</p><strong>WORDS.</strong><div className={styles.script}><small>{cn ? "学习方向 / 非真实手稿" : "STUDY NOTES / NOT AN ORIGINAL MANUSCRIPT"}</small><h3>STORY</h3><p>CHARACTER <i>→</i> SCRIPT</p><hr /><p>{cn ? "舞台剧 / 动画 / 人物传记" : "STAGE / ANIMATION / BIOGRAPHY"}</p><span>{cn ? "画面之外，还有人物与故事。" : "Beyond the frame: character and story."}</span></div><b className={styles.pageNumber}>— 03 —</b></div>;
  if (index === 3) return <div className={styles.brand}><small>04 / THE BRIEF</small><strong>CREATOR</strong><i>↘</i><strong>OPERATOR</strong><div><span>BRAND</span><span>CONTENT</span><span>COMMUNICATION</span><span>DELIVERY</span></div><p>{cn ? "表达，开始回应真实的品牌目标。" : "Expression meets a real brand objective."}</p></div>;
  if (index === 4) return <div className={styles.reframe}><span className={styles.artHeadline}>RE:<br />FRAME</span><Photograph which={2} /><p>{cn ? "整理 / 创作 / 学习 / 重新确认方向" : "ARCHIVE / CREATE / LEARN / REFRAME"}</p></div>;
  if (index === 5) return <div className={styles.converging}><small>06 / NO LONGER ONE DISCIPLINE</small>{["PHOTO", "VIDEO", "DESIGN", "CONTENT"].map((word, i) => <span key={word} style={{ "--word": i } as CSSProperties}>{word}<i>0{i + 1}</i></span>)}<p>{cn ? "视觉、内容与执行，开始同时发生。" : "Visuals, content and delivery, together."}</p></div>;
  return <div className={styles.now}><small>07 / WHO I AM NOW</small><div className={styles.wordCloud}>{convergence.map((word, i) => <span key={word} style={{ "--word": i } as CSSProperties}>{word}</span>)}</div><strong>LEO<span>/ 李阳</span></strong><p>{cn ? "有落地经验的品牌运营。" : "Brand operations, grounded in delivery."}</p><div className={styles.system}><span>WECOM</span><i /><span>LEARNING</span><i /><span>AI / WORKFLOW</span></div></div>;
}

function FilmScene({ stage, index, progress, language, onFocus }: { stage: Stage; index: number; progress: MotionValue<number>; language: Language; onFocus: () => void }) {
  const phase = useTransform(progress, value => Math.max(-1, Math.min(1, value * 6 - index)));
  const label = (value: { cn: string; en: string }) => value[language];
  return <motion.article id={`career-${stage.id}`} className={`${styles.scene} ${styles[`scene${stage.id}`] ?? ""}`} style={{ "--phase": phase } as CSSProperties & { "--phase": MotionValue<number> }} aria-labelledby={`stage-title-${stage.id}`} onFocusCapture={event => { if (event.target.matches(":focus-visible")) onFocus(); }}>
    <div className={styles.sceneTop}><span>{stage.id} <i>/</i> 07</span><span>{sceneNames[index]}</span><time>{label(stage.date)}</time></div>
    <div className={styles.art}><SceneArt index={index} language={language} /></div>
    <div className={styles.annotation}>
      <span className={styles.annotationLabel}>{index === 6 ? "CURRENT CHAPTER" : "FIELD NOTES"} / {stage.id}</span>
      <h2 id={`stage-title-${stage.id}`}>{label(stage.title)}</h2>
      <p className={styles.summary}>{label(stage.summary)}</p>
      <div className={styles.keywords}>{stage.keywords.slice(0, 4).map(word => <span key={word.cn}>{label(word)}</span>)}</div>
      <details className={styles.notes}><summary>{language === "cn" ? "展开完整阶段记录" : "Read the full chapter"}<span>＋</span></summary><div className={styles.noteBody}>{stage.intro.map(p => <p key={p.cn}>{label(p)}</p>)}{stage.groups.map(group => <section key={group.title.cn}><h3>{label(group.title)}</h3><ul>{group.items.map(item => <li key={item.cn}>{label(item)}</li>)}</ul></section>)}</div></details>
      {index === 6 && <div className={styles.currentFacts}><p>{language === "cn" ? "约 500 人企业微信后台架构" : "WeCom architecture for around 500 people"}</p><p>{language === "cn" ? "500+ 前线同事线上学习体系" : "Online learning for 500+ frontline colleagues"}</p><p>{language === "cn" ? "AI 知识库 / 工作流 / 活动 / 视觉 / 内容" : "AI knowledge / workflows / events / visuals / content"}</p></div>}
    </div>
    <svg className={styles.trace} viewBox="0 0 1200 110" preserveAspectRatio="none" aria-hidden="true"><path d="M0 65 C160 65 140 12 300 30 S490 100 640 70 S850 4 1020 48 S1150 65 1200 65" pathLength="1" /></svg>
    <span className={styles.coordinate} aria-hidden="true">+ {stage.id}</span>
  </motion.article>;
}

export function CareerProfile() {
  const { language } = useLanguage();
  const cn = language === "cn";
  const reduced = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [horizontal, setHorizontal] = useState(false);
  const [distance, setDistance] = useState(0);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, p => horizontal ? -p * distance : 0);
  useMotionValueEvent(scrollYProgress, "change", p => setActive(previous => { const next = Math.min(6, Math.round(p * 6)); return next === previous ? previous : next; }));

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px) and (min-height: 650px)");
    const measure = () => {
      const enabled = media.matches && !reduced;
      setHorizontal(enabled);
      if (track.current) setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (track.current) observer.observe(track.current);
    media.addEventListener("change", measure);
    window.addEventListener("resize", measure);
    return () => { observer.disconnect(); media.removeEventListener("change", measure); window.removeEventListener("resize", measure); };
  }, [reduced]);

  const goTo = (index: number) => {
    if (horizontal && section.current) {
      const top = section.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top + (section.current.offsetHeight - window.innerHeight) * index / 6, behavior: "instant" });
    } else document.getElementById(`career-${careerStages[index].id}`)?.scrollIntoView({ behavior: "instant", block: "start" });
  };

  return <>
    <SiteNavbar />
    <div className={styles.page}>
    <main>
      <header className={styles.hero}>
        <div className={styles.heroMeta}><span>PROFILE / 个人履历</span><span>CAREER FILMSTRIP · 01—07</span></div>
        <h1>I DIDN’T PLAN<br /><span>A STRAIGHT</span><br /><em>LINE.</em></h1>
        <div className={styles.heroBottom}><p>{cn ? <>我从来没有沿着<br />一条直线成长。</> : <>A path through images, words,<br />brands and systems.</>}</p><a href="#career-filmstrip">SCROLL TO TRACE MY PATH <span>↓</span><small>{cn ? "滚动，看看我是怎么走到这里的" : "Seven chapters. One evolving practice."}</small></a></div>
        <svg className={styles.heroTrace} viewBox="0 0 600 500" aria-hidden="true"><path d="M560 0 C180 100 520 220 210 270 S30 420 350 500" /></svg>
      </header>
      <section ref={section} id="career-filmstrip" className={`${styles.filmstrip} ${horizontal ? styles.horizontal : ""}`} aria-label={cn ? "人生胶片，七个真实阶段" : "Career filmstrip, seven real chapters"}>
        <div className={styles.viewport}>
          <motion.div ref={track} className={styles.track} style={{ x }}>{careerStages.map((stage, index) => <FilmScene key={stage.id} stage={stage} index={index} progress={scrollYProgress} language={language} onFocus={() => { if (horizontal && active !== index) goTo(index); }} />)}</motion.div>
          <nav className={styles.progress} aria-label={cn ? "章节索引" : "Chapter index"}><span>{String(active + 1).padStart(2, "0")} / 07</span><div>{careerStages.map((stage, index) => <button key={stage.id} type="button" onClick={() => goTo(index)} aria-label={`${stage.id} ${stage.title[language]}`} aria-current={active === index ? "step" : undefined}><i /></button>)}</div><span>TRACE / {sceneNames[active]}</span></nav>
        </div>
      </section>
      <footer className={styles.ending}><p>NOT A STRAIGHT LINE. A PRACTICE.</p><h2>THE PATH<br />WASN’T STRAIGHT.<br /><em>THAT’S THE POINT.</em></h2><p className={styles.endingCopy}>{cn ? <>路没有一直向前，<br />但它们最后汇到了一起。</> : <>Different directions.<br />Everything comes together.</>}</p><div className={styles.ctas}><Link href="/projects">{cn ? "查看项目作品" : "Explore projects"}<span>↗</span></Link><Link href="/other-side">{cn ? "进入 Leo’s Room" : "Enter Leo’s Room"}<span>↗</span></Link><a href="mailto:leoyang1132@outlook.com">{cn ? "联系我" : "Contact me"}<span>↗</span></a></div><small>LEO / 李阳 <span>THE STORY CONTINUES.</span></small></footer>
    </main>
    </div>
  </>;
}
