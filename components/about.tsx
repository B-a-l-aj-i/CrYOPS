/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { GithubIcon, GlobeIcon, Loader2 } from "lucide-react";
import { GitHubData } from "@/app/store";
import { GitHubStats } from "@/components/githubStats";
import { GitHubCalendar } from "react-github-calendar";

interface AboutProps {
  githubData: GitHubData | null;
}

export default function About({ githubData }: AboutProps) {
  if (!githubData) {
    return <div>Loading...</div>;
  }

  const profile = {
    avatar: githubData.profile.avatar,
    name: githubData.profile.name,
    bio: githubData.profile.bio,
    githubUrl: githubData.profileUrl,
    blog: githubData.profile.blog,
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Profile Image */}
      <div className="mb-6 inline-block">
        <img
          src={profile.avatar}
          alt={profile.name}
          width={120}
          height={120}
          className="rounded-full border-4 border-white shadow-xl"
        />
      </div>

      {/* Name */}
      <h1 className="mb-4 text-3xl font-bold text-slate-800">{profile.name}</h1>

      {/* Bio */}
      <p className="mx-auto mb-6 max-w-5xl text-center text-xl leading-relaxed text-slate-400">
        {profile.bio}
      </p>

      {/* Social Buttons */}
      <div className="flex justify-center gap-4">
        <a
          href={profile.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-11 items-center gap-2 rounded-2xl border-slate-200 bg-blue-50 px-6 text-sm font-medium text-slate-700 transition-all duration-300 hover:shadow-sm"
        >
          <GithubIcon className="h-4 w-4" />
          GitHub
        </a>

        {profile.blog && (
          <a
            href={
              profile.blog.startsWith("http")
                ? profile.blog
                : `https://${profile.blog}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 items-center gap-2 rounded-2xl border-slate-200 bg-blue-50 px-6 text-sm font-medium text-slate-700 transition-all duration-300 hover:shadow-sm"
          >
            <GlobeIcon className="h-4 w-4" />
            Blog or Portfolio
          </a>
        )}
      </div>

      {/* GitHub Stats Dashboard */}
      <div className="mt-12 w-full">
        <GitHubStats data={githubData} />
      </div>

      {/* GitHub Contribution Calendar */}
      <div className="mx-auto mt-12 w-full max-w-fit px-4">
        <GitHubCalendarWrapper username={githubData.profile.username} />
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
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-slate-50/90 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            <p className="text-xs font-medium text-slate-500">
              Loading contribution data...
            </p>
          </div>
        </div>
      )}
      <div
        className={`${
          isLoading ? "pointer-events-none opacity-0" : "opacity-100"
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
