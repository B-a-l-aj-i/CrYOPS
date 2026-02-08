'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCanvasStore, CanvasCard } from '@/app/store';
import { Plus, RotateCcw, Save, Github, Code2, FileText, Globe, Type } from 'lucide-react';

export function FloatingToolbar() {
  const { addCard, resetCanvas, cards } = useCanvasStore();
  const [showAddMenu, setShowAddMenu] = useState(false);

  const handleAddCard = (type: CanvasCard['type']) => {
    const newCard: CanvasCard = {
      id: `${type}-${Date.now()}`,
      x: 200 + (cards.length * 30), // Offset each new card
      y: 200 + (cards.length * 30),
      type,
      content: null,
      width: 300,
      height: 200,
    };
    addCard(newCard);
    setShowAddMenu(false);
  };

  const handleSave = () => {
    // The canvas automatically saves to localStorage via Zustand persist
    // Show a visual feedback
    const button = document.getElementById('save-button');
    if (button) {
      button.classList.add('bg-green-600');
      setTimeout(() => {
        button.classList.remove('bg-green-600');
      }, 500);
    }
  };

  const cardTypes = [
    { type: 'github' as const, label: 'GitHub', icon: Github },
    { type: 'leetcode' as const, label: 'LeetCode', icon: Code2 },
    { type: 'resume' as const, label: 'Resume', icon: FileText },
    { type: 'blog' as const, label: 'Blog', icon: Globe },
    { type: 'custom' as const, label: 'Custom Text', icon: Type },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3">
      {/* Add Card Menu */}
      {showAddMenu && (
        <div className="bg-white rounded-lg shadow-xl border border-slate-200 p-2 space-y-1 animate-in fade-in slide-in-from-bottom-2">
          {cardTypes.map(({ type, label, icon: Icon }) => (
            <button
              key={type}
              onClick={() => handleAddCard(type)}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Toolbar Buttons */}
      <div className="flex gap-2 bg-white rounded-lg shadow-xl border border-slate-200 p-2 backdrop-blur-sm">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="gap-2"
          title="Add new card"
        >
          <Plus className="h-4 w-4" />
          Add Card
        </Button>

        <div className="w-px bg-slate-200" />

        <Button
          size="sm"
          variant="ghost"
          onClick={resetCanvas}
          className="gap-2"
          title="Reset to default layout"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>

        <Button
          id="save-button"
          size="sm"
          onClick={handleSave}
          className="gap-2 transition-colors"
          title="Save canvas (auto-saves)"
        >
          <Save className="h-4 w-4" />
          Save
        </Button>
      </div>
    </div>
  );
}
