import { NextRequest } from "next/server";

const LEETCODE_API_BASE = "https://alfa-leetcode-api.onrender.com";

function extractUsernameFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    
    // Handle leetcode.com/u/username or leetcode.com/username (with or without trailing slash)
    const match = pathname.match(/\/(?:u\/)?([^\/]+)\/?$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return Response.json(
        { valid: false, error: "URL is required" },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return Response.json(
        { valid: false, error: "Invalid URL format" },
        { status: 400 }
      );
    }

    // Extract username from URL
    const username = extractUsernameFromUrl(url);
    console.log("Username:", username);
    if (!username) {
      return Response.json(
        { valid: false, error: "Could not extract username from URL" },
        { status: 400 }
      );
    }

    // Validate LeetCode domain
    const urlObj = new URL(url);
    if (!urlObj.hostname.includes("leetcode.com")) {
      return Response.json(
        { valid: false, error: "Invalid LeetCode URL" },
        { status: 400 }
      );
    }

    // Validate profile using Alfa LeetCode API
    try {
      const response = await fetch(`${LEETCODE_API_BASE}/${username}`, {
        headers: {
          "User-Agent": "Mozilla/5.0",
        },
      });

      console.log("Response:", response);
      if (response.status !== 200) {
        return Response.json({
          valid: false,
          success: false,
          error: "Failed to validate profile",
        });
      }

      return Response.json({
        valid: true,
        success: true,
        data: {
          username: username,
          profileUrl: url,
        },
      });
    } catch (error) {
      console.error("LeetCode API error:", error);
      return Response.json({
        valid: false,
        success: false,
        error: "Failed to validate profile",
      });
    }
  } catch (error) {
    console.error("Validation error:", error);
    return Response.json(
      { valid: false, success: false, error: "Failed to validate profile" },
      { status: 500 }
    );
  }
}

