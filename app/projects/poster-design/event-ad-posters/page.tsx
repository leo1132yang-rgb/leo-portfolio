import type { Metadata } from "next";
import { PosterCollectionPage } from "@/components/PosterGallery";
import { getPosterCollection } from "@/data/posterCollections";

export const metadata: Metadata = { title: "活动及广告海报设计｜李阳 Leo" };

export default function EventAdvertisingPostersPage() {
  return <PosterCollectionPage group="event" items={getPosterCollection("event-ad-posters")} />;
}
