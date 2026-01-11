export interface SanitizedRepo {
  author: string;
  name: string;
  description: string;
  language: string | null | "";
  languageColor: string;
  stars: number;
  forks: number;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  activityDuration: string;
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

// Type definitions for API responses
export interface GitHubUserResponse {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  html_url: string;
  location: string | null;
  company: string | null;
  blog: string | null;
  twitter_username: string | null;
  followers: number;
  following: number;
  public_repos: number;
  public_gists: number;
  created_at: string;
}

/**
 * GitHub API repository response type
 */
export interface GitHubRepoResponse {
  owner: { login: string };
  name: string;
  description: string | null;
  language: string | null | "";
  stargazers_count: number;
  forks: number;
  created_at: string;
  updated_at: string;
  pushed_at: string | null;
}

/**
 * Transformed GitHub profile data for frontend use
 * This is the sanitized version of GitHubUserResponse
 */
export interface GitHubProfile {
  username: string;
  name: string;
  bio: string;
  avatar: string;
  profileUrl: string;
  location: string;
  company: string;
  blog: string;
  twitter: string;
  followers: number;
  following: number;
  publicRepos: number;
  publicGists: number;
  createdAt: string;
}

/**
 * Language distribution data
 */
export interface LanguageDistribution {
  language: string;
  percentage: number;
  color: string;
}


export interface ContributionsResponse {
  contributions?: Array<{ date: string; count: number }>;
  total?: Record<string, number>;
}

/**
 * GitHub API issues response types
 */
export interface GitHubIssuesResponse {
  total_count: number;
  items?: Array<{ state: string }>;
}

/**
 * GitHub API issues response types
 */
export interface GitHubPRsResponse {
  total_count: number;
  items?: Array<{ state: string }>;
}

/**
 * Minimal pinned repo structure - only name is needed for matching
 */
export interface PinnedRepo {
  name: string;
}