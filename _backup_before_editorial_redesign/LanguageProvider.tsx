"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Language = "cn" | "en";
export type LocalizedText = string | { cn: string; en: string };

const LanguageContext = createContext<{
  language: Language;
  setLanguage: (language: Language) => void;
}>({
  language: "cn",
  setLanguage: () => undefined,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("cn");

  useEffect(() => {
    const saved = window.localStorage.getItem("language");
    if (saved === "cn" || saved === "en") {
      setLanguageState(saved);
      document.documentElement.lang = saved === "cn" ? "zh-CN" : "en";
    }
  }, []);

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    window.localStorage.setItem("language", nextLanguage);
    document.documentElement.lang = nextLanguage === "cn" ? "zh-CN" : "en";
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function localize(text: LocalizedText, language: Language) {
  return typeof text === "string" ? text : text[language];
}

export function LanguageSwitch() {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className="flex shrink-0 items-center rounded-full border border-white/10 p-1 text-[8px] tracking-[.1em]"
      aria-label="Language switch"
    >
      {(["cn", "en"] as const).map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => setLanguage(item)}
          aria-pressed={language === item}
          className={`rounded-full px-2 py-1.5 uppercase transition ${
            language === item
              ? "bg-[#45D6D8]/12 text-[#B9F2F3]"
              : "text-[#686981] hover:text-[#C7C8D8]"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
