import { z } from "zod";

// GitHub validate endpoint schema
export const githubValidateSchema = z.object({
  username: z.string().min(1, "Username is required"),
});

// GitHub get-details endpoint schema
export const githubGetDetailsSchema = z.object({
  url: z
    .string()
    .url("Invalid URL format")
    .refine(
      (url) => {
        try {
          const urlObj = new URL(url);
          return urlObj.hostname === "github.com";
        } catch {
          return false;
        }
      },
      {
        message:
          "Invalid GitHub URL format. Please provide a valid GitHub profile URL.",
      }
    ),
});

// Template config schema (optional — when omitted, defaults are used)
const templateConfigSchema = z
  .object({
    theme: z.object({
      colors: z.object({
        background: z.string(),
        foreground: z.string(),
        card: z.string(),
        cardForeground: z.string(),
        primary: z.string(),
        primaryForeground: z.string(),
        secondary: z.string(),
        secondaryForeground: z.string(),
        muted: z.string(),
        mutedForeground: z.string(),
        border: z.string(),
        accent: z.string(),
        accentForeground: z.string(),
      }),
      borderRadius: z.string(),
    }),
    typography: z.object({
      fontFamily: z.string(),
      headingFontFamily: z.string().optional(),
      scale: z.object({
        xs: z.string(),
        sm: z.string(),
        base: z.string(),
        lg: z.string(),
        xl: z.string(),
        "2xl": z.string(),
        "3xl": z.string(),
      }),
      headingWeight: z.string(),
      bodyWeight: z.string(),
      lineHeight: z.string(),
    }),
    spacing: z.object({
      containerMaxWidth: z.string(),
      containerPadding: z.string(),
      sectionGap: z.string(),
      cardPadding: z.string(),
      componentGap: z.string(),
    }),
    layout: z.object({
      gridColumns: z.string(),
      gridColumnsMobile: z.string(),
      breakpoint: z.string(),
      gridGap: z.string(),
      components: z.array(
        z.object({
          componentType: z.enum(["About", "GitHubStats"]),
          gridColumn: z.string().optional(),
          gridRow: z.string().optional(),
          visible: z.boolean(),
        })
      ),
    }),
    componentStyles: z.object({
      about: z.object({
        avatarSize: z.number(),
        avatarBorderClass: z.string(),
        nameClass: z.string(),
        bioClass: z.string(),
        linkButtonClass: z.string(),
        sectionPadding: z.string(),
      }),
      githubStats: z.object({
        cardBgClass: z.string(),
        statValueClass: z.string(),
        statLabelClass: z.string(),
        sectionTitleClass: z.string(),
        badgeClass: z.string(),
        innerCardClass: z.string(),
      }),
    }),
  })
  .optional();

// GitHub publish endpoint schema
export const githubPublishSchema = z.object({
  githubData: z.object({
    profile: z.object({
      username: z.string().min(1, "Username is required"),
      name: z.string(),
      bio: z.string(),
      avatar: z.string(),
      profileUrl: z.string(),
      location: z.string(),
      company: z.string(),
      blog: z.string(),
      twitter: z.string(),
      followers: z.number(),
      following: z.number(),
      publicRepos: z.number(),
      publicGists: z.number(),
      createdAt: z.string(),
    }),
    contributions: z.any(),
    bestRepo: z.any(),
    sanitizedReposData: z.array(z.any()),
    languageDistribution: z.array(z.any()),
    totalStars: z.number(),
    mostActiveRepoThisMonth: z.any(),
    activelyMaintainedRepos: z.array(z.any()),
    topActivelyUsedRepos: z.array(z.any()),
    profileUrl: z.string(),
  }),
  templateConfig: templateConfigSchema,
});

/** Request body type for the GitHub publish endpoint (schema as source of truth) */
export type GithubPublishBody = z.infer<typeof githubPublishSchema>;

/** Validated githubData shape from the publish endpoint */
export type GithubPublishData = GithubPublishBody["githubData"];
