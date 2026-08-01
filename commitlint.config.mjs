/** @type {import("@commitlint/types").UserConfig} */
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Scopes mirror the hexagon's layers, so a log line says which ring changed.
    "scope-enum": [
      2,
      "always",
      [
        "domain",
        "application",
        "infrastructure",
        "ui",
        "pixelart",
        "theme",
        "build",
        "deps",
      ],
    ],
    "scope-empty": [0],
    "body-max-line-length": [0],
  },
}
