"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useGithubStore } from "@/app/store"

/**
 * Normalizes GitHub URLs for comparison by removing trailing slashes
 * and converting to lowercase
 */
function normalizeGitHubUrl(url: string): string {
  return url.trim().toLowerCase().replace(/\/$/, "")
}

export function useAutoFillGitHubUrl() {
  const { data: session } = useSession()
  const githubUrl = useGithubStore((state) => state.githubUrl)

  useEffect(() => {
    const user = session?.user as { githubProfileUrl?: string } | undefined
    const sessionGitHubUrl = user?.githubProfileUrl

    if (!session) {
      // No session: clear the store to prevent showing previous user's data
      if (githubUrl) {
        useGithubStore.setState({ githubUrl: "" })
      }
      return
    }

    if (!sessionGitHubUrl) {
      // Session exists but no GitHub URL: don't auto-fill
      return
    }

    // Normalize URLs for comparison
    const normalizedStored = githubUrl ? normalizeGitHubUrl(githubUrl) : ""
    const normalizedSession = normalizeGitHubUrl(sessionGitHubUrl)

    // Update store if:
    // 1. Store is empty, OR
    // 2. Stored URL doesn't match current session user's URL (user switched)
    if (!normalizedStored || normalizedStored !== normalizedSession) {
      useGithubStore.setState({ githubUrl: sessionGitHubUrl })
    }
  }, [session, githubUrl])

  return githubUrl
}