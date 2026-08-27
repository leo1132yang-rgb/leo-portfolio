"use client";

import Link from "next/link";
import { Reveal } from "./Reveal";

const projectTypes = [
  "企业微信后台搭建",
  "AI 知识库建设",
  "公司年会晚宴",
  "品牌活动策划",
  "课程海报设计",
  "大型活动摄影",
  "公众号与人物专访",
  "视频项目",
  "个人摄影项目",
];

const aiPlans = [
  "AI 工具使用记录",
  "提示词模板",
  "内容生成流程",
  "知识库搭建方法",
  "团队协作流程",
  "个人学习笔记",
];

function SectionHeading({ number, en, cn }: { number: string; en: string; cn: string }) {
  return (
    <Reveal className="grid gap-5 border-t border-white/10 pt-6 md:grid-cols-[100px_1fr]">
      <span className="text-[9px] text-[#C9A86A]">{number}</span>
      <div><p className="text-[9px] uppercase tracking-[.18em] text-white/30">{en}</p><h2 className="mt-4 text-4xl font-normal tracking-[-.05em] md:text-6xl">{cn}</h2></div>
    </Reveal>
  );
}

export function Projects() {
  return (
    <section id="projects" className="scroll-mt-20 border-t border-white/10 bg-[#0D0D0D] px-5 py-32 md:px-10 md:py-44">
      <div className="mx-auto max-w-[1200px]">
        <SectionHeading number="02" en="Projects" cn="项目作品" />
        <Reveal className="mt-14 grid gap-12 md:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="max-w-[440px] text-base leading-8 text-[#92928B]">这里整理我参与和完成过的品牌运营、视觉设计、活动执行、系统建设和影像内容项目。</p>
            <Link href="/cases" className="mt-9 inline-block border-b border-white/20 pb-1 text-[10px] text-[#D5D5CE] transition hover:border-[#C9A86A] hover:text-[#C9A86A]">查看项目作品 →</Link>
          </div>
          <div className="grid border-t border-white/10 sm:grid-cols-2">
            {projectTypes.map((item, index) => (
              <div key={item} className="flex items-center justify-between border-b border-white/10 py-5 sm:odd:pr-7 sm:even:border-l sm:even:pl-7">
                <span className="text-[8px] text-white/25">0{index + 1}</span><span className="text-sm text-[#B8B8B1]">{item}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function AILibrary() {
  return (
    <section id="ai-library" className="scroll-mt-20 px-5 py-32 md:px-10 md:py-44">
      <div className="mx-auto max-w-[1200px]">
        <SectionHeading number="03" en="AI Library" cn="AI 知识库" />
        <Reveal className="mt-14 grid gap-16 md:grid-cols-[1fr_1fr]">
          <div className="max-w-[520px] space-y-6 text-base leading-8 text-[#92928B]">
            <p>这里将整理我在 AI 工具、内容生成、知识库搭建、提示词模板和团队协作流程中的实践记录。</p>
            <p>我希望把 AI 不只是当作效率工具，而是作为整理经验、放大能力、沉淀方法的工作伙伴。</p>
            <a href="#ai-library" className="mt-4 inline-block border-b border-white/20 pb-1 text-[10px] text-[#D5D5CE] transition hover:border-[#C9A86A] hover:text-[#C9A86A]">进入 AI Library →</a>
          </div>
          <div className="border-b border-white/10">
            {aiPlans.map((item, index) => (
              <div key={item} className="flex items-center justify-between border-t border-white/10 py-6">
                <span className="text-[8px] text-[#C9A86A]">0{index + 1}</span><span className="text-sm text-[#B8B8B1]">{item}</span>
              </div>
            ))}
          </div>
        </Reveal>
        <div className="mt-32 flex flex-col gap-3 border-t border-white/10 pt-5 text-[8px] uppercase tracking-[.14em] text-white/25 md:flex-row md:justify-between">
          <span>© 2026 李阳 Leo</span><span>Brand Operation / Creative / AI Workflow</span><a href="#intro" className="transition hover:text-[#C9A86A]">返回顶部 ↑</a>
        </div>
      </div>
    </section>
  );
}
