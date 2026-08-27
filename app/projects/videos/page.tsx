import type { Metadata } from "next";
import { VideoProjectsPage } from "@/components/VideoProjectsPage";

export const metadata: Metadata = { title: "视频项目｜李阳 Leo" };

export default function Page() {
  return <VideoProjectsPage />;
}
