import { NextRequest } from "next/server";

const GITHUB_CONTRIBUTIONS_API = "https://github-contributions-api.jogruber.de/v4";
const GITHUB_API_BASE = "https://api.github.com";

function extractUsernameFromUrl(url: string): string | null {
  // Handle various GitHub URL formats:
  // - https://github.com/username
  // - https://github.com/username/
  // - github.com/username
  // - username
  const patterns = [
    /^https?:\/\/(?:www\.)?github\.com\/([^\/]+)\/?$/,
    /^github\.com\/([^\/]+)\/?$/,
    /^([a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38})$/,
  ];

  for (const pattern of patterns) {
    const match = url.trim().match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return Response.json(
        {
          success: false,
          error: "GitHub URL is required",
        },
        { status: 400 }
      );
    }

    // Extract username from URL
    const username = extractUsernameFromUrl(url);

    if (!username) {
      return Response.json(
        {
          success: false,
          error: "Invalid GitHub URL format",
        },
        { status: 400 }
      );
    }

    // Fetch user details and contributions in parallel
    const [userResponse, contributionsResponse, reposResponse] = await Promise.all([
      fetch(`${GITHUB_API_BASE}/users/${username}`, {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "Mozilla/5.0",
        },
      }),
      fetch(`${GITHUB_CONTRIBUTIONS_API}/${username}`, {
        headers: {
          "User-Agent": "Mozilla/5.0",
        },
      }),
      fetch(`${GITHUB_API_BASE}/users/${username}/repos`, {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "Mozilla/5.0",
        },
      }),
    ]);

    // Handle user API response
    if (!userResponse.ok) {
      if (userResponse.status === 404) {
        return Response.json(
          {
            success: false,
            error: "GitHub user not found",
          },
          { status: 404 }
        );
      }
      return Response.json(
        {
          success: false,
          error: "Failed to fetch GitHub user data",
        },
        { status: userResponse.status }
      );
    }

    const userData = await userResponse.json();

    // Handle contributions API response
    let contributionsData = null;
    if (contributionsResponse.ok) {
      contributionsData = await contributionsResponse.json();
    }

    // Calculate statistics from contributions
    const contributions = contributionsData?.contributions || [];
    const totalContributions = contributions.reduce(
      (sum: number, contrib: { count: number }) => sum + contrib.count,
      0
    );

    // Get current year contributions
    const currentYear = new Date().getFullYear();
    const currentYearContributions = contributions.filter(
      (contrib: { date: string }) => contrib.date.startsWith(currentYear.toString())
    );
    const currentYearTotal = currentYearContributions.reduce(
      (sum: number, contrib: { count: number }) => sum + contrib.count,
      0
    );

    // Calculate current streak (consecutive days with contributions ending today)
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Create a map of dates to contribution counts for easier lookup
    const contribMap = new Map<string, number>();
    contributions.forEach((contrib: { date: string; count: number }) => {
      contribMap.set(contrib.date, contrib.count);
    });

    // Check backwards from today
    const checkDate = new Date(today);
    while (true) {
      const dateStr = checkDate.toISOString().split("T")[0];
      const count = contribMap.get(dateStr) || 0;

      if (count > 0) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        // If today has no contributions, check yesterday
        if (checkDate.getTime() === today.getTime()) {
          checkDate.setDate(checkDate.getDate() - 1);
          continue;
        }
        // Otherwise, streak is broken
        break;
      }

      // Safety check to prevent infinite loop
      if (currentStreak > 1000) break;
    }

    // Calculate longest streak (accounting for date gaps)
    // Sort contributions by date (oldest first) for streak calculation
    const sortedContribs = [...contributions].sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    let longestStreak = 0;
    let tempStreak = 0;
    let lastDate: Date | null = null;

    for (const contrib of sortedContribs) {
      const contribDate = new Date(contrib.date);
      contribDate.setHours(0, 0, 0, 0);

      if (contrib.count > 0) {
        if (lastDate) {
          const daysDiff = Math.floor(
            (contribDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          // If there's a gap of more than 1 day, streak is broken
          if (daysDiff > 1) {
            tempStreak = 1;
          } else {
            tempStreak++;
          }
        } else {
          tempStreak = 1;
        }
        longestStreak = Math.max(longestStreak, tempStreak);
        lastDate = contribDate;
      } else {
        // Reset streak if we encounter a day with no contributions
        tempStreak = 0;
        lastDate = null;
      }
    }

    // Get active years from contributions data
    const activeYears = contributionsData?.total
      ? Object.keys(contributionsData.total)
          .filter((year) => year !== "lastYear" && !isNaN(Number(year)))
          .map(Number)
          .sort()
      : [];

    // Get recent contributions (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentContributions = contributions.filter((contrib: { date: string }) => {
      const contribDate = new Date(contrib.date);
      return contribDate >= thirtyDaysAgo;
    });

    // Get repos data
    const reposData = await reposResponse.json();

    // Structure response for UI
    return Response.json({
      success: true,
      data: {
        // Basic profile info
        profile: {
          username: userData.login,
          name: userData.name || userData.login,
          bio: userData.bio || "",
          avatar: userData.avatar_url,
          profileUrl: userData.html_url,
          location: userData.location || "",
          company: userData.company || "",
          blog: userData.blog || "",
          twitter: userData.twitter_username || "",
          followers: userData.followers || 0,
          following: userData.following || 0,
          publicRepos: userData.public_repos || 0,
          publicGists: userData.public_gists || 0,
          createdAt: userData.created_at,
        },

        // Contribution statistics
        contributions: {
          total: totalContributions,
          currentYear: currentYearTotal,
          currentStreak: currentStreak,
          longestStreak: longestStreak,
          activeYears: activeYears.map((year) => year.toString()),
          recentContributions: recentContributions.length,
        },

        // Full contribution data
        contributionCalendar: {
          total: contributionsData?.total || {},
          contributions: contributions,
        },
        repos: reposData,

        // Additional data
        profileUrl: url,
      },
    });
  } catch (error) {
    console.error("Error fetching GitHub details:", error);
    return Response.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

