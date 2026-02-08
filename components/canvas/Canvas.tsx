'use client';

import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useCanvasStore } from '@/app/store';
import { DraggableCard } from './DraggableCard';

interface CanvasProps {
  className?: string;
}

export function Canvas({ className }: CanvasProps) {
  const { cards, updateCardPosition } = useCanvasStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px of movement before drag starts
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    const cardId = active.id as string;
    const card = cards.find((c) => c.id === cardId);

    if (card) {
      // Calculate new position based on delta
      let newX = card.x + delta.x;
      let newY = card.y + delta.y;

      // Keep within canvas bounds (assuming canvas width/height)
      const canvasWidth = 1800;
      const canvasHeight = 1200;
      const cardWidth = card.width || 300;
      const cardHeight = card.height || 200;

      newX = Math.max(0, Math.min(newX, canvasWidth - cardWidth));
      newY = Math.max(0, Math.min(newY, canvasHeight - cardHeight));

      updateCardPosition(cardId, newX, newY);
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div
        className={`canvas-container relative min-h-[800px] w-full overflow-auto ${className || ''}`}
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }}
      >
        <div className="relative min-h-[1200px] min-w-[1800px] bg-slate-50/50 rounded-lg border-2 border-dashed border-slate-300 p-8">
          {cards.map((card) => (
            <DraggableCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </DndContext>
  );
}
