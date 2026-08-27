import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PlatformProject } from "@/components/PlatformProject";
import { SHOW_WECHAT_PLATFORM } from "@/data/publication";

export const metadata: Metadata = { title: "网络运营平台搭建｜李阳 Leo" };

export default function Page() {
  if (!SHOW_WECHAT_PLATFORM && process.env.NODE_ENV === "production") redirect("/projects");
  return <PlatformProject />;
}
