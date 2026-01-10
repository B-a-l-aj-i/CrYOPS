"use client"

import { useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { useGithubStore } from "@/app/store"

/**
 * Gets a unique identifier for the session user to detect account switches
 */
function getSessionUserId(session: { user?: { email?: string | null; name?: string | null } } | null): string | null {
  if (!session?.user) return null
  // Use email as primary identifier, fallback to name
  return session.user.email || session.user.name || null
}

export function useAutoFillGitHubUrl() {
  const { data: session } = useSession()
  const githubUrl = useGithubStore((state) => state.githubUrl)
  const previousSessionUserIdRef = useRef<string | null>(null)

  useEffect(() => {
    // Read current store value inside effect to avoid dependency on githubUrl
    // This prevents the effect from re-running when user manually updates the store
    const currentStoreUrl = useGithubStore.getState().githubUrl
    const user = session?.user as { githubProfileUrl?: string; email?: string | null; name?: string | null } | undefined
    const sessionGitHubUrl = user?.githubProfileUrl
    const currentSessionUserId = getSessionUserId(session)

    if (!session) {
      // No session: clear the store to prevent showing previous user's data
      if (currentStoreUrl) {
        useGithubStore.setState({ githubUrl: "" })
      }
      previousSessionUserIdRef.current = null
      return
    }

    if (!sessionGitHubUrl) {
      // Session exists but no GitHub URL: don't auto-fill
      previousSessionUserIdRef.current = currentSessionUserId
      return
    }

    // Check if the user switched accounts by comparing session user IDs
    const userSwitched = previousSessionUserIdRef.current !== null && 
                         previousSessionUserIdRef.current !== currentSessionUserId

    // Update store only if:
    // 1. Store is empty (initial auto-fill), OR
    // 2. User switched accounts (detected by session user ID change)
    // Do NOT update if user manually entered a different URL for the same account
    // (when same user and store already has a URL, respect the user's manual entry)
    const shouldAutoFill = !currentStoreUrl || userSwitched

    if (shouldAutoFill) {
      useGithubStore.setState({ githubUrl: sessionGitHubUrl })
    }

    // Update the ref to track the current session user
    previousSessionUserIdRef.current = currentSessionUserId
  }, [session]) // Only depend on session, not githubUrl

  return githubUrl
}