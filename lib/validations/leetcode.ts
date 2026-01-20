import { z } from "zod";

// LeetCode validate endpoint schema
export const leetcodeValidateSchema = z.object({
  url: z.string().url("Invalid URL format").refine(
    (url) => {
      try {
        const urlObj = new URL(url);
        return urlObj.hostname.includes("leetcode.com");
      } catch {
        return false;
      }
    },
    { message: "Invalid LeetCode URL" }
  ),
});

// LeetCode get-details endpoint schema (same as validate for now)
export const leetcodeGetDetailsSchema = leetcodeValidateSchema;
