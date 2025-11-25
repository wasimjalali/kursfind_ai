import { defineConfig, globalIgnores } from "eslint/config";

// Safely import Next.js ESLint configs with fallbacks
let nextVitals = [];
let nextTs = [];

try {
  const vitalsImport = await import("eslint-config-next/core-web-vitals.js");
  nextVitals = Array.isArray(vitalsImport.default) ? vitalsImport.default : [vitalsImport.default];
} catch (e) {
  console.warn("Could not load eslint-config-next/core-web-vitals.js");
}

try {
  const tsImport = await import("eslint-config-next/typescript.js");
  nextTs = Array.isArray(tsImport.default) ? tsImport.default : [tsImport.default];
} catch (e) {
  console.warn("Could not load eslint-config-next/typescript.js");
}

const eslintConfig = defineConfig([
  ...nextVitals.filter(Boolean),
  ...nextTs.filter(Boolean),
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
  ]),
  // Explicitly include files to lint
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
  },
]);

export default eslintConfig;
