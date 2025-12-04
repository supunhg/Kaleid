'use client';

import { useEffect, useState } from 'react';
import { PerformanceMonitor } from '@/lib/performance';

interface PerformanceStatsProps {
  monitor: PerformanceMonitor;
}

export default function PerformanceStats({ monitor }: PerformanceStatsProps) {
  const [metrics, setMetrics] = useState({
    fps: 0,
    frameTime: 0,
    renderTime: 0,
    memoryUsage: undefined as number | undefined,
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(monitor.getMetrics());
    }, 500); // Update every 500ms

    return () => clearInterval(interval);
  }, [monitor]);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 px-3 py-2 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-lg text-xs font-mono hover:border-cyan-500 transition-colors z-50"
      >
        📊 Stats
      </button>
    );
  }

  const getFpsColor = (fps: number) => {
    if (fps >= 50) return 'text-green-400';
    if (fps >= 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-lg p-3 text-xs font-mono z-50 min-w-[180px]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-400 font-semibold">Performance</span>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-300 transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between">
          <span className="text-gray-400">FPS:</span>
          <span className={getFpsColor(metrics.fps)}>{metrics.fps}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Frame:</span>
          <span className="text-gray-300">{metrics.frameTime}ms</span>
        </div>
        {metrics.memoryUsage !== undefined && (
          <div className="flex justify-between">
            <span className="text-gray-400">Memory:</span>
            <span className="text-gray-300">
              {(metrics.memoryUsage * 100).toFixed(1)}%
            </span>
          </div>
        )}
      </div>

      <div className="mt-2 pt-2 border-t border-gray-700">
        <div className="flex justify-between items-center">
          <span className="text-gray-500 text-[10px]">Press P to toggle</span>
        </div>
      </div>
    </div>
  );
}
