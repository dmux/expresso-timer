import type { Metadata, Viewport } from "next"
import { Press_Start_2P } from "next/font/google"

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
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e9d7bb" },
    { media: "(prefers-color-scheme: dark)", color: "#17100a" },
  ],
  colorScheme: "light dark",
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
      </head>
      <body className="flex min-h-full flex-col">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  )
}
