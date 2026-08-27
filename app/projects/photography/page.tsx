import type { Metadata } from "next";
import { EntryGrid, ProjectEntry, ProjectPageShell } from "@/components/ProjectPage";

export const metadata: Metadata = { title: "摄影｜李阳 Leo" };

export default function Page() {
  return (
    <ProjectPageShell number="05" title={{cn:"摄影",en:"Photography"}} description={{cn:"这里整理我的大型活动摄影和个人摄影作品。",en:"A collection of large-scale event photography and personal visual studies."}}>
      <EntryGrid>
        <ProjectEntry title={{cn:"大型活动摄影",en:"Large-scale Event Photography"}} description={{cn:"通过现场拍摄记录活动氛围、关键人物、流程节点和品牌瞬间，将线下活动转化为可传播的视觉资产。",en:"Documenting atmosphere, people, key moments and brand stories to turn offline events into visual assets."}} status={{ cn: "待更新", en: "Coming Soon" }} />
        <ProjectEntry title={{cn:"个人摄影",en:"Personal Photography"}} description={{cn:"以摄影作为观察世界和表达思考的方式，持续整理个人影像创作与视觉研究。",en:"Using photography to observe the world, express ideas and continue personal visual research."}} status={{ cn: "待更新", en: "Coming Soon" }} />
      </EntryGrid>
    </ProjectPageShell>
  );
}
