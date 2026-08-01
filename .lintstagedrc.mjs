/**
 * Runs only over what is actually staged. The whole-project checks that cannot be
 * scoped to a file list (typecheck, tests, design rules) live in the pre-commit hook
 * itself — this file is strictly per-file work.
 */
export default {
  "*.{ts,tsx}": ["prettier --write", "eslint --fix --max-warnings=0"],
  "*.{css,mjs,json,md}": ["prettier --write"],
}
