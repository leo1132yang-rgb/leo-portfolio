import type { Metadata } from "next";
import { OtherSideEntry } from "@/components/other-side/OtherSideEntry";

export const metadata: Metadata = {
  title: "我的世界 / Leo’s World｜Leo 李阳",
  description: "欢迎来到我的世界。慢慢探索 Leo 的房间、童年记忆、旅行地球与开放世界，看看那些我最核心、也最喜欢的内容。",
};

export default function OtherSidePage() {
  return <OtherSideEntry />;
}
