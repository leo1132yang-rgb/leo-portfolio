"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Reveal } from "./Reveal";

const labels = ["Brand Operation", "Visual Design", "Event Execution", "AI Workflow", "System Builder", "Content Collaboration"];

const growth = [
  {
    year: "起点",
    title: "从摄影开始观察",
    text: "摄影让我学会观察，也让我开始理解画面、情绪、人物和现场之间的关系。它不只是记录，而是一种看见“看不见”的能力。",
  },
  {
    year: "实践",
    title: "进入品牌运营现场",
    text: "这种观察力逐渐延伸到视觉设计、活动现场、品牌内容和运营系统之中。我开始意识到，真正重要的不是某一次灵感，而是让灵感被组织、被执行、被记录。",
  },
  {
    year: "2025+",
    title: "从完成任务到搭建系统",
    text: "我开始从 0 到 1 搭建企业微信后台，整理 AI 知识库，协同团队完成视频、文章、公告和内部内容输出，让经验成为团队可以复用的资产。",
  },
  {
    year: "现在",
    title: "把 AI 作为能力的望远镜",
    text: "AI 帮助我更快整理信息、生成初稿、搭建流程；但真正决定方向、审美、情绪和判断的，仍然是人。",
  },
];

const methods = [
  ["01", "理解问题", "先理解目标、场景、受众和实际限制。"],
  ["02", "梳理结构", "把分散的信息、内容和角色整理成清晰关系。"],
  ["03", "推动落地", "让方案进入真实现场，被执行、被看见。"],
  ["04", "沉淀系统", "为下一次协作留下能够复用的经验与流程。"],
];

const keywords = [
  ["创意落地", "不是停留在想法里，而是被执行、被看见、被记录。"],
  ["系统运转", "不是只靠人盯人，而是让流程、内容和经验形成结构。"],
  ["视觉表达", "不是单纯好看，而是帮助信息被理解、被记住、被传播。"],
  ["活动资产", "不是活动结束就结束，而是把现场转化为长期可用的品牌素材。"],
  ["AI 协作", "不是替代判断，而是放大整理、生成和协作能力。"],
];

const quotes = [
  "把创意落地，让系统运转。",
  "先了解，再动手。",
  "看不见的根系，决定了看得见的繁茂。",
  "系统会带领团队走向强大。",
  "先成为枢纽，再成为风。",
];

function IntroHeading({ index, en, cn }: { index: string; en: string; cn: string }) {
  return (
    <div className="grid gap-4 border-t border-white/10 pt-5 md:grid-cols-[100px_1fr]">
      <span className="text-[9px] tracking-[.16em] text-[#C9A86A]">{index}</span>
      <div><p className="text-[9px] uppercase tracking-[.18em] text-white/30">{en}</p><h2 className="mt-4 text-3xl font-normal tracking-[-.045em] md:text-5xl">{cn}</h2></div>
    </div>
  );
}

