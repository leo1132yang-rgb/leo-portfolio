import type { ReactNode } from "react";
import type { AboutSlug } from "@/data/aboutSections";
import { InnerPage } from "@/components/layout/InnerPage";
export function AboutChapter({ children }: { slug: AboutSlug; children: ReactNode; showIntro?: boolean }) { return <InnerPage>{children}</InnerPage>; }
