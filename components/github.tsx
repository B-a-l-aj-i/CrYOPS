"use client"

import { useState, useEffect, useRef } from "react"
import { Github, Loader2, Check, X } from "lucide-react"
import { InputField } from "@/components/input-field"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useGithubStore } from "@/app/store"
import { useAutoFillGitHubUrl } from "@/hooks/useAutoFillGitUrl"

export function GitHub() {
  const autoFilledUrl = useAutoFillGitHubUrl()
  const [githubProfile, setGithubProfile] = useState<string>("")
  const [isValidatingGithub, setIsValidatingGithub] = useState<boolean>(false)
  const [githubValidationStatus, setGithubValidationStatus] = useState<"success" | "error" | null>(null)
  const previousAutoFilledUrlRef = useRef<string>("")

  // Sync local state with store whenever autoFilledUrl changes
  // This handles: initial auto-fill, account switches, and sign-out
  useEffect(() => {
    const previousUrl = previousAutoFilledUrlRef.current
    const currentUrl = autoFilledUrl || ""
    
    // Only update if the auto-filled URL actually changed
    if (previousUrl !== currentUrl) {
      setGithubProfile(currentUrl)
      setGithubValidationStatus(null)
      previousAutoFilledUrlRef.current = currentUrl
    }
  }, [autoFilledUrl])

  const handleValidateGithub = async () => {
    if (!githubProfile.trim()) return
    
    setIsValidatingGithub(true)
    setGithubValidationStatus(null)
    try {
      // Extract username from URL or use as-is
      const username = githubProfile.replace(/^https?:\/\/(www\.)?github\.com\//, "").replace(/\/$/, "")
      const response = await fetch(`/api/github/validate?username=${encodeURIComponent(username)}`)
      const data = await response.json()
      
      if (data.valid) {
        setGithubValidationStatus("success")
        useGithubStore.setState({ githubUrl: githubProfile })
      } else {
        setGithubValidationStatus("error")
      }
    } catch (error) {
      console.error("Validation failed:", error)
      setGithubValidationStatus("error")
    } finally {
      setIsValidatingGithub(false)
    }
  }

  // Reset validation status when input changes
  const handleGithubProfileChange = (value: string) => {
    setGithubProfile(value)
    setGithubValidationStatus(null)
  }

  return (
    <InputField
      label="GitHub Profile"
      placeholder="github.com/username"
      icon={Github}
      value={githubProfile}
      onChange={handleGithubProfileChange}
      rightButton={
        githubProfile.trim() ? (
          <Button
            onClick={handleValidateGithub}
            disabled={isValidatingGithub}
            size="sm"
            variant="outline"
            className={cn(
              "h-7 px-3 text-xs",
              githubValidationStatus === "success" && "bg-green-50 border-green-500 text-green-700 hover:bg-green-100",
              githubValidationStatus === "error" && "bg-red-50 border-red-500 text-red-700 hover:bg-red-100"
            )}
          >
            {isValidatingGithub ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : githubValidationStatus === "success" ? (
              <Check className="h-3 w-3" />
            ) : githubValidationStatus === "error" ? (
              <X className="h-3 w-3" />
            ) : (
              "Validate"
            )}
          </Button>
        ) : undefined
      }
    />
  )
}