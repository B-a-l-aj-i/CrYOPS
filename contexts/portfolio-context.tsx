"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

interface LeetCodeData {
  rank: number
  stats: {
    totalSolved: number
    totalQuestions: number
    easySolved: number
    totalEasy: number
    mediumSolved: number
    totalMedium: number
    hardSolved: number
    totalHard: number
    acceptanceRate: number
    totalSubmissions: number
  }
  submissionBreakdown: Array<{
    difficulty: string
    count: number
    submissions: number
  }>
  recentBadges: Array<any>
  upcomingBadges: Array<any>
  streak: {
    current: number
    longest: number
    totalActiveDays: number
    activeYears: string[]
  }
  contestRanking: any
  recentSubmissions: Array<any>
  randomProblem: {
    title: string
    titleSlug: string
    url: string
  } | null
  profile: {
    username: string
    reputation: number
    contributionPoint: number
  }
  submissionCalendar: Record<string, number>
  profileUrl: string
}

interface CardLayout {
  x: number
  y: number
  width: number
  height: number
}

interface PortfolioData {
  leetcode: LeetCodeData | null
  profile: {
    name: string
    description: string
    image: string | null
    githubUrl: string
    leetcodeUrl: string
    linkedinUrl: string
  }
  layouts: {
    profile: CardLayout
    leetcode: CardLayout
    github: CardLayout
    techStack: CardLayout
    recentActivity: CardLayout
  }
}

interface PortfolioContextType {
  portfolioData: PortfolioData
  setLeetCodeData: (data: LeetCodeData | null) => void
  updateProfile: (profile: Partial<PortfolioData["profile"]>) => void
  updateLayout: (cardId: keyof PortfolioData["layouts"], layout: Partial<CardLayout>) => void
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined)

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    leetcode: null,
    profile: {
      name: "",
      description: "",
      image: null,
      githubUrl: "",
      leetcodeUrl: "",
      linkedinUrl: "",
    },
    layouts: {
      profile: { x: 0, y: 0, width: 800, height: 200 },
      leetcode: { x: 0, y: 250, width: 500, height: 600 },
      github: { x: 550, y: 250, width: 500, height: 600 },
      techStack: { x: 0, y: 900, width: 500, height: 200 },
      recentActivity: { x: 550, y: 900, width: 500, height: 200 },
    },
  })

  const setLeetCodeData = (data: LeetCodeData | null) => {
    setPortfolioData((prev) => ({
      ...prev,
      leetcode: data,
      profile: {
        ...prev.profile,
        leetcodeUrl: data?.profileUrl || prev.profile.leetcodeUrl,
      },
    }))
  }

  const updateProfile = (profile: Partial<PortfolioData["profile"]>) => {
    setPortfolioData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        ...profile,
      },
    }))
  }

  const updateLayout = (cardId: keyof PortfolioData["layouts"], layout: Partial<CardLayout>) => {
    setPortfolioData((prev) => ({
      ...prev,
      layouts: {
        ...prev.layouts,
        [cardId]: {
          ...prev.layouts[cardId],
          ...layout,
        },
      },
    }))
  }

  return (
    <PortfolioContext.Provider
      value={{
        portfolioData,
        setLeetCodeData,
        updateProfile,
        updateLayout,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  )
}

export function usePortfolio() {
  const context = useContext(PortfolioContext)
  if (context === undefined) {
    throw new Error("usePortfolio must be used within a PortfolioProvider")
  }
  return context
}

