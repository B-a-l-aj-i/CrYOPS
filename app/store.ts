import { create } from "zustand";

interface LeetCodeStore {
  leetCodeUrl: string;
  leetCodeData: unknown | null;
  setLeetCodeUrl: (leetCodeUrl: string) => void;
  setLeetCodeData: (leetCodeData: unknown) => void;
}

export const useLeetCodeStore = create<LeetCodeStore>((set) => ({
  leetCodeUrl: "",
  leetCodeData: null,
  setLeetCodeUrl: (leetCodeUrl: string) => set({ leetCodeUrl }),
  setLeetCodeData: (leetCodeData: unknown) => set({ leetCodeData }),
}));

interface GithubStore {
    githubUrl: string;
    githubData: unknown | null;
    setGithubUrl: (githubUrl: string) => void;
    setGithubData: (githubData: unknown) => void;
  }

export const useGithubStore = create<GithubStore>((set) => ({
  githubUrl: "",
  githubData: null,
  setGithubUrl: (githubUrl: string) => set({ githubUrl }),
  setGithubData: (githubData: unknown) => set({ githubData }),
}));