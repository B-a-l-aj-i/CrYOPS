'use client';

import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CanvasCard, useGithubStore } from '@/app/store';
import { Github } from 'lucide-react';

interface GitHubCardProps {
  card: CanvasCard;
}

export function GitHubCard({ card }: GitHubCardProps) {
  const githubData = useGithubStore((state) => state.githubData);

  if (!githubData) {
    return (
      <CardContent className="p-6 flex flex-col items-center justify-center h-full">
        <Github className="h-12 w-12 text-slate-300 mb-2" />
        <p className="text-sm text-slate-500 text-center">
          No GitHub data available
        </p>
      </CardContent>
    );
  }

  return (
    <>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Github className="h-4 w-4" />
          GitHub Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3">
          <img
            src={githubData.profile.avatar}
            alt={githubData.profile.name}
            className="w-12 h-12 rounded-full border-2 border-white shadow"
          />
          <div>
            <p className="font-semibold text-sm">{githubData.profile.name}</p>
            <p className="text-xs text-slate-500">@{githubData.profile.username}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 pt-2">
          <div className="bg-slate-50 rounded p-2">
            <p className="text-xs text-slate-600">Contributions</p>
            <p className="text-lg font-bold text-slate-800">
              {githubData.contributions.total.toLocaleString()}
            </p>
          </div>
          <div className="bg-slate-50 rounded p-2">
            <p className="text-xs text-slate-600">Stars</p>
            <p className="text-lg font-bold text-slate-800">
              {githubData.totalStars} ⭐
            </p>
          </div>
        </div>

        <div className="bg-slate-50 rounded p-2">
          <p className="text-xs text-slate-600">Repositories</p>
          <p className="text-sm font-semibold text-slate-800">
            {githubData.profile.publicRepos} public
          </p>
        </div>
      </CardContent>
    </>
  );
}
