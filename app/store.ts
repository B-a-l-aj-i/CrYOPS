import { create } from "zustand";

interface LeetCodeStore {
  leetCodeUrl: string;
  leetCodeData: LeetCodeData | null;
  setLeetCodeUrl: (leetCodeUrl: string) => void;
  setLeetCodeData: (leetCodeData: LeetCodeData) => void;
}

export const useLeetCodeStore = create<LeetCodeStore>((set) => ({
  leetCodeUrl: "",
  leetCodeData: null,
  setLeetCodeUrl: (leetCodeUrl: string) => set({ leetCodeUrl }),
  setLeetCodeData: (leetCodeData: LeetCodeData) => set({ leetCodeData }),
}));

interface GithubStore {
    githubUrl: string;
    githubData: GitHubData | null;
    setGithubUrl: (githubUrl: string) => void;
    setGithubData: (githubData: GitHubData) => void;
  }

export const useGithubStore = create<GithubStore>((set) => ({
  githubUrl: "",
  githubData: null,
  setGithubUrl: (githubUrl: string) => set({ githubUrl }),
  setGithubData: (githubData: GitHubData) => set({ githubData }),
}));



export interface LeetCodeData {
  rank: number;
  stats: {
    totalSolved: number;
    easySolved: number;
    totalEasy: number;
    mediumSolved: number;
    totalMedium: number;
    hardSolved: number;
    totalHard: number;
    acceptanceRate: number;
  };
  recentBadges: Array<{ displayName: string; icon: string }>;
  upcomingBadges: Array<{ name: string; icon?: string }>;
  streak: {
    current: number;
    longest: number;
    activeYears: string[];
  };
  randomProblem: {
    title: string;
    url: string;
  } | null;
  profile: {
    username: string;
  };
  recentSubmissions: Array<{ title: string; timestamp: string; lang: string; statusDisplay: string }>;
  profileUrl: string;
  contestRating?: number;
}

export interface GitHubData {
  profile: {
    username: string;
    name: string;
    bio: string;
    avatar: string;
    followers: number;
    publicRepos: number;
    profileUrl: string;
    location?: string;
    blog?: string;
  };
  profileUrl: string;
  contributions: {
    total: number;
    currentStreak: number;
    longestStreak: number;
    activeYears: string[];
  };
  contributionCalendar: {
    contributions: Array<{ date: string; count: number; level?: number }>;
  };
  repos: Array<{
    name: string;
    description: string | null;
    language: string | null;
    stargazers_count: number;
    forks_count?: number;
    html_url: string;
  }>;
  totalStars?: number;
  totalCommits?: number;
}