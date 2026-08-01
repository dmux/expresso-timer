import type { Metadata, Viewport } from "next"
import { Press_Start_2P } from "next/font/google"

import { ServiceWorker } from "@/ui/components/service-worker"
import { TooltipProvider } from "@/ui/components/ui/tooltip"
import { THEME_INIT_SCRIPT } from "@/ui/theme"

import "./globals.css"

const pixelFont = Press_Start_2P({
  variable: "--font-pixel",
  weight: "400",
  subsets: ["latin"],
  // Swapping in a proportional fallback would reflow the whole grid mid-load.
  display: "block",
})

export const metadata: Metadata = {
  title: "Expresso Timer",
  description: "Pomodoro em pixel art — o café baixa enquanto você foca.",
  applicationName: "Expresso Timer",
  // iOS reads none of the web app manifest. Everything about the installed experience
  // there comes from these tags plus `app/apple-icon.png`.
  appleWebApp: {
    capable: true,
    title: "Expresso",
    // "default" leaves the status bar outside the web view, so the header cannot end up
    // underneath the clock — the alternative needs safe-area padding everywhere.
    statusBarStyle: "default",
  },
  // Left on, Safari reads "25:00" as a phone number and turns the countdown into a
  // tappable link, in its own blue, mid-pixel-font.
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e9d7bb" },
    { media: "(prefers-color-scheme: dark)", color: "#17100a" },
  ],
  colorScheme: "light dark",
  // The panel is width-driven and the cup is a fixed pixel grid; a pinch zoom on top of
  // that just blurs it. Capped rather than disabled, so zooming still works if needed.
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // The init script sets `data-theme` before React exists, so <html> deliberately
    // carries an attribute the server never rendered. Suppressing here is the intended
    // escape hatch, and it only covers this element's own attributes — not its subtree.
    <html
      lang="pt-BR"
      className={`${pixelFont.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        {/* Must run before first paint, or the page flashes the wrong theme. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        {/* Hand-written because Next only emits the standardised spelling. iOS below
            15.4 reads neither the manifest's `display` nor that name, and this is the
            only thing that makes it launch without Safari's chrome. */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="flex min-h-full flex-col">
        <TooltipProvider>{children}</TooltipProvider>
        <ServiceWorker />
      </body>
    </html>
  )
}
