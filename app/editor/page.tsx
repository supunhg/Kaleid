'use client';

import Navigation from '@/components/Navigation';
import BetaBanner from '@/components/BetaBanner';
import ControlPanel from '@/components/ControlPanel';
import PreviewCanvas from '@/components/PreviewCanvas';
import PerformanceStats from '@/components/PerformanceStats';
import { useCanvasPerformanceMonitor } from '@/components/GlitchCanvas';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useGlitchStore } from '@/lib/store';

export default function EditorPage() {
  const searchParams = useSearchParams();
  const { setConfig } = useGlitchStore();
  const performanceMonitor = useCanvasPerformanceMonitor();

  useEffect(() => {
    // Load config from URL if present
    const configParam = searchParams.get('config');
    if (configParam) {
      try {
        const decodedConfig = JSON.parse(atob(configParam));
        setConfig(decodedConfig);
      } catch (error) {
        console.error('Failed to load config from URL:', error);
      }
    }
  }, [searchParams, setConfig]);
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navigation />
      <BetaBanner />
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Controls */}
        <ControlPanel />

        {/* Main Area - Preview */}
        <PreviewCanvas />

        {/* Performance Stats */}
        <PerformanceStats monitor={performanceMonitor} />
      </div>
    </div>
  );
}
