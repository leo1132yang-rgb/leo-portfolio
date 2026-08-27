import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { SHOW_WECHAT_PLATFORM } from "@/data/publication";

export const metadata: Metadata = {
  title: "精选案例｜李阳 Leo",
  description: "李阳 Leo 的品牌运营、系统建设与品牌活动精选案例。",
};

const cases = [
  {
    number: "01",
    title: "企业微信后台搭建",
    type: "系统建设 / 企业微信 / 内部运营",
    description: "从 0 到 1 搭建面向团队协作的企业微信后台，将知识、课程、文件和团队服务整合成内部运营系统。",
    image: "/cases/wechat-system/01_selected-images/01_terminal-office-system.png",
    href: "/cases/wechat-system",
  },
  {
    number: "02",
    title: "公司年会晚宴",
    type: "品牌活动 / 视觉内容 / 现场执行",
    description: "围绕公司年会晚宴进行活动策划、视觉物料、现场记录与传播素材沉淀。",
    image: "/cases/annual-dinner/04_selected-assets/photo (1).JPG",
    href: "/cases/annual-dinner",
  },
];

export default function CasesPage() {
  return (
    <main className="min-h-screen">
      <div className="noise" />
      <Nav />
      <section className="mx-auto max-w-[1200px] px-6 pb-32 pt-36 md:px-10 md:pt-44">
        <div className="grid gap-8 border-b border-white/10 pb-12 md:grid-cols-[140px_1fr]">
          <span className="text-[9px] uppercase tracking-[.18em] text-[#C9A86A]">Selected Cases</span>
          <div>
            <h1 className="text-5xl font-medium tracking-[-.06em] md:text-8xl">精选案例</h1>
            <p className="mt-6 max-w-2xl text-sm leading-8 text-[#9A9A92]">项目不只是结果展示，也记录我如何连接品牌、内容、活动与系统，让一次交付沉淀为长期价值。</p>
          </div>
        </div>
        <div className="mt-20 space-y-8">
          {cases.filter((item) => item.href !== "/cases/wechat-system" || SHOW_WECHAT_PLATFORM).map((item, index) => (
            <Link key={item.number} href={item.href} className="group grid overflow-hidden rounded-[20px] border border-white/10 bg-[#141414] lg:grid-cols-[1.1fr_.9fr]">
              <div className="relative min-h-[340px] overflow-hidden lg:min-h-[480px]">
                <Image src={item.image} alt={item.title} fill sizes="(max-width:1024px) 100vw, 58vw" className="object-cover opacity-85 transition duration-700 group-hover:scale-[1.02] group-hover:opacity-100" />
              </div>
              <div className="flex flex-col justify-between border-t border-white/10 p-7 lg:border-l lg:border-t-0 lg:p-10">
                <div className="flex justify-between text-[9px]"><span className="text-[#C9A86A]">CASE {String(index + 1).padStart(2, "0")}</span><span className="text-white/25">{item.type}</span></div>
                <div className="mt-20">
                  <h2 className="text-3xl font-medium tracking-[-.045em] md:text-5xl">{item.title}</h2>
                  <p className="mt-5 text-sm leading-7 text-[#9A9A92]">{item.description}</p>
                  <span className="mt-8 inline-block text-[10px] text-[#C9A86A] transition group-hover:translate-x-1">查看案例 →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <p className="mt-12 border-t border-white/10 pt-6 text-[10px] tracking-[.12em] text-white/30">更多案例整理中。</p>
      </section>
    </main>
  );
}
