"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useGithubStore } from "@/app/store"

export function useAutoFillGitHubUrl() {
  const { data: session } = useSession()
  const githubUrl = useGithubStore((state) => state.githubUrl)

  useEffect(() => {
    if (!githubUrl && session?.user) {
      const user = session.user as { githubProfileUrl?: string }
      if (user.githubProfileUrl) {
        useGithubStore.setState({ githubUrl: user.githubProfileUrl })
      }
    }
  }, [session, githubUrl])

  return githubUrl
}