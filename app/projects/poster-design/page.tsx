import type { Metadata } from "next";
import { PosterDesignLanding } from "@/components/PosterGallery";
import { getPosterCollection } from "@/data/posterCollections";

export const metadata: Metadata = { title: "视觉海报设计｜李阳 Leo" };

export default function Page() {
  return (
    <PosterDesignLanding
      eventPosters={getPosterCollection("event-ad-posters")}
      coursePosters={getPosterCollection("course-posters")}
    />
  );
}
