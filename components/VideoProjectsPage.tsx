"use client";

import { CommercialVideos } from "@/components/CommercialVideos";
import { EventHighlights } from "@/components/EventHighlights";
import { PersonalVideos } from "@/components/PersonalVideos";
import { ProjectPageShell } from "@/components/ProjectPage";

export function VideoProjectsPage() {
  return (
    <ProjectPageShell
      number="04"
      title={{ cn: "视频项目", en: "Video Projects" }}
      description={{
        cn: "这里整理我的商业视频、活动花絮和个人视频内容，用影像记录现场、表达创意，并沉淀品牌传播素材。",
        en: "This section organizes my commercial videos, event highlights and personal video works, using video to document scenes, express ideas and build brand communication assets.",
      }}
    >
      <CommercialVideos />
      <EventHighlights />
      <PersonalVideos />
    </ProjectPageShell>
  );
}
