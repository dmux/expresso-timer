import { defineConfig, globalIgnores } from "eslint/config"
import prettier from "eslint-config-prettier/flat"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),

  // The hexagon's dependency rule, made enforceable: the core points inward only.
  // Without this, "the domain is pure" is a convention that decays on the first
  // convenient `import { useState }`.
  {
    files: ["src/domain/**/*.ts", "src/application/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["react", "react-dom", "next", "next/*", "@base-ui/*"],
              message:
                "domain/ and application/ must stay free of UI frameworks — depend on a port instead.",
            },
            {
              group: ["@/ui/*", "@/infrastructure/*"],
              message:
                "The core cannot depend on an adapter. Invert it with a port in application/ports.ts.",
            },
          ],
        },
      ],
    },
  },

  // ...and the same rule relaxed for the tests, which legitimately wire up fakes.
  {
    files: ["src/**/*.test.ts"],
    rules: { "no-restricted-imports": "off" },
  },

  // Tool config files export a bare object by contract; the rule that objects to that
  // exists for React components. lint-staged runs with --max-warnings=0, so leaving it
  // on would block every commit.
  {
    files: ["*.config.mjs", ".prettierrc.mjs", ".lintstagedrc.mjs"],
    rules: { "import/no-anonymous-default-export": "off" },
  },

  // Last: turns off every rule that would fight Prettier over formatting.
  prettier,
])

export default eslintConfig
