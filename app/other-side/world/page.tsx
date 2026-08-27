import type { Metadata } from "next";
import { MyWorldPage } from "@/components/my-world/MyWorldPage";

export const metadata: Metadata = {
  title: "我的地球 / My World — Leo",
  description: "属于 Leo 另一面的个人旅行记忆地球档案。",
};

export default function MyWorldRoute() {
  return <MyWorldPage />;
}
