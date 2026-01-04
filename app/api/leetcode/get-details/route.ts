import { NextRequest } from "next/server";

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
    const { url } = body;

    if (!url) {
      return Response.json(
        { success: false, error: "URL is required" },
        { status: 400 }
      );
    }

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
      const [profileResponse, solvedResponse, badgesResponse, contestResponse] = await Promise.all([
        fetch(`${LEETCODE_API_BASE}/${username}`, {
          headers: { "User-Agent": "Mozilla/5.0" },
        }),
        fetch(`${LEETCODE_API_BASE}/${username}/solved`, {
          headers: { "User-Agent": "Mozilla/5.0" },
        }),
        fetch(`${LEETCODE_API_BASE}/${username}/badges`, {
          headers: { "User-Agent": "Mozilla/5.0" },
        }),
        fetch(`${LEETCODE_API_BASE}/${username}/contest`, {
          headers: { "User-Agent": "Mozilla/5.0" },
        }),
      ]);

      const profileData = profileResponse.ok ? await profileResponse.json() : null;
      const solvedData = solvedResponse.ok ? await solvedResponse.json() : null;
      const badgesData = badgesResponse.ok ? await badgesResponse.json() : null;
      const contestData = contestResponse.ok ? await contestResponse.json() : null;

      if (!profileData || !profileData.matchedUser) {
        return Response.json({
          success: false,
          error: "Profile not found",
        });
      }

      // Combine all data into a comprehensive response
      return Response.json({
        success: true,
        data: {
          profile: {
            username: profileData.matchedUser.username,
            realName: profileData.matchedUser.profile?.realName,
            aboutMe: profileData.matchedUser.profile?.aboutMe,
            avatar: profileData.matchedUser.profile?.userAvatar,
            ranking: profileData.matchedUser.profile?.ranking,
            reputation: profileData.matchedUser.profile?.reputation,
            githubUrl: profileData.matchedUser.githubUrl,
            twitterUrl: profileData.matchedUser.twitterUrl,
            linkedinUrl: profileData.matchedUser.linkedinUrl,
            websiteUrl: profileData.matchedUser.websiteUrl,
            company: profileData.matchedUser.profile?.company,
            school: profileData.matchedUser.profile?.school,
            location: profileData.matchedUser.profile?.location,
            skillTags: profileData.matchedUser.profile?.skillTags,
          },
          stats: {
            totalSolved: solvedData?.totalSolved || 0,
            totalQuestions: solvedData?.totalQuestions || 0,
            easySolved: solvedData?.easySolved || 0,
            mediumSolved: solvedData?.mediumSolved || 0,
            hardSolved: solvedData?.hardSolved || 0,
            acceptanceRate: solvedData?.acceptanceRate || 0,
          },
          badges: badgesData?.badges || [],
          contests: contestData?.userContestRanking || null,
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

