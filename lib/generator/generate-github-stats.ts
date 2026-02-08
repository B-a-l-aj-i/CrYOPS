import type {
  GitHubStatsStyleConfig,
  SpacingConfig,
} from "@/types/template-config";

/**
 * Generate the GitHubStats.tsx component content.
 * Includes the stats grid, coding habits, contribution window,
 * repo list, and the GitHub contribution calendar.
 */
export function generateGitHubStatsComponent(
  styles: GitHubStatsStyleConfig,
  spacing: SpacingConfig
): string {
  return `import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card"
import { GitHubCalendar } from "react-github-calendar"
import type { GitHubData, SanitizedRepo } from "../types"

interface GitHubStatsProps {
  data: GitHubData
}

export function GitHubStats({ data }: GitHubStatsProps) {
  const {
    profile,
    contributions,
    mostActiveRepoThisMonth,
    activelyMaintainedRepos,
    totalStars,
    bestRepo,
    topActivelyUsedRepos,
  } = data

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-${spacing.sectionGap.replace("rem", "").replace(".", "")}">
        <div className="space-y-${spacing.sectionGap.replace("rem", "").replace(".", "")}">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="${styles.cardBgClass}">
              <CardContent className="p-${spacing.cardPadding.replace("rem", "").replace(".", "")}">
                <div className="${styles.statLabelClass}">
                  TOTAL CONTRIBUTIONS
                </div>
                <div className="${styles.statValueClass}">
                  {contributions.total.toLocaleString()}
                </div>
                <div className="text-xs text-green-600">
                  +{contributions.yearOverYearChangePercentage || 0}% vs last year
                </div>
              </CardContent>
            </Card>

            <Card className="${styles.cardBgClass}">
              <CardContent className="p-${spacing.cardPadding.replace("rem", "").replace(".", "")}">
                <div className="${styles.statLabelClass}">
                  TOTAL ISSUES/PULL REQUESTS
                </div>
                <div className="${styles.statValueClass}">
                  {contributions.issues.total + contributions.pullRequests.total}
                </div>
                <div className="text-xs text-slate-600">
                  {contributions.issues.closed + contributions.pullRequests.closed} closed
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-${spacing.cardPadding.replace("rem", "").replace(".", "")}">
                <div className="${styles.statLabelClass}">
                  AVERAGE COMMITS (OVERALL)
                </div>
                <div className="${styles.statValueClass}">
                  {contributions.overall.averageDailyCommits.toFixed(1)} / day
                </div>
              </CardContent>
            </Card>

            <Card className="${styles.cardBgClass}">
              <CardContent className="p-${spacing.cardPadding.replace("rem", "").replace(".", "")}">
                <div className="${styles.statLabelClass}">
                  BEST REPO STAR COUNT
                </div>
                <div className="${styles.statValueClass}">
                  {bestRepo?.stars || 0} ⭐
                </div>
                <a href={"https://github.com/" + bestRepo?.author + "/" + bestRepo?.name} target="_blank" rel="noopener noreferrer">
                  <div className="text-xs text-slate-600">
                    {bestRepo?.name || "N/A"}
                  </div>
                </a>
              </CardContent>
            </Card>
          </div>

          {mostActiveRepoThisMonth && (
            <Card className="${styles.cardBgClass}">
              <CardContent className="p-${spacing.cardPadding.replace("rem", "").replace(".", "")}">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <a
                        href={
                          "https://github.com/" +
                          mostActiveRepoThisMonth.author +
                          "/" +
                          mostActiveRepoThisMonth.name
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <h3 className="${styles.sectionTitleClass.replace("text-lg", "").trim()}">
                          {mostActiveRepoThisMonth.author}/{mostActiveRepoThisMonth.name}
                        </h3>
                      </a>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">
                      {mostActiveRepoThisMonth.description || "No description"}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-slate-600">
                      <div className="flex items-center gap-1">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: mostActiveRepoThisMonth.languageColor,
                          }}
                        />
                        <span>{mostActiveRepoThisMonth.language || "N/A"}</span>
                      </div>
                      <span>{mostActiveRepoThisMonth.stars} ⭐</span>
                      <span>{mostActiveRepoThisMonth.activityDuration}</span>
                    </div>
                  </div>
                  <div className="${styles.badgeClass}">
                    Most used this month
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="${styles.cardBgClass}">
            <CardHeader className="pb-3">
              <CardTitle className="${styles.sectionTitleClass}">Coding Habits</CardTitle>
              <CardDescription className="text-xs">
                Based on last 90 days of activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="${styles.innerCardClass}">
                  <div className="${styles.statLabelClass}">
                    Most active Day(Overall)
                  </div>
                  <div className="text-lg font-semibold text-slate-800 mb-1">
                    {contributions.overall.mostActiveDay}
                  </div>
                  <div className="text-xs text-slate-500">
                    {contributions.last6Months.weekendPercentage}% weekend
                  </div>
                </div>

                <div className="${styles.innerCardClass}">
                  <div className="${styles.statLabelClass}">
                    Longest streak
                  </div>
                  <div className="text-lg font-semibold text-slate-800 mb-1">
                    {contributions.longestStreak} days
                  </div>
                  <div className="text-xs text-slate-500">No days skipped</div>
                </div>

                <div className="${styles.innerCardClass}">
                  <div className="${styles.statLabelClass}">
                    Weekday vs weekend
                  </div>
                  <div className="text-lg font-semibold text-slate-800 mb-1">
                    {contributions.last6Months.weekdayWeekendBreakdown.weekday}% /{" "}
                    {contributions.last6Months.weekdayWeekendBreakdown.weekend}%
                  </div>
                  <div className="text-xs text-slate-500">
                    Weekend refactors
                  </div>
                </div>

                <div className="${styles.innerCardClass}">
                  <div className="${styles.statLabelClass}">
                    Active years
                  </div>
                  <div className="text-sm font-medium text-slate-800">
                    {contributions.activeYears.join(" · ")}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="${styles.cardBgClass} pb-3">
            <CardHeader className="pb-3">
              <CardTitle className="${styles.sectionTitleClass}">Contribution Window</CardTitle>
              <CardDescription className="text-xs">
                Across owned & contributed repos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="${styles.innerCardClass} p-4">
                <h4 className="text-sm font-semibold text-slate-800 mb-3">
                  Last 6 months
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">
                      Total Commits
                    </div>
                    <div className="text-lg font-bold text-slate-800">
                      {contributions.last6Months.recentContributions.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">
                      Weekend Activity
                    </div>
                    <div className="text-lg font-bold text-slate-800">
                      {contributions.last6Months.weekendPercentage}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Best Day</div>
                    <div className="text-sm font-medium text-slate-800">
                      {contributions.last6Months.bestCommit?.date || "N/A"}
                    </div>
                    <div className="text-xs text-slate-500">
                      {contributions.last6Months.bestCommit?.count || 0} commits
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">Avg per day:</span>
                    <span className="font-medium text-slate-800">
                      {contributions.last6Months.averageDailyCommits.toFixed(1)} commits
                    </span>
                  </div>
                </div>
              </div>

              <div className="${styles.innerCardClass} p-4">
                <h4 className="text-sm font-semibold text-slate-800 mb-3">
                  Last 12 months
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">
                      Total Commits
                    </div>
                    <div className="text-lg font-bold text-slate-800">
                      {contributions.last1Year.recentContributions.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">
                      Weekend Activity
                    </div>
                    <div className="text-lg font-bold text-slate-800">
                      {contributions.last1Year.weekendPercentage}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Best Day</div>
                    <div className="text-sm font-medium text-slate-800">
                      {contributions.last1Year.bestCommit?.date || "N/A"}
                    </div>
                    <div className="text-xs text-slate-500">
                      {contributions.last1Year.bestCommit?.count || 0} commits
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">Avg per day:</span>
                    <span className="font-medium text-slate-800">
                      {contributions.last1Year.averageDailyCommits.toFixed(1)} commits
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
            <div className="px-6 pb-4">
              <p className="text-xs text-slate-500">
                These stats update automatically from your GitHub profile - no
                manual input required.
              </p>
            </div>
          </Card>
        </div>

        <div className="space-y-${spacing.sectionGap.replace("rem", "").replace(".", "")}">
          <div className="grid grid-cols-2 gap-x-4 gap-y-6">
            <Card className="${styles.cardBgClass}">
              <CardContent className="p-6 pb-7">
                <div className="${styles.statLabelClass}">
                  Public repositories
                </div>
                <div className="text-2xl font-bold text-slate-800 mb-1">
                  {profile.publicRepos}
                </div>
                <div className="text-xs text-slate-600">
                  {activelyMaintainedRepos.length} actively maintained
                </div>
              </CardContent>
            </Card>

            <Card className="${styles.cardBgClass}">
              <CardContent className="p-6 pb-7">
                <div className="${styles.statLabelClass}">Total stars</div>
                <div className="text-2xl font-bold text-slate-800 mb-1">
                  {totalStars.toLocaleString()} ⭐
                </div>
              </CardContent>
            </Card>

            <Card className="${styles.cardBgClass}">
              <CardContent className="p-6 pb-7">
                <div className="${styles.statLabelClass}">Followers</div>
                <div className="text-2xl font-bold text-slate-800 mb-1">
                  {profile.followers}
                </div>
                <div className="text-xs text-slate-600">
                  Following {profile.following}
                </div>
              </CardContent>
            </Card>

            <Card className="${styles.cardBgClass}">
              <CardContent className="p-6 pb-7">
                <div className="${styles.statLabelClass}">
                  First commit on GitHub
                </div>
                <div className="text-lg font-semibold text-slate-800 mb-1">
                  {contributions.firstCommitDate
                    ? contributions.firstCommitDate
                        .split(" ")
                        .slice(1)
                        .join(" ")
                    : "N/A"}
                </div>
                <div className="text-xs text-slate-600">
                  {contributions.codingYears || "N/A"}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Actively Used Repos */}
          <div className="space-y-3">
            <h3 className="${styles.sectionTitleClass}">Active Repos</h3>
            {topActivelyUsedRepos.map((repo: SanitizedRepo, index: number) => (
              <Card key={index} className="${styles.cardBgClass}">
                <CardContent className="p-${spacing.cardPadding.replace("rem", "").replace(".", "")}">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <a
                          href={
                            "https://github.com/" +
                            repo.author +
                            "/" +
                            repo.name
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <h3 className="font-semibold text-slate-800">
                            {repo.author}/{repo.name}
                          </h3>
                        </a>
                      </div>
                      <p className="text-sm text-slate-600 mb-3 line-clamp-1">
                        {repo.description || "No description"}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-600">
                        <div className="flex items-center gap-1">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: repo.languageColor }}
                          />
                          <span>{repo.language || "N/A"}</span>
                        </div>
                        <span>{repo.stars} ⭐</span>
                        <span>{repo.activityDuration}</span>
                      </div>
                    </div>
                    <div className="${styles.badgeClass}">
                      #{index + 1}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* GitHub Contribution Calendar */}
      <div className="w-full max-w-fit mx-auto px-4 mt-12">
        <GitHubCalendarWrapper username={data.profile.username} />
      </div>
    </div>
  )
}

function GitHubCalendarWrapper({ username }: { username: string }) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative min-h-[200px]">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50/90 rounded-lg z-10 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            <p className="text-xs text-slate-500 font-medium">
              Loading contribution data...
            </p>
          </div>
        </div>
      )}
      <div
        className={\`\${
          isLoading ? "opacity-0 pointer-events-none" : "opacity-100"
        } transition-opacity duration-500\`}
      >
        <div className="overflow-x-auto">
          <GitHubCalendar
            username={username}
            blockSize={19.5}
            blockMargin={4}
            fontSize={14}
            blockRadius={1}
            colorScheme="light"
            theme={{
              light: [
                "#ebedf0",
                "#9be9a8",
                "#40c463",
                "#30a14e",
                "#216e39",
              ],
            }}
            style={{
              maxWidth: "100%",
              margin: "0 auto",
            }}
          />
        </div>
      </div>
    </div>
  )
}
`;
}
