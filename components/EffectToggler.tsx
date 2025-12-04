'use client';

import { useGlitchStore } from '@/lib/store';
import { ShaderModule } from '@/types/glitch';

const availableModules: { id: ShaderModule; name: string; emoji: string }[] = [
  { id: 'rgbSplit', name: 'RGB Split', emoji: '🌈' },
  { id: 'noise', name: 'Noise', emoji: '📡' },
  { id: 'glitchBlocks', name: 'Glitch Blocks', emoji: '🧱' },
  { id: 'scanlines', name: 'Scanlines', emoji: '📺' },
  { id: 'pixelate', name: 'Pixelate', emoji: '🔲' },
  { id: 'displacement', name: 'Displacement', emoji: '🌊' },
  { id: 'vhsDistortion', name: 'VHS Distortion', emoji: '📼' },
  { id: 'datamosh', name: 'Datamosh', emoji: '💥' },
  { id: 'colorGrade', name: 'Color Grade', emoji: '🎨' },
  { id: 'chromaticAberration', name: 'Chromatic', emoji: '🔴🔵' },
];

export default function EffectToggler() {
  const { config, setConfig } = useGlitchStore();

  const toggleModule = (moduleId: ShaderModule) => {
    const currentModules = config.shaderModules || [];
    const newModules = currentModules.includes(moduleId)
      ? currentModules.filter((m) => m !== moduleId)
      : [...currentModules, moduleId];
    
    setConfig({ shaderModules: newModules });
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-3">Active Effects</label>
      <div className="space-y-2">
        {availableModules.map((module) => {
          const isActive = config.shaderModules?.includes(module.id);
          return (
            <button
              key={module.id}
              onClick={() => toggleModule(module.id)}
              className={`w-full px-3 py-2 rounded-lg border text-sm font-medium transition-all text-left flex items-center gap-2 ${
                isActive
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                  : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
              }`}
            >
              <span className="text-lg">{module.emoji}</span>
              <span>{module.name}</span>
              {isActive && <span className="ml-auto text-xs">✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
