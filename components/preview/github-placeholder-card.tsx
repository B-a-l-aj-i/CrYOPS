"use client"

import { Github, Star } from "lucide-react"
import { cn } from "@/lib/utils"

export function GitHubPlaceholderCard() {
  // Generate placeholder contribution graph (7x52 grid)
  const weeks = 52
  const daysPerWeek = 7
  const contributionLevels = [0, 1, 2, 3, 4] // 0 = no activity, 4 = high activity

  const getContributionColor = (level: number) => {
    const colors = [
      "bg-gray-100",
      "bg-green-200",
      "bg-green-400",
      "bg-green-600",
      "bg-green-800",
    ]
    return colors[level] || colors[0]
  }

  // Generate random contribution data
  const contributions = Array.from({ length: weeks * daysPerWeek }, () =>
    Math.floor(Math.random() * 5)
  )

  return (
    <div className="rounded-lg border bg-card p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Github className="h-5 w-5" />
          <h3 className="text-lg font-semibold">GitHub Activity</h3>
        </div>
        <span className="text-sm text-muted-foreground">1,240 Contributions</span>
      </div>

      {/* Metrics */}
      <div className="mb-4 grid grid-cols-3 gap-4">
        <div>
          <div className="text-2xl font-bold">42</div>
          <div className="text-xs text-muted-foreground">REPOS</div>
        </div>
        <div>
          <div className="text-2xl font-bold">1.2k</div>
          <div className="text-xs text-muted-foreground">STARS</div>
        </div>
        <div>
          <div className="text-2xl font-bold">340</div>
          <div className="text-xs text-muted-foreground">FOLLOWERS</div>
        </div>
      </div>

      {/* Contribution Graph */}
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>Last year&apos;s contributions</span>
          <div className="flex items-center gap-1">
            <span>Less</span>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={cn(
                    "h-3 w-3 rounded",
                    getContributionColor(level)
                  )}
                />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: weeks }).map((_, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {Array.from({ length: daysPerWeek }).map((_, dayIndex) => {
                const index = weekIndex * daysPerWeek + dayIndex
                const level = contributions[index]
                return (
                  <div
                    key={dayIndex}
                    className={cn(
                      "h-3 w-3 rounded",
                      getContributionColor(level)
                    )}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Repositories */}
      <div className="mb-4">
        <h4 className="mb-2 text-sm font-medium">Recent Activity</h4>
        <div className="space-y-2">
          <div className="rounded border p-2">
            <div className="font-medium text-sm">portfolio-v2</div>
            <div className="text-xs text-muted-foreground">
              Modern developer portfolio built with React
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs">
              <span className="text-blue-500">TypeScript</span>
              <Star className="h-3 w-3" />
              <span>128</span>
            </div>
          </div>
          <div className="rounded border p-2">
            <div className="font-medium text-sm">algorithm-visualizer</div>
            <div className="text-xs text-muted-foreground">
              Visualizing sorting algorithms in real-time
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs">
              <span className="text-yellow-500">JavaScript</span>
              <Star className="h-3 w-3" />
              <span>84</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pinned Repositories */}
      <div>
        <h4 className="mb-2 text-sm font-medium">Pinned Repositories</h4>
        <p className="mb-2 text-xs text-muted-foreground">
          A quick peek at projects I&apos;m proud of
        </p>
        <div className="space-y-2">
          <div className="rounded border p-2">
            <div className="font-medium text-sm">ds-and-algos-notes</div>
            <div className="text-xs text-muted-foreground">
              Handwritten explanations for 150+ problems.
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs">
              <span className="rounded bg-orange-100 px-1.5 py-0.5 text-orange-700">
                LeetCode
              </span>
              <span className="text-blue-500">Python</span>
              <Star className="h-3 w-3" />
              <span>37</span>
            </div>
          </div>
          <div className="rounded border p-2">
            <div className="font-medium text-sm">leetcode-streak-tra...</div>
            <div className="text-xs text-muted-foreground">
              CLI tool to sync and track your solving streak.
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs">
              <span className="rounded bg-purple-100 px-1.5 py-0.5 text-purple-700">
                Tooling
              </span>
              <span className="text-yellow-500">JavaScript</span>
              <Star className="h-3 w-3" />
              <span>52</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

