export type PrototypeHotspot = {
  id: string;
  title: string;
  category: string;
  body: string;
  x: number;
  y: number;
  emphasis: "primary" | "secondary";
};

export type PrototypeScene = {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  descriptor: string;
  atmosphere: string;
  layers: string[];
  hotspots: PrototypeHotspot[];
};

// Placeholder-only exploration data. Replace this file after the interaction direction is approved.
export const prototypeScenes: PrototypeScene[] = [
  { id: "arrival", number: "01", title: "THE QUIET HOUSE", subtitle: "Arrival space", descriptor: "A first room for slow observation.", atmosphere: "night-blue", layers: ["horizon", "house", "window", "grass"], hotspots: [
    { id: "lamp", title: "A lit window", category: "Observation 01", body: "A temporary fragment of content. This panel demonstrates the short-form discovery pattern.", x: 36, y: 50, emphasis: "primary" },
    { id: "path", title: "A narrow path", category: "Observation 02", body: "A smaller discovery can sit quietly inside the same world without becoming a card.", x: 59, y: 68, emphasis: "secondary" },
    { id: "tree", title: "The old tree", category: "Observation 03", body: "Placeholder copy for a peripheral memory, archive item, or note.", x: 76, y: 39, emphasis: "secondary" },
  ] },
  { id: "greenhouse", number: "02", title: "THE GLASS GARDEN", subtitle: "Interior landscape", descriptor: "A space held between shadow, glass and air.", atmosphere: "green-blue", layers: ["horizon", "greenhouse", "window", "grass"], hotspots: [
    { id: "glass", title: "Condensation", category: "Fragment 01", body: "A primary point of attention with a quiet narrative layer behind it.", x: 51, y: 36, emphasis: "primary" },
    { id: "bench", title: "Empty bench", category: "Fragment 02", body: "This is placeholder text for a future story or object description.", x: 38, y: 68, emphasis: "secondary" },
    { id: "leaf", title: "Falling leaf", category: "Fragment 03", body: "A secondary discovery remains small until a visitor chooses to open it.", x: 72, y: 56, emphasis: "secondary" },
  ] },
  { id: "archive", number: "03", title: "THE ARCHIVE ROOM", subtitle: "Collected traces", descriptor: "Objects, notes and pauses arranged in one suspended room.", atmosphere: "warm-dark", layers: ["horizon", "archive", "window", "grass"], hotspots: [
    { id: "desk", title: "The long table", category: "Archive 01", body: "A selected fragment opens in a small layer, keeping the room present behind it.", x: 48, y: 61, emphasis: "primary" },
    { id: "paper", title: "Folded note", category: "Archive 02", body: "Placeholder content for a personal note, photograph or sound piece.", x: 64, y: 47, emphasis: "secondary" },
    { id: "shelf", title: "Shelf mark", category: "Archive 03", body: "A small point inside the wider composition.", x: 24, y: 44, emphasis: "secondary" },
  ] },
  { id: "observatory", number: "04", title: "THE LAST TERRACE", subtitle: "Looking outward", descriptor: "The final temporary scene before this prototype receives its own stories.", atmosphere: "blue-black", layers: ["horizon", "terrace", "window", "grass"], hotspots: [
    { id: "sky", title: "A distant signal", category: "Exit 01", body: "A final primary placeholder that will later become a real transition into the next chapter.", x: 57, y: 34, emphasis: "primary" },
    { id: "railing", title: "Cold railing", category: "Exit 02", body: "A restrained secondary detail in the foreground.", x: 69, y: 68, emphasis: "secondary" },
  ] },
];
