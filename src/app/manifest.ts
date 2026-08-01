import type { MetadataRoute } from "next"

export const dynamic = "force-static"

/**
 * Next serves this at `/manifest.webmanifest` and links it from every page.
 *
 * Android reads the icons from here; iOS does not — it uses `apple-icon.png` and the
 * `appleWebApp` metadata in `layout.tsx` instead, which is why the icon set is
 * generated in both places from the same matrix in `scripts/generate-icons.mjs`.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Expresso Timer",
    // Home screens truncate at roughly 12 characters.
    short_name: "Expresso",
    description: "Pomodoro em pixel art — o café baixa enquanto você foca.",
    lang: "pt-BR",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    // The light page colour: the splash screen cannot ask which theme is stored.
    background_color: "#e9d7bb",
    theme_color: "#e9d7bb",
    categories: ["productivity", "utilities"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      // Separate art, inset for the crop — a launcher applying its own shape to the
      // "any" icon would cut the handle off.
      { src: "/icon-mask.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  }
}
