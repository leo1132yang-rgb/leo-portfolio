"use client";

import { motion } from "framer-motion";
import { Reveal } from "./Reveal";

const wechatImages = [
  ["/cases/wechat-system/01_selected-images/02_ai-knowledge-base.png", "AI 知识库"],
  ["/cases/wechat-system/01_selected-images/03_online-classroom.png", "线上课堂"],
  ["/cases/wechat-system/01_selected-images/04_honor-board.png", "同事荣誉"],
  ["/cases/wechat-system/01_selected-images/05_onboarding-section.png", "新人入职"],
  ["/cases/wechat-system/01_selected-images/06_file-hub.png", "文件直达"],
];

function Intro({ number, type, title, summary, tags }: { number: string; type: string; title: string; summary: string; tags: string[] }) {
  return (
    <Reveal className="grid gap-9 lg:grid-cols-[.45fr_1.55fr]">
      <div>
        <span className="text-[10px] text-[#C9A86A]">CASE {number}</span>
        <p className="mt-3 text-[9px] tracking-[.12em] text-white/30">{type}</p>
      </div>
      <div>
        <h1 className="text-[clamp(3rem,6vw,6.5rem)] font-medium leading-[.95] tracking-[-.065em]">{title}</h1>
        <p className="mt-7 max-w-3xl text-sm leading-8 text-[#9A9A92] md:text-base">{summary}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {tags.map((tag) => <span key={tag} className="rounded-full border border-white/10 px-3 py-1.5 text-[8px] text-white/45">{tag}</span>)}
        </div>
      </div>
    </Reveal>
  );
}

function Detail({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="border-t border-white/10 pt-5"><span className="text-[9px] text-[#C9A86A]">{title}</span><p className="mt-4 text-sm leading-7 text-[#8F8F88]">{children}</p></div>;
}

export function WechatCase() {
  return (
    <article>
      <Intro number="01" type="系统建设 / 企业微信 / 内部运营" title="企业微信后台搭建" summary="从 0 到 1 搭建面向团队协作的企业微信后台，将日常管理、知识内容、线上课堂、荣誉展示、新人入职和文件管理整合为一个可持续使用的内部运营系统。" tags={["500+ 人架构", "企业微信后台", "AI 知识库", "线上课堂", "IT 支持"]} />
      <Reveal className="mt-14 overflow-hidden rounded-[20px] border border-white/10 bg-[#141414] p-3 md:p-5">
        <div className="mb-4 flex justify-between border-b border-white/10 pb-4 text-[8px] uppercase tracking-[.15em] text-white/30"><span>Terminal Office System</span><span className="text-[#C9A86A]">System View</span></div>
        <img src="/cases/wechat-system/01_selected-images/01_terminal-office-system.png" alt="企业微信终端办公系统界面" className="w-full rounded-xl bg-[#0F0F0F]" />
      </Reveal>
      <Reveal className="mt-12 grid gap-8 lg:grid-cols-3">
        <Detail title="项目背景">团队需要一个更清晰、更高效、更可维护的内部协作入口，将分散的信息、文件、课程、知识内容和员工服务整合到统一入口。</Detail>
        <Detail title="我的角色">后台架构搭建、内容整理、模块规划、日常管理、IT 支持与系统维护。</Detail>
        <Detail title="解决方案">围绕知识库、线上课堂、同事荣誉、新人入职和文件直达等模块进行结构化设计。</Detail>
      </Reveal>
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ show: { transition: { staggerChildren: 0.07 } } }} className="mt-12 grid gap-4 md:grid-cols-2">
        {wechatImages.map(([src, label], index) => (
          <motion.figure key={src} variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }} className={`${index === 0 ? "md:col-span-2" : ""} overflow-hidden rounded-[18px] border border-white/10 bg-[#141414] p-3`}>
            <img src={src} alt={label} loading="lazy" className="w-full rounded-xl" />
            <figcaption className="flex justify-between px-2 pb-2 pt-4 text-[9px] text-white/45"><span>{label}</span><span className="text-[#C9A86A]">0{index + 2}</span></figcaption>
          </motion.figure>
        ))}
      </motion.div>
      <Reveal className="mt-10 border-l-2 border-[#C9A86A] bg-[#141414] p-7 md:p-10">
        <span className="text-[9px] text-[#C9A86A]">核心价值</span>
        <p className="mt-5 max-w-4xl text-xl leading-9 text-[#D4D4CD] md:text-2xl">它不是一个简单的信息入口，而是一套面向团队协作的内部运营系统，让知识、流程、文件和团队服务持续沉淀并长期运转。</p>
      </Reveal>
    </article>
  );
}

