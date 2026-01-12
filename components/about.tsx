/* eslint-disable @next/next/no-img-element */
'use client'

import { GithubIcon, CodeIcon, GlobeIcon } from "lucide-react";
import { GitHubData, LeetCodeData } from "@/app/store";
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
      <h1 className="text-3xl font-bold text-slate-800 mb-4">
        {profile.name}
      </h1>

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

        {profile.blog && <a
          href={profile.blog}
          target="_blank"
          rel="noopener noreferrer"
          className="h-11 px-6 bg-blue-50 rounded-2xl  border-slate-200 text-sm font-medium text-slate-700 flex items-center gap-2 hover:shadow-sm transition-all duration-300"
        >
          <GlobeIcon className="w-4 h-4" />
          Blog or Portfolio
        </a>}
      </div>
    </div>
  );
}
