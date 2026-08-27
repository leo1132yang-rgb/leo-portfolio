"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

export function BackLink({ href }: { href: string }) {
  const { language } = useLanguage();

  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[.02] px-3 py-2 text-[9px] text-[#A0A1B3] transition duration-300 hover:border-[#45D6D8]/25 hover:bg-[#45D6D8]/[.035] hover:text-[#F7F7FF] hover:shadow-[0_0_14px_rgba(69,214,216,.05)]"
    >
      <span className="text-[#45D6D8]/70 transition-transform duration-300 group-hover:-translate-x-0.5">
        ←
      </span>
      {language === "cn" ? "返回上一级" : "Back"}
    </Link>
  );
}
