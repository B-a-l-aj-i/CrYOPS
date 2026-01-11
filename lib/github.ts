export interface SanitizedRepo {
    "author": string,
    "name": string,
    "description": string,
    "language": string,
    "languageColor": string,
    "stars": number,
    "forks": number,
    "isPinned": boolean,
    "createdAt": string,
    "updatedAt": string,
    "pushedAt": string,
    "activityDuration": string
}

export interface PeriodMetrics {
    recentContributions: number;
    averageDailyCommits: number;
    weekendPercentage: number;
    mostActiveDay: string | null;
    weekdayWeekendBreakdown: { weekday: number; weekend: number };
    bestCommit: { date: string; count: number } | null;
}

export interface ContributionDetails {
    total: number;
    currentYear: number;
    currentStreak: number;
    longestStreak: number;
    activeYears: string[];
    yearOverYearChangePercentage: number | null;
    quarterOverQuarterChangePercentage: number | null;
    halfOverHalfChangePercentage: number | null;
    firstCommitDate: string | null;
    codingYears: string | null;
    pullRequests: { total: number; closed: number };
    issues: { total: number; closed: number };
    last6Months: PeriodMetrics;
    last1Year: PeriodMetrics;
    overall: PeriodMetrics;
}

/**
 * Calculate language distribution with percentages and colors
 */
export function calculateLanguageDistribution(
    repos: Array<SanitizedRepo>
): Array<{ language: string; percentage: number; color: string }> {
    // Filter out repos with null language
    const reposWithLanguage = repos.filter((repo) => repo.language !== null);

    // Count occurrences of each language
    const languageCounts = reposWithLanguage.reduce(
        (acc, repo) => {
            const lang = repo.language!;
            acc[lang] = (acc[lang] || 0) + 1;
            return acc;
        },
        {} as Record<string, number>
    );

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

export function getLanguageColor(language: string | null): string {
    if (!language) return "#cccccc"; // Default gray for null/unknown languages

    const languageColors: Record<string, string> = {
        TypeScript: "#3178c6",
        JavaScript: "#f1e05a",
        Python: "#3776ab",
        Java: "#ed8b00",
        HTML: "#e34c26",
        CSS: "#563d7c",
        "C++": "#f34b7d",
        C: "#555555",
        "C#": "#239120",
        Go: "#00add8",
        Rust: "#dea584",
        PHP: "#4f5d95",
        Ruby: "#701516",
        Swift: "#fa7343",
        Kotlin: "#a97bff",
        Dart: "#00b4ab",
        Shell: "#89e051",
        PowerShell: "#012456",
        R: "#198ce7",
        Scala: "#c22d40",
        Perl: "#39457e",
        Lua: "#000080",
        Haskell: "#5e5086",
        Clojure: "#db5855",
        Elixir: "#6e4a7e",
        Erlang: "#b83998",
        OCaml: "#3be133",
        Julia: "#a270ba",
        MATLAB: "#e16737",
        Vue: "#4fc08d",
        React: "#61dafb",
        Angular: "#dd0031",
        Svelte: "#ff3e00",
        "Jupyter Notebook": "#da5b0b",
        Markdown: "#083fa1",
        YAML: "#cb171e",
        JSON: "#292929",
        Dockerfile: "#384d54",
        Makefile: "#427819",
        SQL: "#e38c00",
        GraphQL: "#e10098",
        Assembly: "#6e4c13",
        Vim: "#199f4b",
        Emacs: "#7f5ab6",
        TeX: "#3d6117",
        LaTeX: "#008080",
    };

    return languageColors[language] || "#cccccc";
}

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

export function formatDateWithOrdinal(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' }).toLowerCase();
    const year = date.getFullYear();

    // Get ordinal suffix (1st, 2nd, 3rd, 4th, etc.)
    const getOrdinalSuffix = (n: number): string => {
        const j = n % 10;
        const k = n % 100;
        if (j === 1 && k !== 11) return 'st';
        if (j === 2 && k !== 12) return 'nd';
        if (j === 3 && k !== 13) return 'rd';
        return 'th';
    };

    const ordinalSuffix = getOrdinalSuffix(day);
    const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);

    return `${day}${ordinalSuffix} ${capitalizedMonth} ${year}`;
}

/**
 * Calculate activity duration string from created and updated dates
 */