export function Hero() {
  return (
    <section id="intro" className="scroll-mt-20">
      <div className="mx-auto max-w-[1200px] px-5 pb-28 pt-32 md:px-10 md:pb-40 md:pt-40">
        <div className="grid min-h-[78vh] items-center gap-16 lg:grid-cols-[1.02fr_.98fr] lg:gap-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75 }} className="max-w-[620px]">
            <p className="text-[9px] uppercase tracking-[.2em] text-[#C9A86A]">Intro / 关于我</p>
            <h1 className="mt-8 text-[clamp(4.7rem,10vw,8.5rem)] font-medium leading-[.86] tracking-[-.075em]">
              李阳
              <span className="mt-5 block text-[clamp(2.3rem,5vw,4.2rem)] font-normal tracking-[-.04em] text-[#686862]">Leo</span>
            </h1>
            <p className="mt-10 text-sm tracking-[.05em] text-[#D4D4CD] md:text-base">品牌运营 / 视觉设计 / 活动执行 / AI 工作流</p>
            <p className="mt-6 max-w-[580px] text-sm leading-8 text-[#92928B] md:text-[15px]">我帮助团队把创意、内容、活动、AI 与系统连接起来，<br className="hidden sm:block" />让项目真正落地，并沉淀为长期价值。</p>

            <div className="mt-10 border-y border-white/10 py-5 text-[11px] leading-8 text-[#A3A39C]">
              <p><span className="mr-4 text-white/30">微信</span>Leo1132Yang</p>
              <p><span className="mr-4 text-white/30">手机</span>+86 15707010027 / +852 61069008</p>
              <p className="break-all"><span className="mr-4 text-white/30">邮箱</span><a href="mailto:leoyang1132@outlook.com" className="transition hover:text-[#C9A86A]">leoyang1132@outlook.com</a></p>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3">
              {labels.map((label) => <span key={label} className="text-[8px] uppercase tracking-[.14em] text-white/35">{label}</span>)}
            </div>
          </motion.div>

          <motion.figure initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.85 }} className="relative mx-auto w-full max-w-[510px] overflow-hidden rounded-[18px] border border-white/10 bg-[#141414]">
            <div className="relative aspect-[4/5]">
              <Image src="/images/leo-profile.jpg" alt="李阳 Leo 个人形象照" fill priority sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover object-[58%_center]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
            </div>
            <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 text-[8px] uppercase tracking-[.15em] text-white/55">
              <span>Li Yang / Leo</span><span>Brand Operator</span>
            </figcaption>
          </motion.figure>
        </div>

        <div className="mt-36 space-y-36 md:mt-48 md:space-y-48">
          <Reveal>
            <IntroHeading index="01" en="About" cn="详细关于我" />
            <div className="mt-14 grid gap-10 md:grid-cols-[100px_1fr]">
              <div />
              <div className="max-w-[780px] space-y-7 text-base leading-[2] text-[#96968F] md:text-lg">
                <p className="text-xl leading-[1.8] text-[#E0E0D9] md:text-2xl">我是一名有落地经验的品牌运营者，长期参与品牌内容、视觉设计、活动策划、现场执行、企业微信后台和 AI 工作流建设。</p>
                <p>我的工作并不只停留在“做一张海报”“完成一次活动”或“整理一份内容”。我更关注的是，一次创意如何被真正执行，一次活动如何被完整记录，一套流程如何被团队持续复用。</p>
                <p>在工作中，我经常同时连接多个角色：设计、内容、活动、现场、系统、AI 工具和团队协作。我习惯先理解业务和场景，再开始动手，因为我相信只有真正理解问题，设计、内容和执行才不会只是表面工作。</p>
                <p>对我来说，品牌运营不是单点输出，而是把分散的信息、素材、经验和流程整理成一个可以持续运转的系统。</p>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <IntroHeading index="02" en="Growth" cn="我的成长路径" />
            <div className="mt-14 border-b border-white/10">
              {growth.map((item) => (
                <article key={item.year} className="grid gap-5 border-t border-white/10 py-8 md:grid-cols-[100px_280px_1fr] md:py-10">
                  <span className="text-[9px] text-[#C9A86A]">{item.year}</span>
                  <h3 className="text-xl font-normal tracking-[-.025em] text-[#D8D8D1]">{item.title}</h3>
                  <p className="max-w-[560px] text-sm leading-8 text-[#85857F]">{item.text}</p>
                </article>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <IntroHeading index="03" en="Working Method" cn="先了解，再动手。" />
            <div className="mt-14 grid gap-12 md:grid-cols-[.85fr_1.15fr]">
              <div className="max-w-[470px] space-y-6 text-sm leading-8 text-[#8E8E87]">
                <p>在开始设计、策划或搭建系统之前，我会先理解目标、场景、受众和实际限制。因为任何视觉、内容和工具，最终都要服务于真实问题。</p>
                <p>无论是活动策划、视觉设计、企业微信后台，还是 AI 知识库建设，我都会尽量让每一次工作不仅完成当下任务，也能为下一次协作留下可以复用的经验。</p>
              </div>
              <div className="border-b border-white/10">
                {methods.map(([number, title, text]) => (
                  <div key={number} className="grid grid-cols-[40px_120px_1fr] gap-3 border-t border-white/10 py-6">
                    <span className="text-[8px] text-[#C9A86A]">{number}</span><span className="text-sm text-[#D1D1CA]">{title}</span><span className="text-xs leading-6 text-[#777770]">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal>
            <IntroHeading index="04" en="Keywords" cn="我的关键词" />
            <div className="mt-14 grid gap-px overflow-hidden rounded-[16px] border border-white/10 bg-white/10 md:grid-cols-5">
              {keywords.map(([title, text]) => (
                <article key={title} className="flex min-h-[260px] flex-col justify-between bg-[#111111] p-6">
                  <h3 className="text-xl font-normal text-[#D8D8D1]">{title}</h3>
                  <p className="text-xs leading-7 text-[#777770]">{text}</p>
                </article>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <IntroHeading index="05" en="Personal Notes" cn="我的个人句子" />
            <div className="mt-14 border-b border-white/10">
              {quotes.map((quote, index) => (
                <p key={quote} className={`border-t border-white/10 py-7 font-normal tracking-[-.035em] ${index === 0 ? "text-3xl text-[#F5F5F0] md:text-5xl" : "text-xl text-white/45 md:text-3xl"}`}>{quote}</p>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
