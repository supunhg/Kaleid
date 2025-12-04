'use client';

import { glitchPresets } from '@/lib/presets';
import { useGlitchStore } from '@/lib/store';

export default function PresetSelector() {
  const { setConfig } = useGlitchStore();

  const loadPreset = (presetId: string) => {
    const preset = glitchPresets.find((p) => p.id === presetId);
    if (preset) {
      setConfig(preset.config);
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-3">Load Preset</label>
      <div className="grid grid-cols-1 gap-2">
        {glitchPresets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => loadPreset(preset.id)}
            className="text-left px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg hover:border-cyan-500 transition-colors"
          >
            <div className="font-semibold text-sm">{preset.name}</div>
            <div className="text-xs text-gray-400 mt-1">{preset.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
