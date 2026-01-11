import { create } from "zustand";
import {
  type SanitizedRepo,
  type ContributionDetails,
  type GitHubProfile,
  type LanguageDistribution,
} from "@/lib/github/types";

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
  profile: GitHubProfile;
  profileUrl: string;
  contributions: ContributionDetails;
  sanitizedReposData: SanitizedRepo[];
  languageDistribution: LanguageDistribution[];
  totalStars: number;
  bestRepo: SanitizedRepo | null;
  mostActiveRepoThisMonth: SanitizedRepo | null;
  activelyMaintainedRepos: SanitizedRepo[];
}