function calculateActivityDuration(createdAt: string, updatedAt: string): string {
    if (!createdAt || !updatedAt) return "";

    const created = new Date(createdAt);
    const updated = new Date(updatedAt);
    const diffMs = updated.getTime() - created.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    const years = Math.floor(diffDays / 365);
    if (years > 0) {
        return `Active ${years} ${years === 1 ? 'yr' : 'yrs'}`;
    }

    const months = Math.floor(diffDays / 30);
    if (months > 0) {
        return `Active ${months} ${months === 1 ? 'month' : 'months'}`;
    }

    const weeks = Math.floor(diffDays / 7);
    if (weeks > 0) {
        return `Active ${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;
    }

    const days = Math.floor(diffDays);
    return `Active ${days} ${days === 1 ? 'day' : 'days'}`;
}

/**
 * GitHub API repository response type
 */
interface GitHubRepoResponse {
    owner: { login: string };
    name: string;
    description: string | null;
    language: string | null;
    stargazers_count: number;
    forks: number;
    created_at: string;
    updated_at: string;
    pushed_at: string | null;
}

/**
 * Sanitize and transform GitHub API repository data to SanitizedRepo format
 */
export function sanitizeReposData(
    reposData: GitHubRepoResponse[],
    pinnedData: SanitizedRepo[]
): SanitizedRepo[] {
    return reposData.map((repo) => {
        const activityDuration = calculateActivityDuration(repo.created_at, repo.updated_at);

        return {
            author: repo.owner.login,
            name: repo.name,
            description: repo.description || "",
            language: repo.language || "",
            languageColor: getLanguageColor(repo.language),
            stars: repo.stargazers_count,
            forks: repo.forks,
            isPinned: pinnedData.some((pinned) => pinned.name === repo.name),
            createdAt: repo.created_at,
            updatedAt: repo.updated_at,
            pushedAt: repo.pushed_at || "",
            activityDuration: activityDuration,
        };
    });
}

// Calculate year-over-year % change (last 12 months vs previous 12 months)
export const yearOverYearChangePercentage = ((contributions: { date: string; count: number }[]) => {
    const now = new Date();
    now.setHours(23, 59, 59, 999); // End of today

    // Last 12 months: from 12 months ago to today
    const last12MonthsStart = new Date(now);
    last12MonthsStart.setFullYear(last12MonthsStart.getFullYear() - 1);
    last12MonthsStart.setHours(0, 0, 0, 0);

    // Previous 12 months: from 24 months ago to 12 months ago
    const prev12MonthsStart = new Date(now);
    prev12MonthsStart.setFullYear(prev12MonthsStart.getFullYear() - 2);
    prev12MonthsStart.setHours(0, 0, 0, 0);
    const prev12MonthsEnd = new Date(last12MonthsStart);
    prev12MonthsEnd.setDate(prev12MonthsEnd.getDate() - 1);
    prev12MonthsEnd.setHours(23, 59, 59, 999);

    // Get contributions for last 12 months
    const last12MonthsContributions = contributions.filter((contrib: { date: string }) => {
        const contribDate = new Date(contrib.date);
        return contribDate >= last12MonthsStart && contribDate <= now;
    });
    const last12MonthsTotal = last12MonthsContributions.reduce(
        (sum: number, contrib: { count: number }) => sum + contrib.count,
        0
    );

    // Get contributions for previous 12 months
    const prev12MonthsContributions = contributions.filter((contrib: { date: string }) => {
        const contribDate = new Date(contrib.date);
        return contribDate >= prev12MonthsStart && contribDate <= prev12MonthsEnd;
    });
    const prev12MonthsTotal = prev12MonthsContributions.reduce(
        (sum: number, contrib: { count: number }) => sum + contrib.count,
        0
    );

    if (prev12MonthsTotal === 0) return null;
    return Math.round(((last12MonthsTotal - prev12MonthsTotal) / prev12MonthsTotal) * 100);
});

// Calculate quarter-over-quarter % change (last 3 months vs previous 3 months)
export const quarterOverQuarterChangePercentage = ((contributions: { date: string; count: number }[]) => {
    const now = new Date();
    now.setHours(23, 59, 59, 999); // End of today

    // Last 3 months: from 3 months ago to today
    const last3MonthsStart = new Date(now);
    last3MonthsStart.setMonth(last3MonthsStart.getMonth() - 3);
    last3MonthsStart.setHours(0, 0, 0, 0);

    // Previous 3 months: from 6 months ago to 3 months ago
    const prev3MonthsStart = new Date(now);
    prev3MonthsStart.setMonth(prev3MonthsStart.getMonth() - 6);
    prev3MonthsStart.setHours(0, 0, 0, 0);
    const prev3MonthsEnd = new Date(last3MonthsStart);
    prev3MonthsEnd.setDate(prev3MonthsEnd.getDate() - 1);
    prev3MonthsEnd.setHours(23, 59, 59, 999);

    // Get contributions for last 3 months
    const last3MonthsContributions = contributions.filter((contrib: { date: string }) => {
        const contribDate = new Date(contrib.date);
        return contribDate >= last3MonthsStart && contribDate <= now;
    });
    const last3MonthsTotal = last3MonthsContributions.reduce(
        (sum: number, contrib: { count: number }) => sum + contrib.count,
        0
    );

    // Get contributions for previous 3 months
    const prev3MonthsContributions = contributions.filter((contrib: { date: string }) => {
        const contribDate = new Date(contrib.date);
        return contribDate >= prev3MonthsStart && contribDate <= prev3MonthsEnd;
    });
    const prev3MonthsTotal = prev3MonthsContributions.reduce(
        (sum: number, contrib: { count: number }) => sum + contrib.count,
        0
    );

    if (prev3MonthsTotal === 0) return null;
    return Math.round(((last3MonthsTotal - prev3MonthsTotal) / prev3MonthsTotal) * 100);
});

// Calculate half-over-half % change (last 6 months vs previous 6 months)
export const halfOverHalfChangePercentage = ((contributions: { date: string; count: number }[]) => {
    const now = new Date();
    now.setHours(23, 59, 59, 999); // End of today

    // Last 6 months: from 6 months ago to today
    const last6MonthsStart = new Date(now);
    last6MonthsStart.setMonth(last6MonthsStart.getMonth() - 6);
    last6MonthsStart.setHours(0, 0, 0, 0);

    // Previous 6 months: from 12 months ago to 6 months ago
    const prev6MonthsStart = new Date(now);
    prev6MonthsStart.setMonth(prev6MonthsStart.getMonth() - 12);
    prev6MonthsStart.setHours(0, 0, 0, 0);
    const prev6MonthsEnd = new Date(last6MonthsStart);
    prev6MonthsEnd.setDate(prev6MonthsEnd.getDate() - 1);
    prev6MonthsEnd.setHours(23, 59, 59, 999);

    // Get contributions for last 6 months
    const last6MonthsContributions = contributions.filter((contrib: { date: string }) => {
        const contribDate = new Date(contrib.date);
        return contribDate >= last6MonthsStart && contribDate <= now;
    });
    const last6MonthsTotal = last6MonthsContributions.reduce(
        (sum: number, contrib: { count: number }) => sum + contrib.count,
        0
    );

    // Get contributions for previous 6 months
    const prev6MonthsContributions = contributions.filter((contrib: { date: string }) => {
        const contribDate = new Date(contrib.date);
        return contribDate >= prev6MonthsStart && contribDate <= prev6MonthsEnd;
    });
    const prev6MonthsTotal = prev6MonthsContributions.reduce(
        (sum: number, contrib: { count: number }) => sum + contrib.count,
        0
    );

    if (prev6MonthsTotal === 0) return null;
    return Math.round(((last6MonthsTotal - prev6MonthsTotal) / prev6MonthsTotal) * 100);
});


  // Helper function to calculate metrics for a specific time period
export const calculatePeriodMetrics = (
    filteredContributions: Array<{ date: string; count: number }>
  ) => {
    const periodTotal = filteredContributions.reduce(
      (sum: number, contrib: { count: number }) => sum + contrib.count,
      0
    );

    // Calculate weekend vs weekday contributions
    let weekendTotal = 0;
    let weekdayTotal = 0;
    const dayOfWeekCounts: Record<string, number> = {};
    
    filteredContributions.forEach((contrib: { date: string; count: number }) => {
      const date = new Date(contrib.date);
      const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      
      // Count by day name for most active day
      dayOfWeekCounts[dayName] = (dayOfWeekCounts[dayName] || 0) + contrib.count;
      
      // Separate weekend vs weekday
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        weekendTotal += contrib.count;
      } else {
        weekdayTotal += contrib.count;
      }
    });

    const weekendPercentage = periodTotal > 0 
      ? Math.round((weekendTotal / periodTotal) * 100) 
      : 0;
    const weekdayPercentage = periodTotal > 0 
      ? Math.round((weekdayTotal / periodTotal) * 100) 
      : 0;

    // Find most active day of week
    const mostActiveDay = Object.entries(dayOfWeekCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || null;

    // Calculate average daily commits
    const daysWithCommits = filteredContributions.filter((c: { count: number }) => c.count > 0).length;
    const averageDailyCommits = daysWithCommits > 0 
      ? Math.round((periodTotal / daysWithCommits) * 10) / 10 
      : 0;

    // Get best commit date (date with highest count)
    const bestCommitData = filteredContributions
      .filter((c: { count: number }) => c.count > 0)
      .sort((a: { count: number }, b: { count: number }) => b.count - a.count)[0];
    
    const bestCommit = bestCommitData ? {
      date: formatDateWithOrdinal(bestCommitData.date),
      count: bestCommitData.count,
    } : null;

    return {
      recentContributions: periodTotal,
      averageDailyCommits,
      weekendPercentage,
      mostActiveDay,
      weekdayWeekendBreakdown: {
        weekday: weekdayPercentage,
        weekend: weekendPercentage,
      },
      bestCommit,
    };
  };

/**
 * Calculate current streak (consecutive days with contributions ending today)
 */
export function getCurrentStreak(
  contributions: Array<{ date: string; count: number }>
): number {
  let currentStreak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Create a map of dates to contribution counts for easier lookup
  const contribMap = new Map<string, number>();
  contributions.forEach((contrib) => {
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

  return currentStreak;
}

/**
 * Calculate longest consecutive streak from contributions
 */
function getLongestStreak(
  contributions: Array<{ date: string; count: number }>
): number {
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

  return longestStreak;
}

/**
 * Extract active years from contributions data
 */
function getActiveYears(contributionsData: {
  total?: Record<string, number>;
}): number[] {
  if (!contributionsData?.total) return [];
  
  return Object.keys(contributionsData.total)
    .filter((year) => year !== "lastYear" && !isNaN(Number(year)))
    .map(Number)
    .sort();
}

/**
 * Get first commit date and coding years
 */
function getFirstCommitInfo(
  contributions: Array<{ date: string; count: number }>
): { firstCommitDate: string | null; codingYears: string | null } {
  const firstContribution = contributions
    .filter((c) => c.count > 0)
    .sort(
      (a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    )[0];

  if (!firstContribution) {
    return { firstCommitDate: null, codingYears: null };
  }

  const firstCommitDate = formatDateWithOrdinal(firstContribution.date);
  const firstDate = new Date(firstContribution.date);
  const yearsSince =
    (new Date().getTime() - firstDate.getTime()) /
    (1000 * 60 * 60 * 24 * 365);
  const codingYears = `Coding for ${Math.ceil(yearsSince)}+ years`;

  return { firstCommitDate, codingYears };
}

/**
 * Sum all contribution counts
 */
function getTotalContributions(
  contributions: Array<{ date: string; count: number }>
): number {
  return contributions.reduce(
    (sum, contrib) => sum + contrib.count,
    0
  );
}

/**
 * Sum contributions for current year
 */
function getCurrentYearContributions(
  contributions: Array<{ date: string; count: number }>
): number {
  const currentYear = new Date().getFullYear();
  const currentYearContributions = contributions.filter((contrib) =>
    contrib.date.startsWith(currentYear.toString())
  );
  
  return currentYearContributions.reduce(
    (sum, contrib) => sum + contrib.count,
    0
  );
}

/**
 * Filter contributions by date range (from startDate to now)
 */
function filterContributionsByPeriod(
  contributions: Array<{ date: string; count: number }>,
  startDate: Date
): Array<{ date: string; count: number }> {
  return contributions.filter((contrib) => {
    const contribDate = new Date(contrib.date);
    return contribDate >= startDate;
  });
}

/**
 * Process issues and PRs API responses
 */
async function processIssuesAndPRs(
  issuesResponse: Response,
  prsResponse: Response
): Promise<{
  issues: { total: number; closed: number };
  pullRequests: { total: number; closed: number };
}> {
  let issuesData = { total: 0, closed: 0 };
  let pullRequestsData = { total: 0, closed: 0 };

  if (issuesResponse.ok) {
    try {
      const issuesResponseData = await issuesResponse.json();
      const closedIssuesCount =
        issuesResponseData.items?.filter(
          (item: { state: string }) => item.state === "closed"
        ).length || 0;

      issuesData = {
        total: issuesResponseData.total_count || 0,
        closed: closedIssuesCount,
      };
    } catch (error) {
      console.error("Error parsing issues response:", error);
    }
  }

  if (prsResponse.ok) {
    try {
      const prsResponseData = await prsResponse.json();
      const closedPRsCount =
        prsResponseData.items?.filter(
          (item: { state: string }) => item.state === "closed"
        ).length || 0;

      pullRequestsData = {
        total: prsResponseData.total_count || 0,
        closed: closedPRsCount,
      };
    } catch (error) {
      console.error("Error parsing PRs response:", error);
    }
  }

  return {
    issues: issuesData,
    pullRequests: pullRequestsData,
  };
}

/**
 * Get all contribution details including stats, streaks, metrics, and issues/PRs
 */
export async function getContributionDetails(
  contributionsData: {
    contributions?: Array<{ date: string; count: number }>;
    total?: Record<string, number>;
  },
  issuesResponse: Response,
  prsResponse: Response
): Promise<ContributionDetails> {
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
  const { issues, pullRequests } = await processIssuesAndPRs(
    issuesResponse,
    prsResponse
  );

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