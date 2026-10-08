import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

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
    // Otomatik analiz dosyaları (araclar/model-hazirla.mjs; node_modules'tan kopyalanmış derlenmiş kod).
    "public/model/**",
    "public/ort/**",
    "public/vendor/**",
  ]),
]);

export default eslintConfig;
