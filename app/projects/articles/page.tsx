import type { Metadata } from "next";
import { ProjectEntry, ProjectPageShell } from "@/components/ProjectPage";

export const metadata: Metadata = { title: "个人文章｜李阳 Leo" };

export default function Page() {
  return (
    <ProjectPageShell number="06" title={{cn:"个人文章",en:"Personal Articles"}} description={{cn:"这里将整理我的个人文章、工作思考、品牌运营观察、AI 学习记录、摄影文字和项目复盘。",en:"A future archive of personal writing, brand operation observations, AI learning notes, photography essays and project reflections."}}>
      <div className="grid gap-4 md:grid-cols-2">
        {[
          {cn:"品牌运营思考",en:"Brand Operation Thinking"},
          {cn:"AI 工作流记录",en:"AI Workflow Notes"},
          {cn:"摄影与观察",en:"Photography & Observation"},
          {cn:"项目复盘",en:"Project Reflection"},
        ].map((title) => <ProjectEntry key={title.cn} title={title} status={{ cn: "待更新", en: "Coming Soon" }} />)}
      </div>
    </ProjectPageShell>
  );
}
