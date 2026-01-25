import { NextRequest } from "next/server";
import {
  calculateLanguageDistribution,
  extractUsernameFromUrl,
  sanitizeReposData,
  getContributionDetails,
  getMostActiveRepoThisMonth,
  getActivelyMaintainedRepos,
  getTopActivelyUsedRepos,
  validateContributionsData,
  validateReposData,
  // validatePinnedReposData,
  fetchAllRepos,
} from "@/lib/github/helpers";
import {
  type SanitizedRepo,
  type GitHubIssuesResponse,
} from "@/lib/github/types";
import { validateUserData } from "@/lib/github/helpers";

const GITHUB_CONTRIBUTIONS_API =
  "https://github-contributions-api.jogruber.de/v4";
export const GITHUB_API_BASE = "https://api.github.com";
// const PINNED_API_BASE = "https://pinned.berrysauce.dev/get";
const GITHUB_ISSUES_API = "https://api.github.com/search/issues?q=author:";
const GITHUB_PR_TYPE = "type:pr";

export async function POST(request: NextRequest) {
  let username: string | null = null;
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
    username = extractUsernameFromUrl(url);

    if (!username) {
      return Response.json(
        {
          success: false,
          error:
            "Invalid GitHub URL format. Please provide a valid GitHub profile URL.",
        },
        { status: 400 }
      );
    }

    // Fetch user details and contributions in parallel
    const [
      userResponse,
      contributionsResponse,
      // pinnedResponse,
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
      // fetch(`${PINNED_API_BASE}/${username}`, {
      //   headers: {
      //     "User-Agent": "Mozilla/5.0",
      //   },
      // }),
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

    // Handle user API response - log failures for troubleshooting
    const failures: Array<{ api: string; status: number; statusText: string }> =
      [];

    if (!userResponse.ok) {
      failures.push({
        api: "GitHub User API",
        status: userResponse.status,
        statusText: userResponse.statusText,
      });
      console.error(
        `[GitHub API] User API failed for ${username}:`,
        userResponse.status,
        userResponse.statusText
      );
    }

    if (!contributionsResponse.ok) {
      failures.push({
        api: "Contributions API",
        status: contributionsResponse.status,
        statusText: contributionsResponse.statusText,
      });
      console.error(
        `[GitHub API] Contributions API failed for ${username}:`,
        contributionsResponse.status,
        contributionsResponse.statusText
      );
    }

    // if (!pinnedResponse.ok) {
    //   failures.push({
    //     api: "Pinned Repos API",
    //     status: pinnedResponse.status,
    //     statusText: pinnedResponse.statusText,
    //   });
    //   console.error(
    //     `[GitHub API] Pinned Repos API failed for ${username}:`,
    //     pinnedResponse.status,
    //     pinnedResponse.statusText
    //   );
    // }

    if (!issuesResponse.ok) {
      failures.push({
        api: "GitHub Issues API",
        status: issuesResponse.status,
        statusText: issuesResponse.statusText,
      });
      console.error(
        `[GitHub API] Issues API failed for ${username}:`,
        issuesResponse.status,
        issuesResponse.statusText
      );
    }

    if (!prsResponse.ok) {
      failures.push({
        api: "GitHub PRs API",
        status: prsResponse.status,
        statusText: prsResponse.statusText,
      });
      console.error(
        `[GitHub API] PRs API failed for ${username}:`,
        prsResponse.status,
        prsResponse.statusText
      );
    }

    // If any API failed, return error with details
    if (failures.length > 0) {
      console.error(
        `[GitHub API] Multiple API failures for ${username}:`,
        failures.map((f) => `${f.api}: ${f.status} ${f.statusText}`).join(", ")
      );

      return Response.json(
        {
          success: false,
          error: "failed to fetch GitHub data",
        },
        {
          status: 500,
        }
      );
    }

    // Get user data
    const rawUserData = await userResponse.json();
    const userData = validateUserData(rawUserData);

    // Get repos data
    const rawReposData = await fetchAllRepos(username);
    const reposData = validateReposData(rawReposData);

    // Get pinned data and validate
    // const rawPinnedData = await pinnedResponse.json();
    // const pinnedData = validatePinnedReposData(rawPinnedData);
    // const pinnedData: any[] = []; // Use empty array for now

    // Handle contributions API response
    const rawContributionsData = await contributionsResponse.json();
    const contributionsData = validateContributionsData(rawContributionsData);

    // issues data
    const rawIssuesData = await issuesResponse.json();
    const issuesData =
      rawIssuesData && typeof rawIssuesData === "object"
        ? (rawIssuesData as GitHubIssuesResponse)
        : null;

    // prs data
    const rawPrsData = await prsResponse.json();
    const prsData =
      rawPrsData && typeof rawPrsData === "object"
        ? (rawPrsData as GitHubIssuesResponse)
        : null;

    // Get all contribution details (now accepts parsed data)
    const contributions = getContributionDetails(
      contributionsData,
      issuesData,
      prsData
    );

    // Sanitize and transform repos data
    const sanitizedReposData = sanitizeReposData(reposData);

    const languageDistribution =
      calculateLanguageDistribution(sanitizedReposData);

    const totalStars = sanitizedReposData.reduce(
      (acc: number, repo: SanitizedRepo) => acc + repo.stars,
      0
    );

    const bestRepo =
      sanitizedReposData.length > 0
        ? [...sanitizedReposData].sort(
            (a: SanitizedRepo, b: SanitizedRepo) => b.stars - a.stars
          )[0]
        : null;

    // Calculate most active repo this month
    const mostActiveRepoThisMonth =
      getMostActiveRepoThisMonth(sanitizedReposData);

    // Calculate actively maintained repos (repos with commits in last 6 months)
    const activelyMaintainedRepos =
      getActivelyMaintainedRepos(sanitizedReposData);

    // Get top 6 actively used repos
    const topActivelyUsedRepos = getTopActivelyUsedRepos(sanitizedReposData);

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

        topActivelyUsedRepos: topActivelyUsedRepos,

        profileUrl: url,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(
      `[GitHub API] Internal server error while fetching data for ${username || "unknown user"}:`,
      {
        error: errorMessage,
        timestamp: new Date().toISOString(),
      }
    );

    return Response.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
