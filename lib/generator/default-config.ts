import type { TemplateConfig } from "@/types/template-config";

/**
 * Default template configuration that exactly reproduces
 * the current hardcoded output from template-generator.ts.
 * Changing nothing here = zero visual regression.
 */
export const DEFAULT_TEMPLATE_CONFIG: TemplateConfig = {
  theme: {
    colors: {
      background: "0 0% 100%",
      foreground: "222.2 84% 4.9%",
      card: "0 0% 100%",
      cardForeground: "222.2 84% 4.9%",
      primary: "173 80% 40%",
      primaryForeground: "0 0% 100%",
      secondary: "210 40% 96.1%",
      secondaryForeground: "222.2 47.4% 11.2%",
      muted: "210 40% 96.1%",
      mutedForeground: "215.4 16.3% 46.9%",
      border: "214.3 31.8% 91.4%",
      accent: "210 40% 96.1%",
      accentForeground: "222.2 47.4% 11.2%",
    },
    borderRadius: "0.5rem",
  },
  typography: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    scale: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
    },
    headingWeight: "700",
    bodyWeight: "400",
    lineHeight: "1.6",
  },
  spacing: {
    containerMaxWidth: "80rem",
    containerPadding: "1rem",
    sectionGap: "1.5rem",
    cardPadding: "1rem",
    componentGap: "1rem",
  },
  layout: {
    gridColumns: "1fr",
    gridColumnsMobile: "1fr",
    breakpoint: "1024px",
    gridGap: "1.5rem",
    components: [
      { componentType: "About", gridColumn: "1 / -1", visible: true },
      { componentType: "GitHubStats", gridColumn: "1 / -1", visible: true },
    ],
  },
  componentStyles: {
    about: {
      avatarSize: 120,
      avatarBorderClass: "border-4 border-white shadow-xl",
      nameClass: "text-3xl font-bold text-slate-800 mb-4",
      bioClass:
        "text-xl text-slate-400 max-w-5xl mx-auto mb-6 leading-relaxed text-center",
      linkButtonClass:
        "h-11 px-6 bg-blue-50 rounded-2xl border-slate-200 text-sm font-medium text-slate-700 flex items-center gap-2 hover:shadow-sm transition-all duration-300",
      sectionPadding: "py-12",
    },
    githubStats: {
      cardBgClass: "bg-slate-50",
      statValueClass: "text-3xl font-bold text-slate-800 mb-1",
      statLabelClass: "text-xs text-slate-600 mb-1",
      sectionTitleClass: "text-lg font-semibold text-slate-800",
      badgeClass: "bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded",
      innerCardClass: "bg-white rounded-lg p-3 border border-slate-200",
    },
  },
};
