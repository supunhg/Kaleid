'use client';

import { useEffect, useRef, useState } from 'react';
import { useGlitchStore } from '@/lib/store';
import GlitchCanvas from './GlitchCanvas';

export default function PreviewCanvas() {
  const { config } = useGlitchStore();
  const [isAnimating, setIsAnimating] = useState(true);

  const getGlitchStyle = () => {
    const style: React.CSSProperties = {
      animationDuration: `${config.duration}s`,
      animationIterationCount: config.loop ? 'infinite' : '1',
      animationDirection: config.reverse ? 'reverse' : 'normal',
    };
    return style;
  };

  const hasRgbSplit = config.shaderModules.includes('rgbSplit');
  const hasNoise = config.shaderModules.includes('noise');

  return (
    <div className="flex-1 flex flex-col bg-black">
      {/* Preview Area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative w-full h-full max-w-6xl flex items-center justify-center">
          {/* Image Glitch Canvas */}
          <div className="relative w-full h-full bg-gray-900 rounded-xl border border-gray-800 overflow-hidden flex items-center justify-center">
            <GlitchCanvas />

            {/* Compact Info Overlay */}
            <div className="absolute top-3 left-3 px-2.5 py-1.5 bg-black/80 backdrop-blur-sm rounded-md text-[10px] z-20 flex items-center gap-3">
              <span className="text-cyan-400">{config.duration}s</span>
              <span className="text-gray-500">|</span>
              <span className="text-magenta-400">{config.quality}</span>
              <span className="text-gray-500">|</span>
              <span className="text-yellow-400">{config.shaderModules.length || 0} FX</span>
            </div>

            {/* Animation Controls */}
            <div className="absolute top-3 right-3 z-20 flex gap-2">
              <button
                onClick={() => setIsAnimating(!isAnimating)}
                className="px-2.5 py-1.5 bg-black/80 backdrop-blur-sm hover:bg-black rounded-md text-xs transition-colors flex items-center gap-1.5"
              >
                {isAnimating ? '⏸️' : '▶️'}
                <span className="hidden sm:inline">{isAnimating ? 'Pause' : 'Play'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Stats Bar */}
      <div className="px-4 py-2 bg-gray-900 border-t border-gray-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <span className="text-gray-400">Active Effects:</span>
          <div className="flex gap-1.5">
            {config.shaderModules.length > 0 ? (
              config.shaderModules.map((module) => (
                <span
                  key={module}
                  className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded"
                >
                  {module}
                </span>
              ))
            ) : (
              <span className="text-gray-500">None</span>
            )}
          </div>
        </div>
        {config.imageSource && (
          <span className="text-green-400">✓ Image loaded</span>
        )}
      </div>
    </div>
  );
}
