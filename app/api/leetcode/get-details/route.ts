import { NextRequest } from "next/server";
import { leetcodeGetDetailsSchema } from "@/lib/validations/leetcode";

const LEETCODE_API_BASE = "https://alfa-leetcode-api.onrender.com";

function extractUsernameFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    
    // Handle leetcode.com/u/username or leetcode.com/username (with or without trailing slash)
    const match = pathname.match(/\/(?:u\/)?([^\/]+)\/?$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate with Zod
    const validation = leetcodeGetDetailsSchema.safeParse(body);
    if (!validation.success) {
      return Response.json(
        { success: false, error: validation.error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const { url } = validation.data;

    // Extract username from URL
    const username = extractUsernameFromUrl(url);
    if (!username) {
      return Response.json(
        { success: false, error: "Could not extract username from URL" },
        { status: 400 }
      );
    }

    try {
      // Fetch comprehensive profile data from Alfa LeetCode API
      // Based on: https://github.com/alfaarghya/alfa-leetcode-api/
      // The /profile endpoint returns all needed data including stats and submissions
      // The /calendar endpoint provides streak and active years data
      const [profileResponse, badgesResponse, contestResponse, calendarResponse] = await Promise.all([
        fetch(`${LEETCODE_API_BASE}/${username}/profile`, {
          headers: { "User-Agent": "Mozilla/5.0" },
        }),
        fetch(`${LEETCODE_API_BASE}/${username}/badges`, {
          headers: { "User-Agent": "Mozilla/5.0" },
        }),
        fetch(`${LEETCODE_API_BASE}/${username}/contest`, {
          headers: { "User-Agent": "Mozilla/5.0" },
        }),
        fetch(`${LEETCODE_API_BASE}/${username}/calendar`, {
          headers: { "User-Agent": "Mozilla/5.0" },
        }),
      ]);

      const profileData = profileResponse.ok ? await profileResponse.json() : null;
      const badgesData = badgesResponse.ok ? await badgesResponse.json() : null;
      const contestData = contestResponse.ok ? await contestResponse.json() : null;
      const calendarData = calendarResponse.ok ? await calendarResponse.json() : null;

      if (!profileData) {
        return Response.json({
          success: false,
          error: "Profile not found",
        });
      }
      
      // Get random recently submitted problem (from accepted submissions only)
      interface Submission {
        title: string;
        titleSlug: string;
        statusDisplay: string;
        timestamp: string;
        lang: string;
      }
      
      const acceptedSubmissions = (profileData.recentSubmissions as Submission[])?.filter(
        (sub) => sub.statusDisplay === "Accepted"
      ) || [];
      const randomProblem = acceptedSubmissions.length > 0
        ? acceptedSubmissions[Math.floor(Math.random() * acceptedSubmissions.length)]
        : null;

      // Calculate acceptance rate
      const totalSubmissions = profileData.totalSubmissions?.[0]?.submissions || 0;
      const totalAccepted = profileData.totalSolved || 0;
      const acceptanceRate = totalSubmissions > 0 
        ? parseFloat(((totalAccepted / totalSubmissions) * 100).toFixed(1))
        : 0;

      // Extract streak and active years from calendar endpoint
      // Calendar data structure: { activeYears: [2023, 2024], streak: 0, totalActiveDays: 0, submissionCalendar: '{}' }
      const currentStreak = calendarData?.streak || 0;
      const activeYears = calendarData?.activeYears || [];
      const submissionCalendar = calendarData?.submissionCalendar 
        ? (typeof calendarData.submissionCalendar === 'string' 
            ? JSON.parse(calendarData.submissionCalendar) 
            : calendarData.submissionCalendar)
        : {};

      // Calculate longest streak from submission calendar if available
      let longestStreak = currentStreak; // Default to current streak
      if (Object.keys(submissionCalendar).length > 0) {
        const calendarEntries = Object.entries(submissionCalendar);
        const sortedEntries = calendarEntries.sort((a, b) => {
          const timestampA = typeof a[0] === 'string' ? parseInt(a[0]) : (a[0] as number);
          const timestampB = typeof b[0] === 'string' ? parseInt(b[0]) : (b[0] as number);
          return timestampA - timestampB;
        });

        let tempStreak = 0;
        for (let i = 0; i < sortedEntries.length; i++) {
          const [timestamp, count] = sortedEntries[i];
          if ((count as number) > 0) {
            if (i === 0) {
              tempStreak = 1;
            } else {
              const prevTimestampKey = sortedEntries[i - 1][0];
              const prevTimestamp = typeof prevTimestampKey === 'string' 
                ? parseInt(prevTimestampKey) 
                : (prevTimestampKey as unknown as number);
              const timestampNum = typeof timestamp === 'string' ? parseInt(timestamp) : timestamp;
              const oneDay = 86400;
              const daysDiff = Math.floor((timestampNum - prevTimestamp) / oneDay);
              
              if (daysDiff === 1) {
                tempStreak++;
              } else {
                longestStreak = Math.max(longestStreak, tempStreak);
                tempStreak = 1;
              }
            }
          } else {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 0;
          }
        }
        longestStreak = Math.max(longestStreak, tempStreak);
      }

      // Structure response for UI
      return Response.json({
        success: true,
        data: {
          // Rank
          rank: profileData.ranking || 0,
          
          // Problem solving statistics
          stats: {
            totalSolved: profileData.totalSolved || 0,
            totalQuestions: profileData.totalQuestions || 0,
            easySolved: profileData.easySolved || 0,
            totalEasy: profileData.totalEasy || 0,
            mediumSolved: profileData.mediumSolved || 0,
            totalMedium: profileData.totalMedium || 0,
            hardSolved: profileData.hardSolved || 0,
            totalHard: profileData.totalHard || 0,
            acceptanceRate: acceptanceRate,
            totalSubmissions: totalSubmissions,
          },
          
          // Submission breakdown by difficulty
          submissionBreakdown: profileData.totalSubmissions || [],
          
          // Recent badges
          recentBadges: badgesData?.badges?.slice(0, 3) || [],
          
          // Upcoming badges
          upcomingBadges: badgesData?.upcomingBadges || [],
          
          // Streak and active years (from /calendar endpoint)
          streak: {
            current: currentStreak,
            longest: longestStreak,
            totalActiveDays: calendarData?.totalActiveDays || 0,
            activeYears: activeYears.map((year: number) => year.toString()).sort(),
          },
          
          // Contest ranking
          contestRanking: contestData?.userContestRanking || null,
          
          // Recent submissions
          recentSubmissions: profileData.recentSubmissions || [],
          
          // Random problem for daily challenge
          randomProblem: randomProblem ? {
            title: randomProblem.title,
            titleSlug: randomProblem.titleSlug,
            url: `https://leetcode.com/problems/${randomProblem.titleSlug}/`,
          } : null,
          
          // Additional profile info
          profile: {
            username: username,
            reputation: profileData.reputation || 0,
            contributionPoint: profileData.contributionPoint || 0,
          },
          
          // Calendar data
          submissionCalendar: submissionCalendar,
          
          profileUrl: url,
        },
      });
    } catch (error) {
      console.error("LeetCode API error:", error);
      return Response.json({
        success: false,
        error: "Failed to fetch profile details",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return Response.json(
      { success: false, error: "Failed to get profile details" },
      { status: 500 }
    );
  }
}

