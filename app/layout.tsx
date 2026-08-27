import type { Metadata } from "next";
import "./globals.css";
import { CustomCursor } from "@/components/CustomCursor";
import { LanguageProvider } from "@/components/LanguageProvider";
import { GlobalAudioProvider } from "@/components/audio/GlobalAudioProvider";
import { SoundToggle } from "@/components/audio/SoundToggle";

export const metadata: Metadata = {
  title: "李阳 Leo｜个人品牌官网 · Brand Operation System",
  description: "有落地经验的品牌运营者，连接品牌、活动、视觉、内容、AI 与系统，建立能够持续运转的品牌运营系统。",
  keywords: ["李阳", "Leo", "品牌运营", "Brand Operation System", "企业微信", "AI 工作流", "活动策划"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <GlobalAudioProvider>
          <LanguageProvider>
            {children}
            <SoundToggle />
          </LanguageProvider>
        </GlobalAudioProvider>
        <CustomCursor />
      </body>
    </html>
  );
}
