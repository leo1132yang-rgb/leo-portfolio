import type { Metadata } from "next";
import { CareerProfile } from "@/components/CareerProfile";

export const metadata: Metadata = {
  title: "个人履历｜Leo 李阳",
  description: "从 2015 年的摄影工作室学习与个人创作，到创意写作、品牌运营与系统建设，了解 Leo 的学习经历、职业发展与能力路径。",
};

export default function ProfilePage() {
  return <CareerProfile />;
}
