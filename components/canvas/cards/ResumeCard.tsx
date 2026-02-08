'use client';

import { useState } from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CanvasCard, useCanvasStore } from '@/app/store';
import { FileText, Upload, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResumeCardProps {
  card: CanvasCard;
}

export function ResumeCard({ card }: ResumeCardProps) {
  const [resumeLink, setResumeLink] = useState(card.content?.link || '');
  const { updateCardContent } = useCanvasStore();

  const handleSave = () => {
    if (resumeLink) {
      updateCardContent(card.id, { link: resumeLink });
    }
  };

  return (
    <>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Resume
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {card.content?.link ? (
          <>
            <div className="bg-slate-50 rounded p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm font-medium">Resume Link</p>
                  <p className="text-xs text-slate-500 truncate max-w-[200px]">
                    {card.content.link}
                  </p>
                </div>
              </div>
            </div>
            <a
              href={card.content.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              <Button size="sm" variant="outline" className="w-full">
                <LinkIcon className="h-3 w-3 mr-2" />
                View Resume
              </Button>
            </a>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                updateCardContent(card.id, { link: '' });
                setResumeLink('');
              }}
              className="w-full text-xs"
            >
              Change Link
            </Button>
          </>
        ) : (
          <div className="space-y-3">
            <div className="flex flex-col items-center justify-center py-4 border-2 border-dashed border-slate-300 rounded-lg">
              <Upload className="h-8 w-8 text-slate-400 mb-2" />
              <p className="text-xs text-slate-500 text-center">
                Add link to your resume
              </p>
            </div>
            <input
              type="text"
              placeholder="https://example.com/resume.pdf"
              value={resumeLink}
              onChange={(e) => setResumeLink(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
              }}
              className="w-full"
              disabled={!resumeLink}
            >
              Save Link
            </Button>
          </div>
        )}
      </CardContent>
    </>
  );
}
