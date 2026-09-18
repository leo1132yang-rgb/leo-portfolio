"use client";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
export function SiteFooter({ chapterLinks = false }: { chapterLinks?: boolean } = {}) { const { language } = useLanguage(); const cn = language === "cn"; return <footer className="site-footer"><span>© 2026 李阳 / Leo</span><nav><Link href={chapterLinks ? "/#projects" : "/projects"}>{cn ? "项目作品" : "Work"}</Link><Link href={chapterLinks ? "/#profile" : "/profile"}>{cn ? "个人履历" : "Profile"}</Link><a href="mailto:leoyang1132@outlook.com">Email</a></nav></footer>; }
