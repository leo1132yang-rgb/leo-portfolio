"use client";

import { useState } from "react";

const links = ["Home", "Projects", "Studio", "Reach Us"];

function Icon({ name, size = 20, className }: { name: "arrow" | "menu" | "close"; size?: number; className?: string }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, className, "aria-hidden": true };
  if (name === "menu") return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
  if (name === "close") return <svg {...common}><path d="M6 6l12 12M18 6 6 18" /></svg>;
  return <svg {...common}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}

export function FoldcraftHero() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main className="foldcraft-root relative h-screen w-full overflow-hidden bg-black font-geist">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute h-full w-full object-cover object-[70%_center]"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_204221_5339e40b-e73d-4ab0-9c65-79c18c66fd50.mp4"
      />
      <div className="absolute inset-0 bg-black/35" aria-hidden="true" />

      <header className="relative z-30 flex items-center justify-between px-6 py-5 md:px-12 lg:px-16">
        <div className="flex items-center gap-10 lg:gap-14">
          <a href="#home" className="text-lg font-semibold tracking-tight text-white sm:text-xl">Foldcraft</a>
          <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
            {links.map((link) => <a key={link} href={`#${link.toLowerCase().replaceAll(" ", "-")}`} className="text-sm text-white/80 transition-colors hover:text-white">{link}</a>)}
          </nav>
        </div>
        <a href="#reach-us" className="hidden rounded-lg bg-white px-5 py-2 text-sm font-medium text-black transition-transform hover:scale-105 md:inline-flex">Let&apos;s Talk</a>
        <button
          type="button"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="relative z-50 flex h-10 w-10 items-center justify-center text-white transition-transform duration-300 active:scale-90 md:hidden"
        >
          <Icon name="menu" className={`absolute transition-all duration-300 ${mobileMenuOpen ? "rotate-90 scale-75 opacity-0" : "rotate-0 scale-100 opacity-100"}`} />
          <Icon name="close" className={`absolute transition-all duration-300 ${mobileMenuOpen ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-75 opacity-0"}`} />
        </button>
      </header>

      <div className={`absolute inset-x-0 top-0 z-20 overflow-hidden bg-black/98 backdrop-blur-xl transition-[height,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${mobileMenuOpen ? "h-screen opacity-100" : "pointer-events-none h-0 opacity-0"}`}>
        <div className={`flex h-full flex-col justify-center px-8 transition-all delay-100 duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${mobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
          <nav className="flex flex-col gap-6" aria-label="Mobile navigation">
            {links.map((link) => <a key={link} href={`#${link.toLowerCase().replaceAll(" ", "-")}`} onClick={() => setMobileMenuOpen(false)} className="text-3xl font-medium text-white/90 transition-colors hover:text-white">{link}</a>)}
          </nav>
          <a href="#reach-us" onClick={() => setMobileMenuOpen(false)} className="mt-6 w-fit rounded-full bg-white px-8 py-3.5 text-base font-medium text-black transition-transform hover:scale-105">Let&apos;s Talk</a>
        </div>
      </div>

      <section id="home" className="relative z-10 flex h-[calc(100vh-80px)] flex-col justify-between px-6 pb-10 pt-12 sm:pb-12 sm:pt-16 md:px-12 md:pb-16 md:pt-20 lg:px-16" aria-labelledby="foldcraft-heading">
        <div className="max-w-3xl">
          <p className="mb-4 animate-[fadeSlideUp_0.8s_ease_0.2s_both] text-xs text-white/90 sm:mb-6 sm:text-sm">Brand &amp; Visual Storytelling</p>
          <h1 id="foldcraft-heading" className="animate-[fadeSlideUp_0.8s_ease_0.4s_both] text-3xl font-medium leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">Shaping visual<br />narratives,<br />one pixel at a time.</h1>
        </div>
        <div>
          <p className="mb-5 max-w-sm animate-[fadeSlideUp_0.8s_ease_0.7s_both] text-sm leading-relaxed text-white/60 sm:mb-6 sm:max-w-lg sm:text-base md:text-lg">Turning vision into reality through craft, motion, and an endless pursuit of beauty.</p>
          <a href="#projects" className="inline-flex animate-[fadeSlideUp_0.8s_ease_0.9s_both] items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black transition-transform hover:scale-105 sm:px-6 sm:py-3">Explore Work <Icon name="arrow" size={16} /></a>
        </div>
      </section>
    </main>
  );
}
