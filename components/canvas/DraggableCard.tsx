'use client';

import { useDraggable } from '@dnd-kit/core';
import { Card } from '@/components/ui/card';
import { CanvasCard } from '@/app/store';
import { GitHubCard } from './cards/GitHubCard';
import { LeetCodeCard } from './cards/LeetCodeCard';
import { ResumeCard } from './cards/ResumeCard';
import { BlogCard } from './cards/BlogCard';
import { CustomCard } from './cards/CustomCard';
import { cn } from '@/lib/utils';

interface DraggableCardProps {
  card: CanvasCard;
}

export function DraggableCard({ card }: DraggableCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: card.id,
  });

  const style = {
    transform: transform
      ? `translate3d(${card.x + transform.x}px, ${card.y + transform.y}px, 0)`
      : `translate3d(${card.x}px, ${card.y}px, 0)`,
    width: card.width || 300,
    height: card.height || 200,
  };

  const renderCardContent = () => {
    switch (card.type) {
      case 'github':
        return <GitHubCard card={card} />;
      case 'leetcode':
        return <LeetCodeCard card={card} />;
      case 'resume':
        return <ResumeCard card={card} />;
      case 'blog':
        return <BlogCard card={card} />;
      case 'custom':
        return <CustomCard card={card} />;
      default:
        return <div>Unknown card type</div>;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'draggable-card absolute cursor-grab transition-shadow',
        isDragging && 'cursor-grabbing opacity-90 z-1000 ring-4 ring-blue-600',
        !isDragging && 'hover:ring-2 hover:ring-blue-500'
      )}
      {...listeners}
      {...attributes}
    >
      <Card className="h-full w-full shadow-md">
        {/* Card type badge */}
        <div className="absolute -top-2 -right-2 z-10">
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 border border-blue-200">
            {card.type}
          </span>
        </div>

        {/* Card content */}
        {renderCardContent()}
      </Card>
    </div>
  );
}
