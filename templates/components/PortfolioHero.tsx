/**
 * Portfolio Hero Component Template
 * Pure content component - no positioning logic
 */
import { GithubIcon, GlobeIcon } from "lucide-react";
import type { GitHubData } from "../types";

interface PortfolioHeroProps {
  data: GitHubData;
}

export function PortfolioHero({ data }: PortfolioHeroProps) {
  const profile = data.profile;

  return (
    <div className="flex h-full flex-col items-center justify-center rounded-lg bg-gradient-to-br from-slate-50 to-white p-8">
      <div className="mb-6">
        <img
          src={profile.avatar}
          alt={profile.name}
          width={120}
          height={120}
          className="rounded-full border-4 border-white shadow-xl"
        />
      </div>

      <h1 className="mb-4 text-center text-4xl font-bold text-slate-800">
        {profile.name}
      </h1>

      <p className="mb-8 max-w-2xl text-center text-xl leading-relaxed text-slate-500">
        {profile.bio || "Full Stack Developer"}
      </p>

      <div className="flex gap-4">
        <a
          href={data.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full bg-slate-100 px-6 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-200"
        >
          <GithubIcon className="h-5 w-5" />
          GitHub
        </a>

        {profile.blog && (
          <a
            href={profile.blog}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-slate-100 px-6 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-200"
          >
            <GlobeIcon className="h-5 w-5" />
            Website
          </a>
        )}
      </div>

      <div className="mt-8 flex gap-8 text-center">
        <div>
          <div className="text-2xl font-bold text-slate-800">
            {profile.publicRepos}
          </div>
          <div className="text-sm text-slate-500">Repositories</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-slate-800">
            {profile.followers}
          </div>
          <div className="text-sm text-slate-500">Followers</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-slate-800">
            {profile.following}
          </div>
          <div className="text-sm text-slate-500">Following</div>
        </div>
      </div>
    </div>
  );
}
