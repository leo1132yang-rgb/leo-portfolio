import type { ReactNode } from "react";
import { SiteNavbar } from "@/components/layout/SiteNavbar";
import { SiteFooter } from "@/components/layout/SiteFooter";
export function InnerPage({ children }: { children: ReactNode }) { return <main className="cinema-page"><SiteNavbar /><div className="cinema-page__content">{children}</div><SiteFooter /></main>; }
