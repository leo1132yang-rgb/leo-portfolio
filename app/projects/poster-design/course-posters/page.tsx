import type { Metadata } from "next";
import { PosterCollectionPage } from "@/components/PosterGallery";
import { getPosterCollection } from "@/data/posterCollections";

export const metadata: Metadata = { title: "课程海报设计｜李阳 Leo" };

export default function CoursePostersPage() {
  return <PosterCollectionPage group="course" items={getPosterCollection("course-posters")} />;
}
