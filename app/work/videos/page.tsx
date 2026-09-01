import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { ProjectBackButton } from "@/components/ProjectBackButton";

export const metadata: Metadata = {
  title: "视频项目｜李阳 Leo",
  description: "活动花絮、创意视频、动画创作与商业视频项目归档。",
};

const categories = ["活动花絮", "创意视频", "动画创作", "商业视频"];

export default function VideosPage() {
  return (
    <main className="min-h-screen">
      <div className="noise" />
      <Nav />
      <ProjectBackButton fallbackHref="/projects/videos" />
      <section className="mx-auto max-w-[1200px] px-6 pb-32 pt-36 md:px-10 md:pt-44">
        <div className="grid gap-10 border-b border-white/10 pb-14 lg:grid-cols-[.9fr_1.1fr]">
          <div>
            <p className="text-[9px] uppercase tracking-[.18em] text-[#C9A86A]">Moving Image / Archive</p>
            <h1 className="mt-7 text-5xl font-medium tracking-[-.06em] md:text-8xl">视频项目</h1>
          </div>
          <div className="self-end">
            <p className="max-w-2xl text-lg leading-9 text-[#C8C8C1]">整理影像内容、现场记录与创意表达，将视频作为品牌传播和视觉叙事的一部分。</p>
            <p className="mt-5 text-sm leading-7 text-[#7D7D76]">当前页面作为视频项目入口与内容索引，不直接加载视频文件。完整作品将持续整理更新。</p>
          </div>
        </div>
        <div className="mt-20 grid gap-px overflow-hidden rounded-[18px] border border-white/10 bg-white/10 md:grid-cols-2">
          {categories.map((category, index) => (
            <article key={category} className="video-cover flex min-h-[320px] flex-col justify-between bg-[#111111] p-7 md:p-9">
              <div className="flex justify-between text-[8px]"><span className="text-[#C9A86A]">0{index + 1}</span><span className="uppercase tracking-[.15em] text-white/25">整理中</span></div>
              <div>
                <h2 className="text-3xl font-medium tracking-[-.04em]">{category}</h2>
                <p className="mt-3 text-[9px] tracking-[.12em] text-white/30">Selected Motion Work / Coming Soon</p>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-12 flex justify-between border-t border-white/10 pt-6">
          <Link href="/" className="text-[10px] text-white/45 transition hover:text-[#C9A86A]">← 返回首页</Link>
          <Link href="/#contact" className="text-[10px] text-[#C9A86A]">联系合作 →</Link>
        </div>
      </section>
    </main>
  );
}