export function DinnerCase() {
  const gallery = ["photo (1).JPG", "photo (10).JPG", "photo (5).JPG", "photo (14).JPG"];
  return (
    <article>
      <Intro number="02" type="品牌活动 / 年会晚宴 / 线下执行" title="公司年会晚宴" summary="围绕公司年会晚宴进行活动策划、主视觉设计、宣传物料、现场记录、流程协同与内容沉淀，将一次线下活动转化为可传播、可复盘、可保存的品牌资产。" tags={["活动策划", "主视觉设计", "现场执行", "现场拍摄", "传播素材"]} />
      <Reveal className="relative mt-14 min-h-[460px] overflow-hidden rounded-[20px] border border-white/10 md:min-h-[620px]">
        <img src="/cases/annual-dinner/04_selected-assets/photo (1).JPG" alt="公司年会晚宴现场" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
        <p className="absolute bottom-7 left-7 max-w-xl text-3xl font-medium leading-tight md:bottom-10 md:left-10 md:text-5xl">让活动发生，<br />也让品牌资产留下。</p>
      </Reveal>
      <Reveal className="mt-12 grid gap-8 lg:grid-cols-3">
        <Detail title="项目背景">公司年会不仅是一场聚会，也是团队文化、品牌氛围和组织凝聚力的集中表达。</Detail>
        <Detail title="我的角色">活动视觉整理、现场拍摄、流程协同、内容记录、传播素材沉淀与活动资产整理。</Detail>
        <Detail title="解决方案">围绕流程、主视觉、打卡位、宣传物料、邀请函和现场照片进行整体整理，形成完整链路。</Detail>
      </Reveal>
      <Reveal className="mt-14 grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
        <figure className="overflow-hidden rounded-[18px] border border-white/10 bg-[#141414] p-3"><img src="/cases/annual-dinner/02_key-visual/打卡位2.jpg" alt="年会主视觉与打卡位" className="aspect-[16/10] w-full rounded-xl object-cover" /><figcaption className="p-3 text-[9px] text-white/40">主视觉与打卡位</figcaption></figure>
        <div className="grid grid-cols-2 gap-4">
          {[["同事邀请函.png", "同事邀请函"], ["水牌带二维码.png", "现场传播物料"]].map(([file, label]) => <figure key={file} className="overflow-hidden rounded-[18px] border border-white/10 bg-[#141414] p-2"><img src={`/cases/annual-dinner/03_promotion-materials/${file}`} alt={label} className="aspect-[3/4] w-full rounded-xl object-cover object-top" /><figcaption className="p-3 text-[9px] text-white/40">{label}</figcaption></figure>)}
        </div>
      </Reveal>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {gallery.map((file, index) => <Reveal key={file}><figure className="overflow-hidden rounded-[18px] border border-white/10"><img src={`/cases/annual-dinner/04_selected-assets/${file}`} alt={`年会现场精选照片 ${index + 1}`} loading="lazy" className="aspect-[3/2] w-full object-cover" /></figure></Reveal>)}
      </div>
      <Reveal className="mt-10 border-l-2 border-[#C9A86A] bg-[#141414] p-7 md:p-10">
        <span className="text-[9px] text-[#C9A86A]">核心价值</span>
        <p className="mt-5 max-w-4xl text-xl leading-9 text-[#D4D4CD] md:text-2xl">让年会不只停留在现场，而是成为可以被记录、传播、复盘和保存的品牌资产。</p>
      </Reveal>
    </article>
  );
}
