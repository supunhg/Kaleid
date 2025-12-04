'use client';

import { useEffect } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  action: () => void;
  description: string;
}

interface UseKeyboardShortcutsProps {
  shortcuts: KeyboardShortcut[];
  enabled?: boolean;
}

export function useKeyboardShortcuts({ shortcuts, enabled = true }: UseKeyboardShortcutsProps) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl ? e.ctrlKey || e.metaKey : !e.ctrlKey && !e.metaKey;
        const altMatch = shortcut.alt ? e.altKey : !e.altKey;
        const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;

        if (
          e.key.toLowerCase() === shortcut.key.toLowerCase() &&
          ctrlMatch &&
          altMatch &&
          shiftMatch
        ) {
          e.preventDefault();
          shortcut.action();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, enabled]);
}

export default function KeyboardShortcutsHelp({ shortcuts }: { shortcuts: KeyboardShortcut[] }) {
  return (
    <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
      <h3 className="text-sm font-bold mb-3 text-gray-400">Keyboard Shortcuts</h3>
      <div className="space-y-2 text-xs">
        {shortcuts.map((shortcut, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-gray-400">{shortcut.description}</span>
            <kbd className="px-2 py-1 bg-gray-800 rounded border border-gray-700 font-mono">
              {shortcut.ctrl && '⌘/Ctrl+'}
              {shortcut.alt && 'Alt+'}
              {shortcut.shift && 'Shift+'}
              {shortcut.key.toUpperCase()}
            </kbd>
          </div>
        ))}
      </div>
    </div>
  );
}
