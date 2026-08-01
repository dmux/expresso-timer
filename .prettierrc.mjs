/** @type {import("prettier").Config} */
export default {
  semi: false,
  singleQuote: false,
  // Wide enough that the pixel-art utility classes (`text-[calc(var(--px)*3)]`)
  // do not each land on their own line.
  printWidth: 90,
  trailingComma: "es5",

  plugins: ["prettier-plugin-tailwindcss"],
  // Tailwind v4 has no JS config; the plugin reads the theme from the CSS entry point
  // so it can sort our custom utilities (pixel-bevel, transition-pixel) correctly.
  tailwindStylesheet: "./src/app/globals.css",
  tailwindFunctions: ["cn", "cva"],
}
