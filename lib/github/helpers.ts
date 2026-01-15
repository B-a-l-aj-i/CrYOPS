import {
  type GitHubUserResponse,
  type GitHubRepoResponse,
  type ContributionsResponse,
  type LanguageDistribution,
  type GitHubIssuesResponse,
  type GitHubPRsResponse,
  type SanitizedRepo,
  type ContributionDetails,
  type PinnedRepo,
} from "@/lib/github/types";
import {
  getLanguageColor,
  calculateActivityDuration,
  yearOverYearChangePercentage,
  quarterOverQuarterChangePercentage,
  halfOverHalfChangePercentage,
  calculatePeriodMetrics,
  getCurrentStreak,
  getLongestStreak,
  getActiveYears,
  getFirstCommitInfo,
  getTotalContributions,
  getCurrentYearContributions,
  filterContributionsByPeriod,
} from "@/lib/github/utils";
import { GITHUB_API_BASE } from "@/app/api/github/get-details/route";

/**
 * Validate and sanitize user data from GitHub API
 */
export function validateUserData(userData: unknown): GitHubUserResponse {
  if (!userData || typeof userData !== "object") {
    throw new Error("Invalid user data structure");
  }

  const data = userData as Record<string, unknown>;

  return {
    login: typeof data.login === "string" ? data.login : "",
    name:
      typeof data.name === "string"
        ? data.name
        : typeof data.login === "string"
        ? data.login
        : "",
    bio: typeof data.bio === "string" ? data.bio : "",
    avatar_url: typeof data.avatar_url === "string" ? data.avatar_url : "",
    html_url: typeof data.html_url === "string" ? data.html_url : "",
    location: typeof data.location === "string" ? data.location : "",
    company: typeof data.company === "string" ? data.company : "",
    blog: typeof data.blog === "string" ? data.blog : "",
    twitter_username:
      typeof data.twitter_username === "string" ? data.twitter_username : "",
    followers: typeof data.followers === "number" ? data.followers : 0,
    following: typeof data.following === "number" ? data.following : 0,
    public_repos: typeof data.public_repos === "number" ? data.public_repos : 0,
    public_gists: typeof data.public_gists === "number" ? data.public_gists : 0,
    created_at: typeof data.created_at === "string" ? data.created_at : "",
  };
}

/**
 * Validate repos data array
 */
export function validateReposData(reposData: unknown): GitHubRepoResponse[] {
  if (!Array.isArray(reposData)) {
    console.warn("Repos data is not an array, using empty array");
    return [];
  }
  return reposData as GitHubRepoResponse[];
}

/**
 * Validate contributions data structure
 */
export function validateContributionsData(
  contributionsData: unknown
): ContributionsResponse {
  if (!contributionsData || typeof contributionsData !== "object") {
    console.warn("Invalid contributions data, using empty structure");
    return { contributions: [] };
  }

  const data = contributionsData as Record<string, unknown>;

  if (!Array.isArray(data.contributions)) {
    return { contributions: [] };
  }

  return data as ContributionsResponse;
}

/**
 * Calculate language distribution with percentages and colors
 */
