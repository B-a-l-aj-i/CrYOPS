/**
 * Type definitions for the dynamic template configuration system.
 * These types drive all code generation — every visual property
 * (colors, typography, spacing, layout) comes from a TemplateConfig
 * instead of being hardcoded.
 */

/**
 * HSL color value as "H S% L%" string (without the hsl() wrapper),
 * matching the CSS variable format in the generated index.css.
 * Example: "173 80% 40%"
 */
export type HSLValue = string;

/**
 * Theme configuration — drives CSS custom properties in the generated site.
 */
export interface ThemeConfig {
  colors: {
    background: HSLValue;
    foreground: HSLValue;
    card: HSLValue;
    cardForeground: HSLValue;
    primary: HSLValue;
    primaryForeground: HSLValue;
    secondary: HSLValue;
    secondaryForeground: HSLValue;
    muted: HSLValue;
    mutedForeground: HSLValue;
    border: HSLValue;
    accent: HSLValue;
    accentForeground: HSLValue;
  };
  borderRadius: string;
}

/**
 * Typography configuration — drives font choices in the generated site.
 */
export interface TypographyConfig {
  fontFamily: string;
  headingFontFamily?: string;
  scale: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    "2xl": string;
    "3xl": string;
  };
  headingWeight: string;
  bodyWeight: string;
  lineHeight: string;
}

/**
 * Spacing configuration — drives padding, margins, gaps.
 */
export interface SpacingConfig {
  containerMaxWidth: string;
  containerPadding: string;
  sectionGap: string;
  cardPadding: string;
  componentGap: string;
}

/**
 * Where a component sits in the CSS Grid layout.
 */
export interface ComponentPlacement {
  componentType: "About" | "GitHubStats";
  gridColumn?: string;
  gridRow?: string;
  visible: boolean;
}

/**
 * Layout configuration — defines the CSS Grid structure of the generated site.
 */
export interface LayoutConfig {
  gridColumns: string;
  gridColumnsMobile: string;
  breakpoint: string;
  gridGap: string;
  components: ComponentPlacement[];
}

/**
 * Style config for the About component — controls avatar, heading, bio, links.
 */
export interface AboutStyleConfig {
  avatarSize: number;
  avatarBorderClass: string;
  nameClass: string;
  bioClass: string;
  linkButtonClass: string;
  sectionPadding: string;
}

/**
 * Style config for the GitHubStats component — controls cards, stats, badges.
 */
export interface GitHubStatsStyleConfig {
  cardBgClass: string;
  statValueClass: string;
  statLabelClass: string;
  sectionTitleClass: string;
  badgeClass: string;
  innerCardClass: string;
}

/**
 * Aggregated component style configs.
 */
export interface ComponentStyles {
  about: AboutStyleConfig;
  githubStats: GitHubStatsStyleConfig;
}

/**
 * The complete template configuration that drives all dynamic generation.
 * This is the single object that replaces all hardcoded values.
 */
export interface TemplateConfig {
  theme: ThemeConfig;
  typography: TypographyConfig;
  spacing: SpacingConfig;
  layout: LayoutConfig;
  componentStyles: ComponentStyles;
}
