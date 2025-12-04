'use client';

import { useState, useEffect } from 'react';
import { getSavedPresets, deletePreset } from '@/lib/localStorage';
import { useGlitchStore } from '@/lib/store';
import type { GlitchConfig } from '@/types/glitch';

interface SavedPreset {
  id: string;
  name: string;
  config: GlitchConfig;
  createdAt: number;
  thumbnail?: string;
}

export default function SavedPresetsList() {
  const [presets, setPresets] = useState<SavedPreset[]>([]);
  const { setConfig } = useGlitchStore();

  useEffect(() => {
    loadPresets();
  }, []);

  const loadPresets = () => {
    setPresets(getSavedPresets());
  };

  const handleLoad = (preset: SavedPreset) => {
    setConfig(preset.config);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this preset?')) {
      deletePreset(id);
      loadPresets();
    }
  };

  if (presets.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-sm">No saved presets yet</p>
        <p className="text-xs mt-2">Use Ctrl+S to save your current preset</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-bold text-gray-400 mb-3">Saved Presets ({presets.length}/50)</h3>
      {presets.map((preset) => (
        <div
          key={preset.id}
          className="bg-gray-800 border border-gray-700 rounded-lg p-3 hover:border-cyan-500 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm truncate">{preset.name}</h4>
              <p className="text-xs text-gray-500">
                {new Date(preset.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleLoad(preset)}
                className="px-3 py-1.5 bg-cyan-500/20 text-cyan-400 rounded text-xs font-bold hover:bg-cyan-500/30 transition-colors"
              >
                Load
              </button>
              <button
                onClick={() => handleDelete(preset.id)}
                className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded text-xs font-bold hover:bg-red-500/30 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
