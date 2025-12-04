'use client';

import Navigation from '@/components/Navigation';
import BetaBanner from '@/components/BetaBanner';
import ControlPanel from '@/components/ControlPanel';
import PreviewCanvas from '@/components/PreviewCanvas';
import PerformanceStats from '@/components/PerformanceStats';
import { getPerformanceMonitor } from '@/components/GlitchCanvas';
import { useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { useGlitchStore } from '@/lib/store';

function EditorContent() {
  const searchParams = useSearchParams();
  const { setConfig } = useGlitchStore();
  const performanceMonitor = getPerformanceMonitor();

  useEffect(() => {
    // Load config from URL if present
    const configParam = searchParams.get('config');
    const presetParam = searchParams.get('preset');
    
    if (configParam) {
      try {
        const decodedConfig = JSON.parse(atob(configParam));
        setConfig(decodedConfig);
      } catch (error) {
        console.error('Failed to load config from URL:', error);
      }
    } else if (presetParam) {
      // Load preset by ID
      const { glitchPresets } = require('@/lib/presets');
      const preset = glitchPresets.find((p: any) => p.id === presetParam);
      if (preset) {
        setConfig(preset.config);
      }
    }
  }, [searchParams, setConfig]);

  return (
    <>
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Controls */}
        <ControlPanel />

        {/* Main Area - Preview */}
        <PreviewCanvas />

        {/* Performance Stats */}
        <PerformanceStats monitor={performanceMonitor} />
      </div>
    </>
  );
}

export default function EditorPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navigation />
      <BetaBanner />
      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">Loading editor...</div>
        </div>
      }>
        <EditorContent />
      </Suspense>
    </div>
  );
}
