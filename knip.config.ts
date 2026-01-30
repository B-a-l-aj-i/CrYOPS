import { type KnipConfig } from "knip";

const config: KnipConfig = {
  entry: ["app/**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}!"],
  ignore: [
    "**/*.d.ts",
    "**/node_modules/**",
    "**/.next/**",
    "**/out/**",
    "**/build/**",
    "**/dist/**",
    "**/coverage/**",
    "components/ui/**",
  ],
  ignoreBinaries: [
    "lint-staged",
    "markdownlint",
    "markdownlint-cli2",
    "eslint",
    "commitlint",
    "prettier",
    "stylelint",
    "cspell",
    "knip",
    "tsc",
  ],
  ignoreDependencies: [
    // Radix UI packages - used via shadcn/ui components in components/ui/
    "@radix-ui/*",
    "@tanstack/react-query",
    "class-variance-authority",
    "clsx",
    "next-auth",
    "react-github-calendar",
    "tailwind-merge",
  ],
  include: ["nsExports"],
  project: [
    "app/**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}!",
    "components/**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}!",
    "lib/**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}!",
    "hooks/**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}!",
    "**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}",
  ],
};

export default config;
