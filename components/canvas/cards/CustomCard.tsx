'use client';

import { useState } from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CanvasCard, useCanvasStore } from '@/app/store';
import { Type, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CustomCardProps {
  card: CanvasCard;
}

export function CustomCard({ card }: CustomCardProps) {
  const [isEditing, setIsEditing] = useState(!card.content?.text);
  const [text, setText] = useState(card.content?.text || '');
  const { updateCardContent } = useCanvasStore();

  const handleSave = () => {
    if (text) {
      updateCardContent(card.id, { text });
      setIsEditing(false);
    }
  };

  return (
    <>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Type className="h-4 w-4" />
          Custom Note
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              placeholder="Enter your custom text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="w-full h-24 px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSave();
                }}
                className="flex-1"
                disabled={!text}
              >
                Save
              </Button>
              {card.content?.text && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setText(card.content.text);
                    setIsEditing(false);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="bg-slate-50 rounded p-3 min-h-[80px]">
              <p className="text-sm text-slate-700 whitespace-pre-wrap">
                {card.content?.text}
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="w-full"
            >
              <Edit3 className="h-3 w-3 mr-2" />
              Edit Text
            </Button>
          </div>
        )}
      </CardContent>
    </>
  );
}
