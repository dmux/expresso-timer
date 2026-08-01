import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

/**
 * Node environment on purpose: the domain and application layers are pure, so nothing
 * under test needs a DOM, a canvas or a real timer. That is the payoff of the hexagon.
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
})
