'use client';

import { useState } from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CanvasCard, useCanvasStore } from '@/app/store';
import { Globe, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BlogCardProps {
  card: CanvasCard;
}

export function BlogCard({ card }: BlogCardProps) {
  const [blogUrl, setBlogUrl] = useState(card.content?.url || '');
  const { updateCardContent } = useCanvasStore();

  const handleSave = () => {
    if (blogUrl) {
      updateCardContent(card.id, { url: blogUrl, title: extractDomain(blogUrl) });
    }
  };

  const extractDomain = (url: string) => {
    try {
      const domain = new URL(url.startsWith('http') ? url : `https://${url}`);
      return domain.hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  return (
    <>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Globe className="h-4 w-4" />
          Blog / Website
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {card.content?.url ? (
          <>
            <div className="bg-slate-50 rounded p-3">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-5 w-5 text-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{card.content.title}</p>
                  <p className="text-xs text-slate-500 truncate">
                    {card.content.url}
                  </p>
                </div>
              </div>
            </div>
            <a
              href={card.content.url.startsWith('http') ? card.content.url : `https://${card.content.url}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              <Button size="sm" variant="outline" className="w-full">
                <ExternalLink className="h-3 w-3 mr-2" />
                Visit Website
              </Button>
            </a>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                updateCardContent(card.id, { url: '', title: '' });
                setBlogUrl('');
              }}
              className="w-full text-xs"
            >
              Change URL
            </Button>
          </>
        ) : (
          <div className="space-y-3">
            <div className="flex flex-col items-center justify-center py-4 border-2 border-dashed border-slate-300 rounded-lg">
              <Globe className="h-8 w-8 text-slate-400 mb-2" />
              <p className="text-xs text-slate-500 text-center">
                Add your blog or website URL
              </p>
            </div>
            <input
              type="text"
              placeholder="https://myblog.com"
              value={blogUrl}
              onChange={(e) => setBlogUrl(e.target.value)}
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
              disabled={!blogUrl}
            >
              Save URL
            </Button>
          </div>
        )}
      </CardContent>
    </>
  );
}
