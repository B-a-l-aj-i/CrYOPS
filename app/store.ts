import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
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

export const useLeetCodeStore = create<LeetCodeStore>()(
  persist(
    (set) => ({
      leetCodeUrl: "",
      leetCodeData: null,
      setLeetCodeUrl: (leetCodeUrl: string) => set({ leetCodeUrl }),
      setLeetCodeData: (leetCodeData: LeetCodeData) => set({ leetCodeData }),
    }),
    {
      name: "leetcode-portfolio-data",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        leetCodeUrl: state.leetCodeUrl,
        leetCodeData: state.leetCodeData,
      }),
    }
  )
);

interface GithubStore {
    githubUrl: string;
    githubData: GitHubData | null;
    setGithubUrl: (githubUrl: string) => void;
    setGithubData: (githubData: GitHubData) => void;
  }

export const useGithubStore = create<GithubStore>()(
  persist(
    (set) => ({
      githubUrl: "",
      githubData: null,
      setGithubUrl: (githubUrl: string) => set({ githubUrl }),
      setGithubData: (githubData: GitHubData) => set({ githubData }),
    }),
    {
      name: "github-portfolio-data",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        githubUrl: state.githubUrl,
        githubData: state.githubData,
      }),
    }
  )
);



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
  topActivelyUsedRepos: SanitizedRepo[];
}

interface DeploymentStore {
  // GitHub deployment state
  isGithubDeployed: boolean;
  repoUrl: string | null;
  githubDeploymentTime: string | null;
  
  // Vercel deployment state  
  isVercelAuthPending: boolean;
  vercelUrl: string | null;
  vercelDeploymentTime: string | null;
  
  // Actions
  setGithubDeployed: (repoUrl: string) => void;
  setVercelAuthPending: (pending: boolean) => void;
  setVercelDeployed: (vercelUrl: string) => void;
  clearDeploymentData: () => void;
}

export const useDeploymentStore = create<DeploymentStore>()(
  persist(
    (set) => ({
      // GitHub deployment state
      isGithubDeployed: false,
      repoUrl: null,
      githubDeploymentTime: null,
      
      // Vercel deployment state
      isVercelAuthPending: false,
      vercelUrl: null,
      vercelDeploymentTime: null,
      
      // Actions
      setGithubDeployed: (repoUrl: string) => 
        set({ 
          isGithubDeployed: true,
          repoUrl, 
          githubDeploymentTime: new Date().toISOString() 
        }),
      setVercelAuthPending: (pending: boolean) => 
        set({ isVercelAuthPending: pending }),
      setVercelDeployed: (vercelUrl: string) => 
        set({ 
          vercelUrl, 
          vercelDeploymentTime: new Date().toISOString(),
          isVercelAuthPending: false
        }),
      clearDeploymentData: () => 
        set({ 
          isGithubDeployed: false,
          repoUrl: null, 
          githubDeploymentTime: null,
          isVercelAuthPending: false,
          vercelUrl: null, 
          vercelDeploymentTime: null
        }),
    }),
    {
      name: "deployment-tracking-data",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isGithubDeployed: state.isGithubDeployed,
        repoUrl: state.repoUrl,
        githubDeploymentTime: state.githubDeploymentTime,
        isVercelAuthPending: state.isVercelAuthPending,
        vercelUrl: state.vercelUrl,
        vercelDeploymentTime: state.vercelDeploymentTime,
      }),
    }
  )
);