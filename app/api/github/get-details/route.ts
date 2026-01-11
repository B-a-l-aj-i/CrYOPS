import { NextRequest } from "next/server";
import {
  calculateLanguageDistribution,
  extractUsernameFromUrl,
  sanitizeReposData,
  SanitizedRepo,
  getContributionDetails,
  getMostActiveRepoThisMonth,
  getActivelyMaintainedRepos,
} from "@/lib/github";

const GITHUB_CONTRIBUTIONS_API =
  "https://github-contributions-api.jogruber.de/v4";
const GITHUB_API_BASE = "https://api.github.com";
const PINNED_API_BASE = "https://pinned.berrysauce.dev/get";
const GITHUB_ISSUES_API = "https://api.github.com/search/issues?q=author:";
const GITHUB_PR_TYPE = "type:pr";

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
    const [
      userResponse,
      contributionsResponse,
      reposResponse,
      pinnedResponse,
      issuesResponse,
      prsResponse,
    ] = await Promise.all([
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
      fetch(`${PINNED_API_BASE}/${username}`, {
        headers: {
          "User-Agent": "Mozilla/5.0",
        },
      }),
      fetch(`${GITHUB_ISSUES_API}${username}`, {
        headers: {
          "User-Agent": "Mozilla/5.0",
        },
      }),
      fetch(`${GITHUB_ISSUES_API}${username}+${GITHUB_PR_TYPE}`, {
        headers: {
          "User-Agent": "Mozilla/5.0",
        },
      }),
    ]);

    // Handle user API response
    if (!userResponse.ok || !contributionsResponse.ok 
      || !reposResponse.ok || !pinnedResponse.ok 
      || !issuesResponse.ok || !prsResponse.ok 
      || userResponse.status === 404 || contributionsResponse.status === 404 
      || reposResponse.status === 404 || pinnedResponse.status === 404 
      || issuesResponse.status === 404 || prsResponse.status === 404 ) {
      return Response.json(
        {
          success: false,
          error: "Failed to fetch GitHub data",
        },
        { status: userResponse.status || 
          contributionsResponse.status || 
          reposResponse.status || 
          pinnedResponse.status || 
          issuesResponse.status || 
          prsResponse.status || 
          404 }
      );
    }

    // Get user data
    const userData = await userResponse.json();

    // Get repos data
    const reposData = await reposResponse.json();

    // Get pinned data
    const pinnedData = await pinnedResponse.json();

    // Handle contributions API response
    const contributionsData = await contributionsResponse.json();
    

    // Get all contribution details
    const contributions = await getContributionDetails(
      contributionsData,
      issuesResponse,
      prsResponse
    );


    // Sanitize and transform repos data
    const sanitizedReposData = sanitizeReposData(reposData, pinnedData);

    const languageDistribution =
      calculateLanguageDistribution(sanitizedReposData);

    const totalStars = sanitizedReposData.reduce(
      (acc: number, repo: SanitizedRepo) => acc + repo.stars,
      0
    );

    const bestRepo = sanitizedReposData
      .sort((a: SanitizedRepo, b: SanitizedRepo) => b.stars - a.stars)
      .slice(0, 1);

    // Calculate most active repo this month
    const mostActiveRepoThisMonth = getMostActiveRepoThisMonth(
      sanitizedReposData
    );

    // Calculate actively maintained repos (repos with commits in last 6 months)
    const activelyMaintainedRepos = getActivelyMaintainedRepos(
      sanitizedReposData
    );

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
        contributions,

        bestRepo,

        sanitizedReposData,

        languageDistribution,

        totalStars,

        mostActiveRepoThisMonth,

        activelyMaintainedRepos: activelyMaintainedRepos,

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
