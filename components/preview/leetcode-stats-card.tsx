"use client"

import { Code, Target, Clock, Trophy, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface LeetCodeStatsCardProps {
  data: {
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
    }
    recentBadges: Array<any>
    upcomingBadges: Array<any>
    streak: {
      current: number
      longest: number
      activeYears: string[]
    }
    randomProblem: {
      title: string
      titleSlug: string
      url: string
    } | null
  }
  isSelected?: boolean
  onClick?: () => void
}

export function LeetCodeStatsCard({
  data,
  isSelected = false,
  onClick,
}: LeetCodeStatsCardProps) {
  const {
    rank,
    stats,
    recentBadges,
    upcomingBadges,
    streak,
    randomProblem,
  } = data

  const totalProgress = (stats.totalSolved / stats.totalQuestions) * 100
  const easyProgress = (stats.easySolved / stats.totalEasy) * 100
  const mediumProgress = (stats.mediumSolved / stats.totalMedium) * 100
  const hardProgress = (stats.hardSolved / stats.totalHard) * 100

  // Calculate circular progress for total solved
  const radius = 60
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (totalProgress / 100) * circumference

  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-6 transition-all",
        isSelected && "ring-2 ring-primary ring-offset-2"
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg font-semibold">LeetCode Stats</h3>
        </div>
        <span className="text-sm text-muted-foreground">Rank: {rank.toLocaleString()}</span>
      </div>

      {/* Circular Progress and Stats */}
      <div className="mb-6 flex items-center gap-8">
        {/* Circular Progress */}
        <div className="relative flex-shrink-0">
          <svg className="h-32 w-32 -rotate-90 transform">
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-muted"
            />
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="text-teal-500 transition-all"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold">{stats.totalSolved}</span>
            <span className="text-xs text-muted-foreground">Solved</span>
          </div>
        </div>

        {/* Difficulty Breakdown */}
        <div className="flex-1 space-y-3">
          {/* Easy */}
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span>Easy</span>
              </span>
              <span className="text-muted-foreground">
                {stats.easySolved} / {stats.totalEasy}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-green-500 transition-all"
                style={{ width: `${easyProgress}%` }}
              />
            </div>
          </div>

          {/* Medium */}
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <span>Med</span>
              </span>
              <span className="text-muted-foreground">
                {stats.mediumSolved} / {stats.totalMedium}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-yellow-500 transition-all"
                style={{ width: `${mediumProgress}%` }}
              />
            </div>
          </div>

          {/* Hard */}
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-pink-500" />
                <span>Hard</span>
              </span>
              <span className="text-muted-foreground">
                {stats.hardSolved} / {stats.totalHard}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-pink-500 transition-all"
                style={{ width: `${hardProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Badges */}
      {recentBadges.length > 0 && (
        <div className="mb-4">
          <h4 className="mb-2 text-sm font-medium">Recent Badges</h4>
          <div className="flex gap-2">
            {recentBadges.slice(0, 3).map((badge, index) => (
              <div
                key={index}
                className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted"
              >
                <Trophy className="h-6 w-6 text-yellow-500" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Badges and Streak */}
      <div className="mb-4 grid grid-cols-2 gap-4">
        {/* Upcoming Badges */}
        <div>
          <h4 className="mb-2 text-sm font-medium">Upcoming Badges</h4>
          <div className="space-y-2">
            {upcomingBadges && upcomingBadges.length > 0 ? (
              upcomingBadges.slice(0, 3).map((badge: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-2 rounded-lg border p-2"
                >
                  {index === 0 && <Target className="h-4 w-4 text-teal-500" />}
                  {index === 1 && <Clock className="h-4 w-4 text-orange-500" />}
                  {index === 2 && <Trophy className="h-4 w-4 text-orange-500" />}
                  <div className="flex-1 text-xs">
                    <div className="font-medium">{badge.name || "Milestone"}</div>
                    <div className="text-muted-foreground">
                      {badge.progress || badge.description || "In progress"}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="flex items-center gap-2 rounded-lg border p-2">
                  <Target className="h-4 w-4 text-teal-500" />
                  <div className="flex-1 text-xs">
                    <div className="font-medium">500 Problems Milestone</div>
                    <div className="text-muted-foreground">18 more to go</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg border p-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <div className="flex-1 text-xs">
                    <div className="font-medium">100 Day Streak</div>
                    <div className="text-muted-foreground">12 days left</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg border p-2">
                  <Trophy className="h-4 w-4 text-orange-500" />
                  <div className="flex-1 text-xs">
                    <div className="font-medium">Contest Specialist</div>
                    <div className="text-muted-foreground">2 more contests needed</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Streak Info */}
        <div className="rounded-lg border bg-blue-50 p-3">
          <h4 className="mb-2 text-sm font-medium">Streak</h4>
          <div className="space-y-1 text-xs">
            <div>
              <span className="text-muted-foreground">Current: </span>
              <span className="font-semibold">{streak.current} days</span>
            </div>
            <div>
              <span className="text-muted-foreground">Longest: </span>
              <span className="font-semibold">{streak.longest} days</span>
            </div>
            <div>
              <span className="text-muted-foreground">Active Years: </span>
              <span className="font-semibold">
                {streak.activeYears.join(" · ")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Challenge */}
      {randomProblem && (
        <div className="rounded-lg border bg-muted/30 p-4">
          <h4 className="mb-2 text-sm font-medium">Daily Challenge</h4>
          <p className="mb-3 text-xs text-muted-foreground">
            Get a random problem you already solved, sent right to your inbox.
          </p>
          <Button size="sm" variant="outline" className="w-full">
            <Mail className="mr-2 h-4 w-4" />
            Send me a challenge
          </Button>
        </div>
      )}
    </div>
  )
}

