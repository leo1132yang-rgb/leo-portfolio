"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";

function fallbackForPath(pathname: string) {
  if (pathname.startsWith("/projects/poster-design/")) return "/projects/poster-design";
  if (pathname.startsWith("/projects/")) return "/projects";
  if (pathname.startsWith("/cases/wechat-system")) return "/projects/platform";
  if (pathname.startsWith("/cases/annual-dinner")) return "/projects/brand-events";
  if (pathname.startsWith("/cases/")) return "/projects";
  if (pathname.startsWith("/work/videos")) return "/projects/videos";
  return "/projects";
}

export function ProjectBackButton({ fallbackHref }: { fallbackHref?: string }) {
  const { language } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  const goBack = () => {
    const fallback = fallbackHref ?? fallbackForPath(pathname);
    const referrer = document.referrer;

    if (referrer) {
      try {
        const previous = new URL(referrer);
        const current = new URL(window.location.href);
        if (previous.origin === current.origin && previous.pathname !== current.pathname && window.history.length > 1) {
          router.back();
          return;
        }
      } catch {
        // Fall back to the route hierarchy below.
      }
    }

    router.push(fallback);
  };

  return (
    <button type="button" className="project-back-button" onClick={goBack}>
      <span aria-hidden="true">←</span>
      {language === "cn" ? "返回上一级" : "Back"}
    </button>
  );
}
