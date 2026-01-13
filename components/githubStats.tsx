"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { GitHubData } from "@/app/store";

interface GitHubStatsProps {
  data: GitHubData;
}

export function GitHubStats({ data }: GitHubStatsProps) {
  const {
    profile,
    contributions,
    languageDistribution,
    mostActiveRepoThisMonth,
    activelyMaintainedRepos,
    totalStars,
    bestRepo,
    sanitizedReposData,
  } = data;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* Left Column: Deep GitHub Stats */}
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-slate-50">
              <CardContent className="p-4">
                <div className="text-xs text-slate-600 mb-1">
                  TOTAL CONTRIBUTIONS
                </div>
                <div className="text-3xl font-bold text-slate-800 mb-1">
                  {contributions.total.toLocaleString()}
                </div>
                <div className="text-xs text-green-600">
                  +{contributions.yearOverYearChangePercentage || 0}% vs last
                  year
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-50">
              <CardContent className="p-4">
                <div className="text-xs text-slate-600 mb-1">
                  TOTAL ISSUES/PULL REQUESTS
                </div>
                <div className="text-3xl font-bold text-slate-800 mb-1">
                  {contributions.issues.total +
                    contributions.pullRequests.total}
                </div>
                <div className="text-xs text-slate-600">
                  {contributions.issues.closed +
                    contributions.pullRequests.closed}{" "}
                  closed
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-xs text-slate-600 mb-1">
                  AVERAGE COMMITS (OVERALL)
                </div>
                <div className="text-3xl font-bold text-slate-800 mb-1">
                  {contributions.overall.averageDailyCommits.toFixed(1)} / day
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-50">
              <CardContent className="p-4">
                <div className="text-xs text-slate-600 mb-1">
                  BEST REPO STAR COUNT
                </div>
                <div className="text-3xl font-bold text-slate-800 mb-1">
                  {bestRepo?.stars || 0} ⭐
                </div>
                <a href={"https://github.com/"+bestRepo?.author+"/"+bestRepo?.name} target="_blank" rel="noopener noreferrer">
                <div className="text-xs text-slate-600">
                  {bestRepo?.name || 0}
                </div>
                </a>
              </CardContent>
            </Card>
          </div>

          {/* Language Distribution */}
          {/* <Card className="bg-slate-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Language Distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {languageDistribution.map((lang) => (
                <div key={lang.language} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: lang.color }}
                      />
                      <span className="font-medium text-slate-700">
                        {lang.language}
                      </span>
                    </div>
                    <span className="text-slate-600">{lang.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${lang.percentage}%`,
                        backgroundColor: lang.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card> */}

          {/* Most Used Repository Card */}
          {mostActiveRepoThisMonth && (
            <Card className="bg-slate-50">
              <CardContent className="p-4">
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
                        <h3 className="font-semibold text-slate-800">
                          {mostActiveRepoThisMonth.author}/
                          {mostActiveRepoThisMonth.name}
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
                            backgroundColor:
                              mostActiveRepoThisMonth.languageColor,
                          }}
                        />
                        <span>{mostActiveRepoThisMonth.language || "N/A"}</span>
                      </div>
                      <span>{mostActiveRepoThisMonth.stars} ⭐</span>
                      <span>{mostActiveRepoThisMonth.activityDuration}</span>
                    </div>
                  </div>
                  <div className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                    Most used this month
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Coding Habits Section */}
          <Card className="bg-slate-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Coding Habits</CardTitle>
              <CardDescription className="text-xs">
                Based on last 90 days of activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-3 border border-slate-200">
                  <div className="text-xs text-slate-600 mb-1">
                    Most active Day(Overall)
                  </div>
                  <div className="text-lg font-semibold text-slate-800 mb-1">
                    {contributions.overall.mostActiveDay}
                  </div>
                  <div className="text-xs text-slate-500">
                    {contributions.last6Months.weekendPercentage}% weekend
                  </div>
                </div>

                <div className="bg-white rounded-lg p-3 border border-slate-200">
                  <div className="text-xs text-slate-600 mb-1">
                    Longest streak
                  </div>
                  <div className="text-lg font-semibold text-slate-800 mb-1">
                    {contributions.longestStreak} days
                  </div>
                  <div className="text-xs text-slate-500">No days skipped</div>
                </div>

                <div className="bg-white rounded-lg p-3 border border-slate-200">
                  <div className="text-xs text-slate-600 mb-1">
                    Weekday vs weekend
                  </div>
                  <div className="text-lg font-semibold text-slate-800 mb-1">
                    {contributions.last6Months.weekdayWeekendBreakdown.weekday}%
                    /{" "}
                    {contributions.last6Months.weekdayWeekendBreakdown.weekend}%
                  </div>
                  <div className="text-xs text-slate-500">
                    Weekend refactors
                  </div>
                </div>

                <div className="bg-white rounded-lg p-3 border border-slate-200">
                  <div className="text-xs text-slate-600 mb-1">
                    Active years
                  </div>
                  <div className="text-sm font-medium text-slate-800">
                    {contributions.activeYears.join(" · ")}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* PRs & Reviews Section */}
          <Card className="bg-slate-50 pb-3">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Contribution Window</CardTitle>
              <CardDescription className="text-xs">
                Across owned & contributed repos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Last 6 Months */}
              <div className="bg-white rounded-lg p-4 border border-slate-200">
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
                      {contributions.last6Months.averageDailyCommits.toFixed(1)}{" "}
                      commits
                    </span>
                  </div>
                </div>
              </div>

              {/* Last 12 Months */}
              <div className="bg-white rounded-lg p-4 border border-slate-200">
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
                      {contributions.last1Year.averageDailyCommits.toFixed(1)}{" "}
                      commits
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

        {/* Right Column: Profile Snapshot */}
        <div className="space-y-6">
          {/* <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-1">Profile snapshot</h2>
            <p className="text-sm text-slate-600">
              Fast overview for recruiters & collaborators
            </p>
          </div> */}

          <div className="grid grid-cols-2 gap-x-4 gap-y-6">
            <Card className="bg-slate-50">
              <CardContent className="p-6 pb-7">
                <div className="text-xs text-slate-600 mb-1">
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

            <Card className="bg-slate-50">
              <CardContent className="p-6 pb-7">
                <div className="text-xs text-slate-600 mb-1">Total stars</div>
                <div className="text-2xl font-bold text-slate-800 mb-1">
                  {totalStars.toLocaleString()} ⭐
                </div>
                {/* <div className="text-xs text-slate-600">
                  Top repo: {bestRepo?.stars || 0} ⭐ · {bestRepo?.name || "N/A"}
                </div> */}
              </CardContent>
            </Card>

            <Card className="bg-slate-50">
              <CardContent className="p-6 pb-7">
                <div className="text-xs text-slate-600 mb-1">Followers</div>
                <div className="text-2xl font-bold text-slate-800 mb-1">
                  {profile.followers}
                </div>
                <div className="text-xs text-slate-600">
                  Following {profile.following}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-50">
              <CardContent className="p-6 pb-7">
                <div className="text-xs text-slate-600 mb-1">
                  First commit on GitHub
                </div>
                <div className="text-lg font-semibold text-slate-800 mb-1">
                  {contributions.firstCommitDate
                    ? contributions.firstCommitDate
                        .split(" ")
                        .slice(1)
                        .join(" ") // Extract "Aug 2023" from "28th Aug 2023"
                    : "N/A"}
                </div>
                <div className="text-xs text-slate-600">
                  {contributions.codingYears || "N/A"}
                </div>
              </CardContent>
            </Card>
          </div>

          {sanitizedReposData.length > 0 &&
            sanitizedReposData.slice(0, 6).sort((a, b) => b.stars - a.stars).map(
              (repo, index) =>
                // repo.isPinned && (
                  <Card key={index} className="bg-slate-50">
                    <CardContent className="p-4">
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
                          <p className="text-sm text-slate-600 mb-3">
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
                        {repo.isPinned && (
                          <div className="bg-amber-200 text-amber-800 text-xs px-2 py-1 rounded">
                            Pinned
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                // )
            )}
        </div>
      </div>
    </div>
  );
}
