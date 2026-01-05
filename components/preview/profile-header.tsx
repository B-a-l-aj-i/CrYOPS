"use client"

import { Github, Code, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface ProfileHeaderProps {
  profile: {
    name: string
    description: string
    image: string | null
    githubUrl: string
    leetcodeUrl: string
    linkedinUrl: string
  }
  isSelected?: boolean
  onClick?: () => void
}

export function ProfileHeader({
  profile,
  isSelected = false,
  onClick,
}: ProfileHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center space-y-4 py-8 transition-all",
        isSelected && "ring-2 ring-primary ring-offset-2 rounded-lg"
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      {/* Profile Picture */}
      <div className="relative h-24 w-24 overflow-hidden rounded-full bg-muted">
        {profile.image ? (
          <Image
            src={profile.image}
            alt={profile.name || "Profile"}
            width={96}
            height={96}
            className="rounded-full"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/40">
            <span className="text-2xl font-semibold text-primary">
              {profile.name?.[0]?.toUpperCase() || "U"}
            </span>
          </div>
        )}
      </div>

      {/* Name */}
      <h1 className="text-3xl font-bold">
        {profile.name || "Your Name"}
      </h1>

      {/* Description */}
      <p className="max-w-2xl text-center text-muted-foreground">
        {profile.description ||
          "Full Stack Engineer passionate about algorithms, clean code, and building scalable systems."}
      </p>

      {/* Social Links */}
      <div className="flex gap-3">
        {profile.githubUrl && (
          <Button variant="outline" size="sm" asChild>
            <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </a>
          </Button>
        )}
        {profile.leetcodeUrl && (
          <Button variant="outline" size="sm" asChild>
            <a href={profile.leetcodeUrl} target="_blank" rel="noopener noreferrer">
              <Code className="mr-2 h-4 w-4" />
              LeetCode
            </a>
          </Button>
        )}
        {profile.linkedinUrl && (
          <Button variant="outline" size="sm" asChild>
            <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">
              <Linkedin className="mr-2 h-4 w-4" />
              LinkedIn
            </a>
          </Button>
        )}
      </div>
    </div>
  )
}

