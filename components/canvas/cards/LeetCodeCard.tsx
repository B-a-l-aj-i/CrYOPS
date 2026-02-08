'use client';

import { useState } from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CanvasCard, useCanvasStore, useLeetCodeStore } from '@/app/store';
import { Code2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LeetCodeCardProps {
  card: CanvasCard;
}

export function LeetCodeCard({ card }: LeetCodeCardProps) {
  const leetCodeData = useLeetCodeStore((state) => state.leetCodeData);
  const [username, setUsername] = useState('');
  const { updateCardContent } = useCanvasStore();

  const handleSave = () => {
    if (username) {
      updateCardContent(card.id, { username });
    }
  };

  const displayUsername = card.content?.username || leetCodeData?.profile?.username;

  return (
    <>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Code2 className="h-4 w-4" />
          LeetCode Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {leetCodeData && displayUsername ? (
          <>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm">{displayUsername}</p>
                <p className="text-xs text-slate-500">Rank: {leetCodeData.rank}</p>
              </div>
              <a
                href={leetCodeData.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="h-4 w-4 text-slate-400 hover:text-slate-600" />
              </a>
            </div>

            <div className="space-y-2">
              <div className="bg-slate-50 rounded p-2">
                <p className="text-xs text-slate-600">Total Solved</p>
                <p className="text-lg font-bold text-slate-800">
                  {leetCodeData.stats.totalSolved}
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-green-50 rounded p-1.5">
                  <p className="text-xs text-green-600">Easy</p>
                  <p className="text-sm font-semibold text-green-800">
                    {leetCodeData.stats.easySolved}
                  </p>
                </div>
                <div className="bg-yellow-50 rounded p-1.5">
                  <p className="text-xs text-yellow-600">Medium</p>
                  <p className="text-sm font-semibold text-yellow-800">
                    {leetCodeData.stats.mediumSolved}
                  </p>
                </div>
                <div className="bg-red-50 rounded p-1.5">
                  <p className="text-xs text-red-600">Hard</p>
                  <p className="text-sm font-semibold text-red-800">
                    {leetCodeData.stats.hardSolved}
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-slate-500">
              Enter your LeetCode username
            </p>
            <Input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="text-sm"
            />
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
              }}
              className="w-full"
            >
              Save
            </Button>
          </div>
        )}
      </CardContent>
    </>
  );
}
