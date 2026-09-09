import type { Metadata } from "next";
import { MyWorldPage } from "@/components/my-world/MyWorldPage";

export const metadata: Metadata = {
  title: "旅行地球 / Travel Globe — Leo",
  description: "我的世界中的旅行地球：跟随 Leo 的足迹，探索真实照片、旅行坐标与个人记忆。",
};

export default function MyWorldRoute() {
  return <MyWorldPage />;
}
