import { existsSync, readdirSync } from "node:fs";
import path from "node:path";

export type PosterItem = { src: string; previewSrc: string };

export function getPosterCollection(folder: "event-ad-posters" | "course-posters"): PosterItem[] {
  const directory = path.join(process.cwd(), "public", "projects", "poster-design", folder);
  const thumbnails = path.join(process.cwd(), "public", "projects", "poster-design", "thumbnails", folder);

  return readdirSync(directory)
    .filter((name) => /\.(png|jpe?g|webp)$/i.test(name))
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true }))
    .map((name) => {
      const baseName = path.parse(name).name;
      const thumbnail = `${baseName}.jpg`;
      return {
        src: `/projects/poster-design/${folder}/${encodeURIComponent(name)}`,
        previewSrc: existsSync(path.join(thumbnails, thumbnail))
          ? `/projects/poster-design/thumbnails/${folder}/${encodeURIComponent(thumbnail)}`
          : `/projects/poster-design/${folder}/${encodeURIComponent(name)}`,
      };
    });
}
