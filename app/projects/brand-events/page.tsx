import type { Metadata } from "next";
import { BrandEventsProjects } from "@/components/BrandEventsProjects";
import { ProjectPageShell } from "@/components/ProjectPage";

export const metadata: Metadata = { title: "品牌活动策划｜李阳 Leo" };

export default function Page() {
  return (
    <ProjectPageShell number="02" title={{cn:"品牌活动策划",en:"Brand Event Planning"}} description={{cn:"这里整理我参与和完成过的品牌活动策划、线下活动、年会晚宴、展位活动和团队活动项目。",en:"Brand event planning, offline activations, annual dinners, booth experiences and internal team events."}}>
      <BrandEventsProjects />
    </ProjectPageShell>
  );
}
