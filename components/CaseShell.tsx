"use client";
import Link from "next/link";
import type { ReactNode } from "react";
import { localize, type LocalizedText, useLanguage } from "@/components/LanguageProvider";
import { InnerPage } from "@/components/layout/InnerPage";
import { FadeSlideUp } from "@/components/motion/FadeSlideUp";
export function CaseShell({number,title,backHref,children,nextHref,nextLabel}:{number:string;title:LocalizedText;backHref:string;children:ReactNode;nextHref?:string;nextLabel?:LocalizedText}){const {language}=useLanguage();const cn=language==="cn";return <InnerPage><article className="case-cinema"><FadeSlideUp><Link href={backHref} className="work-page__back">← {cn?"返回项目":"Back to Project"}</Link><p className="eyebrow">CASE STUDY / {number}</p><h1>{localize(title,language)}</h1></FadeSlideUp><div className="case-cinema__body">{children}</div>{nextHref&&nextLabel&&<Link className="case-cinema__next" href={nextHref}>{cn?"下一个项目":"Next Project"}<b>{localize(nextLabel,language)} →</b></Link>}</article></InnerPage>}
