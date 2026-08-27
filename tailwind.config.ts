import type { Config } from "tailwindcss";
const config: Config = { content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"], theme: { extend: { colors: { paper: "#F1F0EB", ink: "#171816", muted: "#73756F", line: "#CDCEC7", accent: "#82917B" }, fontFamily: { geist: ["Geist", "sans-serif"] } } }, plugins: [] };
export default config;
