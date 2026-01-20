import { z } from "zod";

// GitHub validate endpoint schema
export const githubValidateSchema = z.object({
  username: z.string().min(1, "Username is required"),
});

// GitHub get-details endpoint schema
export const githubGetDetailsSchema = z.object({
  url: z.string().url("Invalid URL format").refine(
    (url) => {
      try {
        const urlObj = new URL(url);
        return urlObj.hostname === "github.com" || urlObj.hostname === "www.github.com";
      } catch {
        return false;
      }
    },
    { message: "Invalid GitHub URL format. Please provide a valid GitHub profile URL." }
  ),
});

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
});