export function calculateLanguageDistribution(
  repos: SanitizedRepo[]
): Array<LanguageDistribution> {
  // Filter out repos with null language or empty string
  const reposWithLanguage = repos.filter(
    (repo) => repo.language !== null && repo.language !== ""
  );

  // Count occurrences of each language
  const languageCounts = reposWithLanguage.reduce((acc, repo) => {
    const lang = repo.language as string;
    acc[lang] = (acc[lang] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate total repos with languages
  const totalReposWithLanguage = reposWithLanguage.length;

  // If no repos have languages, return empty array
  if (totalReposWithLanguage === 0) {
    return [];
  }

  // Convert to array and calculate percentages
  const languageDistribution = Object.entries(languageCounts)
    .map(([language, count]) => ({
      language,
      percentage: Math.round((count / totalReposWithLanguage) * 100),
      color: getLanguageColor(language),
    }))
    // Sort by percentage (descending)
    .sort((a, b) => b.percentage - a.percentage);

  return languageDistribution;
}

/**
 * Extract username from GitHub URL
 */
export function extractUsernameFromUrl(url: string): string | null {
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


/**
 * Validate and map pinned repos data to minimal structure
 * Only extracts the 'name' field which is all we need for matching
 */
// export function validatePinnedReposData(
//   pinnedData: unknown
// ): PinnedRepo[] {
//   if (!Array.isArray(pinnedData)) {
//     console.warn("Pinned repos data is not an array, using empty array");
//     return [];
//   }

//   return pinnedData
//     .map((item) => {
//       // Validate that item is an object with a name property
//       if (!item || typeof item !== "object") {
//         return null;
//       }

//       const pinned = item as Record<string, unknown>;
//       const name = pinned.name;

//       // Only include items with a valid name string
//       if (typeof name === "string" && name.trim().length > 0) {
//         return { name: name.trim() };
//       }

//       return null;
//     })
//     .filter((item): item is PinnedRepo => item !== null);
// }

/**
 * Sanitize and transform GitHub API repository data to SanitizedRepo format
 */
export function sanitizeReposData(
  reposData: GitHubRepoResponse[],
  // pinnedData: PinnedRepo[]
  pinnedData: any[] // Using any[] since we're commenting out pinned functionality
): SanitizedRepo[] {
  return reposData.map((repo) => {
    const activityDuration = calculateActivityDuration(
      repo.created_at,
      repo.updated_at
    );

    return {
      author: repo.owner.login,
      name: repo.name,
      description: repo.description || "",
      language: repo.language || "",
      languageColor: getLanguageColor(repo.language),
      stars: repo.stargazers_count,
      forks: repo.forks,
      isPinned: false, // Always false since we're not using pinned data
      createdAt: repo.created_at,
      updatedAt: repo.updated_at,
      pushedAt: repo.pushed_at || "",
      activityDuration: activityDuration,
    };
  });
}


/**
 * Process issues and PRs parsed data
 */
function processIssuesAndPRs(
  issuesData: GitHubIssuesResponse | null,
  prsData: GitHubPRsResponse | null
): {
  issues: { total: number; closed: number };
  pullRequests: { total: number; closed: number };
} {
  const issues = issuesData
    ? {
        total: issuesData.total_count || 0,
        closed:
          issuesData.items?.filter((item) => item.state === "closed").length ||
          0,
      }
    : { total: 0, closed: 0 };

  const pullRequests = prsData
    ? {
        total: prsData.total_count || 0,
        closed:
          prsData.items?.filter((item) => item.state === "closed").length || 0,
      }
    : { total: 0, closed: 0 };

  return {
    issues,
    pullRequests,
  };
}

/**
 * Get all contribution details including stats, streaks, metrics, and issues/PRs
 */
export function getContributionDetails(
  contributionsData: {
    contributions?: Array<{ date: string; count: number }>;
    total?: Record<string, number>;
  },
  issuesData: GitHubIssuesResponse | null,
  prsData: GitHubPRsResponse | null
): ContributionDetails {
  const contributions = contributionsData?.contributions || [];

  // Basic stats
  const total = getTotalContributions(contributions);
  const currentYear = getCurrentYearContributions(contributions);

  // Streaks
  const currentStreak = getCurrentStreak(contributions);
  const longestStreak = getLongestStreak(contributions);

  // Change percentages
  const yearOverYearChangePercentageValue =
    yearOverYearChangePercentage(contributions);
  const quarterOverQuarterChangePercentageValue =
    quarterOverQuarterChangePercentage(contributions);
  const halfOverHalfChangePercentageValue =
    halfOverHalfChangePercentage(contributions);

  // Active years
  const activeYears = getActiveYears(contributionsData);

  // First commit info
  const { firstCommitDate, codingYears } = getFirstCommitInfo(contributions);

  // Period metrics
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const contributions6Months = filterContributionsByPeriod(
    contributions,
    sixMonthsAgo
  );
  const metrics6Months = calculatePeriodMetrics(contributions6Months);

  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const contributions1Year = filterContributionsByPeriod(
    contributions,
    oneYearAgo
  );
  const metrics1Year = calculatePeriodMetrics(contributions1Year);

  const metricsOverall = calculatePeriodMetrics(contributions);

  // Process issues and PRs
  const { issues, pullRequests } = processIssuesAndPRs(issuesData, prsData);

  return {
    total,
    currentYear,
    currentStreak,
    longestStreak,
    activeYears: activeYears.map((year) => year.toString()),
    yearOverYearChangePercentage: yearOverYearChangePercentageValue,
    quarterOverQuarterChangePercentage: quarterOverQuarterChangePercentageValue,
    halfOverHalfChangePercentage: halfOverHalfChangePercentageValue,
    firstCommitDate,
    codingYears,
    pullRequests,
    issues,
    last6Months: {
      recentContributions: metrics6Months.recentContributions,
      averageDailyCommits: metrics6Months.averageDailyCommits,
      weekendPercentage: metrics6Months.weekendPercentage,
      mostActiveDay: metrics6Months.mostActiveDay,
      weekdayWeekendBreakdown: metrics6Months.weekdayWeekendBreakdown,
      bestCommit: metrics6Months.bestCommit,
    },
    last1Year: {
      recentContributions: metrics1Year.recentContributions,
      averageDailyCommits: metrics1Year.averageDailyCommits,
      weekendPercentage: metrics1Year.weekendPercentage,
      mostActiveDay: metrics1Year.mostActiveDay,
      weekdayWeekendBreakdown: metrics1Year.weekdayWeekendBreakdown,
      bestCommit: metrics1Year.bestCommit,
    },
    overall: {
      recentContributions: metricsOverall.recentContributions,
      averageDailyCommits: metricsOverall.averageDailyCommits,
      weekendPercentage: metricsOverall.weekendPercentage,
      mostActiveDay: metricsOverall.mostActiveDay,
      weekdayWeekendBreakdown: metricsOverall.weekdayWeekendBreakdown,
      bestCommit: metricsOverall.bestCommit,
    },
  };
}

/**
 * Get the most active repo this month (most recently pushed)
 */
export function getMostActiveRepoThisMonth(
  repos: SanitizedRepo[]
): SanitizedRepo | null {
  const currentMonth = new Date().getMonth();
  const currentYearForMonth = new Date().getFullYear();

  return (
    repos
      .filter((repo) => {
        if (!repo.pushedAt) return false;
        const pushed = new Date(repo.pushedAt);
        return (
          pushed.getMonth() === currentMonth &&
          pushed.getFullYear() === currentYearForMonth
        );
      })
      .sort((a, b) => {
        const dateA = new Date(a.pushedAt).getTime();
        const dateB = new Date(b.pushedAt).getTime();
        return dateB - dateA; // Most recent first
      })[0] || null
  );
}

/**
 * Get actively maintained repos (repos with commits in last 6 months)
 */
export function getActivelyMaintainedRepos(
  repos: SanitizedRepo[]
): SanitizedRepo[] {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  return repos.filter((repo) => {
    if (!repo.pushedAt) return false;
    const pushed = new Date(repo.pushedAt);
    return pushed >= sixMonthsAgo;
  });
}

/**
 * Get top 6 actively used repos (sorted by most recently pushed)
 */
export function getTopActivelyUsedRepos(
  repos: SanitizedRepo[]
): SanitizedRepo[] {
  return repos
    .filter((repo) => repo.pushedAt) // Only include repos with pushedAt data
    .sort((a, b) => {
      const dateA = new Date(a.pushedAt).getTime();
      const dateB = new Date(b.pushedAt).getTime();
      return dateB - dateA; // Most recent first
    })
    .slice(0, 6); // Take top 6
}


export async function fetchAllRepos(username: string) {
  const perPage = 100; // max allowed
  let page = 1;
  const allRepos: GitHubRepoResponse[] = [];

  while (true) {
    const res = await fetch(
      `${GITHUB_API_BASE}/users/${username}/repos?per_page=${perPage}&page=${page}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "Mozilla/5.0",
        },
      }
    );

    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status}`);
    }

    const repos = await res.json();

    if (repos.length === 0) break;

    allRepos.push(...repos);
    page++;
  }

  return allRepos;
}