import { z } from "zod";

// Vercel deploy endpoint schema
export const vercelDeploySchema = z.object({
  githubRepoUrl: z.string().url("Invalid URL format").refine(
    (url) => {
      const githubUrlMatch = url.match(/github\.com\/([^\/]+)\/([^\/\?#]+)/);
      return githubUrlMatch !== null;
    },
    { message: "Invalid GitHub repository URL format. Expected format: github.com/owner/repo" }
  ),
  vercelPat: z.string().min(1, "Vercel Personal Access Token is required"),
});
