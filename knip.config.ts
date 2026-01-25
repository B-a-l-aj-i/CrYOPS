import type { KnipConfig } from "knip";

const config: KnipConfig = {
  entry: [
    "app/**/*.{js,jsx,ts,tsx}",
    "app/**/route.{js,jsx,ts,tsx}",
    "app/**/page.{js,jsx,ts,tsx}",
    "app/**/layout.{js,jsx,ts,tsx}",
    "app/**/loading.{js,jsx,ts,tsx}",
    "app/**/error.{js,jsx,ts,tsx}",
    "app/**/not-found.{js,jsx,ts,tsx}",
    "app/**/template.{js,jsx,ts,tsx}",
    "app/**/default.{js,jsx,ts,tsx}",
    "next.config.{js,ts,mjs}",
    "tailwind.config.{js,ts,mjs}",
    "postcss.config.{js,ts,mjs}",
  ],
  project: [
    "app/**/*.{js,jsx,ts,tsx}",
    "components/**/*.{js,jsx,ts,tsx}",
    "lib/**/*.{js,jsx,ts,tsx}",
    "hooks/**/*.{js,jsx,ts,tsx}",
  ],
  ignore: [
    "**/*.d.ts",
    "**/node_modules/**",
    ".next/**",
    "out/**",
    "build/**",
    "dist/**",
    "coverage/**",
  ],
  ignoreDependencies: [
    "@types/*",
    "eslint",
    "prettier",
    "typescript",
    "tailwindcss",
    "@tailwindcss/*",
  ],
};

export default config;
