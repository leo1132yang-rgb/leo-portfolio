export const mobileJourneyKey = 'leo-mobile-journey-v1';
export const chapterPaths: Record<string, string> = { '/': '/#home', '/profile': '/#profile', '/projects': '/#projects', '/other-side': '/#world' };
export type JourneyState = { chapter: 'projects' | 'world'; y: number; filter: string; pending: boolean; href?: string };
export function readJourney(): JourneyState | null {
  try { return JSON.parse(sessionStorage.getItem(mobileJourneyKey) || 'null'); } catch { return null; }
}
export function rememberJourney(chapter: JourneyState['chapter'], filter = 'all', href?: string) {
  try { sessionStorage.setItem(mobileJourneyKey, JSON.stringify({ chapter, filter, href, y: window.scrollY, pending: true })); } catch {}
  // Keep the current entry identifiable when browser Back returns to an older
  // chapter hash. Scrolling itself never changes the URL or adds history.
  history.replaceState({ ...history.state, leoMobileJourneyReturn: true }, '');
}
export function rememberProjectFilter(filter: string) {
  const previous = readJourney() || { chapter: 'projects', y: 0, pending: false };
  try { sessionStorage.setItem(mobileJourneyKey, JSON.stringify({ ...previous, filter })); } catch {}
}
export function projectReturnHref(fallback: string) {
  return typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches && fallback === '/projects' ? '/#projects' : fallback;
}
