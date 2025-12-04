'use client';

import { useGlitchStore } from '@/lib/store';
import { useHistoryStore } from '@/lib/history';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

export default function HistoryControls() {
  const { config, setConfig } = useGlitchStore();
  const { canUndo, canRedo, undo, redo, addToHistory, setPresent } = useHistoryStore();

  // Sync present state with glitch store
  const handleUndo = () => {
    undo();
    const present = useHistoryStore.getState().present;
    setConfig(present);
  };

  const handleRedo = () => {
    redo();
    const present = useHistoryStore.getState().present;
    setConfig(present);
  };

  // Keyboard shortcuts for undo/redo
  useKeyboardShortcuts({
    shortcuts: [
      {
        key: 'z',
        ctrl: true,
        action: handleUndo,
        description: 'Undo',
      },
      {
        key: 'z',
        ctrl: true,
        shift: true,
        action: handleRedo,
        description: 'Redo',
      },
    ],
  });

  return (
    <div className="flex gap-2">
      <button
        onClick={handleUndo}
        disabled={!canUndo}
        className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-xs font-medium hover:border-cyan-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-700"
        title="Undo (Ctrl+Z)"
      >
        ↶ Undo
      </button>
      <button
        onClick={handleRedo}
        disabled={!canRedo}
        className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-xs font-medium hover:border-cyan-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-700"
        title="Redo (Ctrl+Shift+Z)"
      >
        ↷ Redo
      </button>
    </div>
  );
}
