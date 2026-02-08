import type { ThemeConfig, TypographyConfig } from "@/types/template-config";

/**
 * Generate the src/index.css content from theme and typography config.
 * Produces the CSS custom properties that the generated Tailwind site uses.
 */
export function generateIndexCSS(
  theme: ThemeConfig,
  typography: TypographyConfig
): string {
  return `@import "tailwindcss";


@layer base {
  :root {
    --background: ${theme.colors.background};
    --foreground: ${theme.colors.foreground};
    --card: ${theme.colors.card};
    --card-foreground: ${theme.colors.cardForeground};
    --primary: ${theme.colors.primary};
    --primary-foreground: ${theme.colors.primaryForeground};
    --secondary: ${theme.colors.secondary};
    --secondary-foreground: ${theme.colors.secondaryForeground};
    --muted: ${theme.colors.muted};
    --muted-foreground: ${theme.colors.mutedForeground};
    --border: ${theme.colors.border};
    --accent: ${theme.colors.accent};
    --accent-foreground: ${theme.colors.accentForeground};
    --radius: ${theme.borderRadius};
  }
}

* {
  border-color: hsl(var(--border));
}

body {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  font-family: ${typography.fontFamily};
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
`;
}
