/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { GithubIcon, CodeIcon, GlobeIcon, Loader2 } from "lucide-react";
import { GitHubData, LeetCodeData } from "@/app/store";
import { GitHubStats } from "@/components/githubStats";
import { GitHubCalendar } from "react-github-calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface AboutProps {
  githubData: GitHubData | null;
  // leetCodeData: LeetCodeData | null;
}

export default function About({ githubData /* , leetCodeData */ }: AboutProps) {

  if (!githubData /* || !leetCodeData */) {
    return <div>Loading...</div>;
  }

  const profile = {
    avatar: githubData.profile.avatar,
    name: githubData.profile.name,
    bio: githubData.profile.bio,
    githubUrl: githubData.profileUrl,
    // leetcodeUrl: leetCodeData.profileUrl,
    blog: githubData.profile.blog,
  };

  const usersGitHubData: GitHubData | null = githubData;

  return (
    <div className="flex flex-col justify-center items-center py-12">
      {/* Profile Image */}
      <div className="inline-block mb-6">
        <img
          src={profile.avatar}
          alt={profile.name}
          width={120}
          height={120}
          className="rounded-full border-4 border-white shadow-xl"
        />
      </div>

      {/* Name */}
      <h1 className="text-3xl font-bold text-slate-800 mb-4">{profile.name}</h1>

      {/* Bio */}
      <p className="text-xl text-slate-400 max-w-5xl mx-auto mb-6 leading-relaxed text-center">
        {profile.bio}
      </p>

      {/* Social Buttons */}
      <div className="flex justify-center gap-4">
        <a
          href={profile.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="h-11 px-6 bg-blue-50 rounded-2xl border-slate-200 text-sm font-medium text-slate-700 flex items-center gap-2 hover:shadow-sm transition-all duration-300"
        >
          <GithubIcon className="w-4 h-4" />
          GitHub
        </a>

        {/* <a
          href={profile.leetcodeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="h-11 px-6 bg-blue-50 rounded-2xl border-slate-200 text-sm font-medium text-slate-700 flex items-center gap-2 hover:shadow-sm transition-all duration-300"
        >
          <CodeIcon className="w-4 h-4" />
          LeetCode
        </a> */}

        {profile.blog && (
          <a
            href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`}
            target="_blank"
            rel="noopener noreferrer"
            className="h-11 px-6 bg-blue-50 rounded-2xl  border-slate-200 text-sm font-medium text-slate-700 flex items-center gap-2 hover:shadow-sm transition-all duration-300"
          >
            <GlobeIcon className="w-4 h-4" />
            Blog or Portfolio
          </a>
        )}
      </div>

      {/* GitHub Stats Dashboard */}
      <div className="w-full mt-12">
        <GitHubStats data={usersGitHubData} />
      </div>

      {/* GitHub Contribution Calendar */}
      <div className="w-full max-w-fit mx-auto px-4 mt-12">
        <GitHubCalendarWrapper username={usersGitHubData.profile.username} />
      </div>
    </div>
  );
}

// Wrapper component for GitHub Calendar with loading state
function GitHubCalendarWrapper({ username }: { username: string }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Use a reasonable timeout to hide loading state
    // The calendar typically loads within 1-3 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

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
        className={`${
          isLoading ? "opacity-0 pointer-events-none" : "opacity-100"
        } transition-opacity duration-500`}
        onLoad={() => setIsLoading(false)}
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
                "#ebedf0", // 0 contributions (almost white)
                "#9be9a8", // low
                "#40c463", // medium
                "#30a14e", // high
                "#216e39", // very high
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
  );
}
