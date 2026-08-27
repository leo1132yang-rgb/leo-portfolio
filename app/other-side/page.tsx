import type { Metadata } from "next";
import { OtherSide } from "@/components/OtherSide";

export const metadata: Metadata = {
  title: "另一面｜Leo 李阳",
  description: "一些地方、一些声音、一些吃过的东西，和 Leo 最早认识世界的方式。",
};

export default function OtherSidePage() {
  return <OtherSide />;
}
