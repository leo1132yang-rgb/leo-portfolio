"use client";
import Link from "next/link";
import type { ReactNode } from "react";
import { localize, type LocalizedText, useLanguage } from "@/components/LanguageProvider";
import { InnerPage } from "@/components/layout/InnerPage";
import { FadeSlideUp } from "@/components/motion/FadeSlideUp";
import { ProjectBackButton } from "@/components/ProjectBackButton";
export function ProjectPageShell({number,title,description,children}:{number:string;title:LocalizedText;description?:LocalizedText;children:ReactNode}){const {language}=useLanguage();const cn=language==="cn";return <InnerPage><ProjectBackButton fallbackHref="/projects" /><section className="work-page"><FadeSlideUp><Link className="work-page__back" href="/projects">← {cn?"返回项目作品":"Back to Work"}</Link><p className="eyebrow">{number} / WORK</p><h1>{localize(title,language)}</h1>{description&&<p className="work-page__intro">{localize(description,language)}</p>}</FadeSlideUp><div className="work-page__content">{children}</div></section></InnerPage>}
export function ProjectEntry({title,description,status,href,action={cn:"查看项目",en:"View Project"}}:{title:LocalizedText;description?:LocalizedText;status?:LocalizedText;href?:string;action?:LocalizedText}){const {language}=useLanguage();const cn=language==="cn";const content=<><div><p>{status?localize(status,language):cn?"项目案例":"Project Case"}</p><h2>{localize(title,language)}</h2>{description&&<span>{localize(description,language)}</span>}</div><b>{href?`${localize(action,language)} →`:(cn?"即将更新":"Coming Soon")}</b></>;return href?<Link className="work-entry" href={href}>{content}</Link>:<article className="work-entry is-disabled">{content}</article>}
export function EntryGrid({children}:{children:ReactNode}){return <div className="work-entry-list">{children}</div>}
