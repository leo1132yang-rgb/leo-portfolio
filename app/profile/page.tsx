import type { Metadata } from "next";
import { EvolvingProfile } from "@/components/profile/EvolvingProfile";

export const metadata: Metadata = {
  title: "Leo / Timeline Archive｜个人履历",
  description: "Leo 李阳的个人成长档案：从 2015 年的摄影学习，到香港 CHAMP MVP 网络运营部负责人。七段真实经历，从影像出发，逐渐走向品牌、系统与 AI。",
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%23191b14'/%3E%3Ctext x='8' y='25' font-family='Georgia,serif' font-size='27' fill='%23e8e0d2'%3EL%3C/text%3E%3C/svg%3E",
  },
};

export default function ProfilePage() {
  return <EvolvingProfile />;
}
