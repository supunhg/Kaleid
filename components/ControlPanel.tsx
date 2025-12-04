'use client';

import { useState } from 'react';
import { useGlitchStore } from '@/lib/store';
import ImageUploader from './ImageUploader';
import EffectToggler from './EffectToggler';
import HistoryControls from './HistoryControls';
import SavedPresetsList from './SavedPresetsList';
import { glitchPresets } from '@/lib/presets';
import { GlitchExporter, downloadBlob } from '@/lib/export';
import LocalSaveModal from './LocalSaveModal';
import ShareModal from './ShareModal';
import { SuccessMessage } from './LoadingStates';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

export default function ControlPanel() {
  const { config, setConfig } = useGlitchStore();
  const [activeTab, setActiveTab] = useState<'image' | 'effects' | 'settings'>('image');
  const [isExporting, setIsExporting] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const loadPreset = (presetId: string) => {
    const preset = glitchPresets.find((p) => p.id === presetId);
    if (preset) {
      setConfig(preset.config);
    }
  };

  const handleExportImage = async () => {
    if (!config.imageSource) {
      alert('Please upload an image first');
      return;
    }

    try {
      setIsExporting(true);
      const exporter = new GlitchExporter();
      await exporter.loadImage(config.imageSource);
      const blob = await exporter.exportImage(config, 0.5);
      downloadBlob(blob, `kaleid-glitch-${Date.now()}.png`);
      setSuccessMessage('Image exported successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportVideo = async () => {
    if (!config.imageSource) {
      alert('Please upload an image first');
      return;
    }

    try {
      setIsExporting(true);
      const exporter = new GlitchExporter();
      await exporter.loadImage(config.imageSource);
      const blob = await exporter.exportMP4(config, config.duration, 30);
      downloadBlob(blob, `kaleid-glitch-${Date.now()}.webm`);
      setSuccessMessage('Video exported successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleSaveConfig = () => {
    const configJson = JSON.stringify(config, null, 2);
    const blob = new Blob([configJson], { type: 'application/json' });
    downloadBlob(blob, `kaleid-config-${Date.now()}.json`);
    setSuccessMessage('Config saved successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Keyboard shortcuts
  useKeyboardShortcuts({
    shortcuts: [
      {
        key: 'e',
        ctrl: true,
        action: handleExportImage,
        description: 'Export Image',
      },
      {
        key: 's',
        ctrl: true,
        action: () => setShowSaveModal(true),
        description: 'Save Preset Locally',
      },
      {
        key: '1',
        action: () => setActiveTab('image'),
        description: 'Image Tab',
      },
      {
        key: '2',
        action: () => setActiveTab('effects'),
        description: 'Effects Tab',
      },
      {
        key: '3',
        action: () => setActiveTab('settings'),
        description: 'Settings Tab',
      },
      {
        key: 'h',
        action: () => setShowShareModal(true),
        description: 'Share',
      },
    ],
  });

  return (
    <>
      <div className="w-full lg:w-96 bg-gray-900 border-r border-gray-800 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-magenta-400 bg-clip-text text-transparent">
              Glitch Editor
            </h2>
            <HistoryControls />
          </div>
          {successMessage && (
            <SuccessMessage
              message={successMessage}
              onDismiss={() => setSuccessMessage('')}
              className="mt-3"
            />
          )}
        </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        <button
          onClick={() => setActiveTab('image')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'image'
              ? 'bg-gray-800 text-cyan-400 border-b-2 border-cyan-400'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          🖼️ Image
        </button>
        <button
          onClick={() => setActiveTab('effects')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'effects'
              ? 'bg-gray-800 text-magenta-400 border-b-2 border-magenta-400'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          ✨ Effects
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'settings'
              ? 'bg-gray-800 text-yellow-400 border-b-2 border-yellow-400'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          ⚙️ Settings
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Image Tab */}
        {activeTab === 'image' && (
          <div>
            <ImageUploader />
            
            {/* Built-in Presets */}
            <div className="mt-4">
              <label className="block text-xs font-medium text-gray-400 mb-2">Built-in Presets</label>
              <div className="grid grid-cols-2 gap-2">
                {glitchPresets.slice(0, 6).map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => loadPreset(preset.id)}
                    className="px-2 py-2 bg-gray-800 border border-gray-700 rounded-lg text-xs hover:border-cyan-500 transition-colors text-left"
                  >
                    <div className="font-medium truncate">{preset.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Saved Presets */}
            <div className="mt-4">
              <SavedPresetsList />
            </div>
            
            <div className="mt-4">
              <label className="block text-xs font-medium text-gray-400 mb-2">Effect Name</label>
              <input
                type="text"
                value={config.effectName}
                onChange={(e) => setConfig({ effectName: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        )}

        {/* Effects Tab */}
        {activeTab === 'effects' && (
          <div className="space-y-4">
            {/* Effect Toggles */}
            <EffectToggler />

            <div className="border-t border-gray-800 pt-4">
              <label className="block text-sm font-medium mb-3">Parameters</label>
            
            {/* RGB Split */}
            {config.params.splitDistance !== undefined && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-medium text-gray-400">RGB Split</label>
                  <span className="text-xs text-cyan-400">{config.params.splitDistance.toFixed(0)}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="1"
                  value={config.params.splitDistance}
                  onChange={(e) => setConfig({ params: { ...config.params, splitDistance: parseFloat(e.target.value) } })}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>
            )}

            {/* Noise Intensity */}
            {config.params.noiseIntensity !== undefined && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-medium text-gray-400">Noise</label>
                  <span className="text-xs text-cyan-400">{config.params.noiseIntensity.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={config.params.noiseIntensity}
                  onChange={(e) => setConfig({ params: { ...config.params, noiseIntensity: parseFloat(e.target.value) } })}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>
            )}

            {/* Block Size */}
            {config.params.blockSize !== undefined && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-medium text-gray-400">Block Size</label>
                  <span className="text-xs text-cyan-400">{config.params.blockSize.toFixed(0)}px</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={config.params.blockSize}
                  onChange={(e) => setConfig({ params: { ...config.params, blockSize: parseFloat(e.target.value) } })}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>
            )}

            {/* Pixel Size */}
            {config.params.pixelSize !== undefined && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-medium text-gray-400">Pixelate</label>
                  <span className="text-xs text-cyan-400">{config.params.pixelSize.toFixed(0)}px</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="1"
                  value={config.params.pixelSize}
                  onChange={(e) => setConfig({ params: { ...config.params, pixelSize: parseFloat(e.target.value) } })}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>
            )}

            {/* Scanlines */}
            {config.params.scanlineOpacity !== undefined && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-medium text-gray-400">Scanlines</label>
                  <span className="text-xs text-cyan-400">{config.params.scanlineOpacity.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={config.params.scanlineOpacity}
                  onChange={(e) => setConfig({ params: { ...config.params, scanlineOpacity: parseFloat(e.target.value) } })}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>
            )}

            {/* Color Shift */}
            {config.params.colorShift !== undefined && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-medium text-gray-400">Color Shift</label>
                  <span className="text-xs text-cyan-400">{config.params.colorShift.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={config.params.colorShift}
                  onChange={(e) => setConfig({ params: { ...config.params, colorShift: parseFloat(e.target.value) } })}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>
            )}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-4">
            {/* Duration & Quality Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Duration</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0.5"
                    max="10"
                    step="0.1"
                    value={config.duration}
                    onChange={(e) => setConfig({ duration: parseFloat(e.target.value) })}
                    className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                  />
                  <span className="text-xs text-yellow-400 w-8">{config.duration.toFixed(1)}s</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Quality</label>
                <select
                  value={config.quality}
                  onChange={(e) => setConfig({ quality: e.target.value as any })}
                  className="w-full px-2 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-xs focus:outline-none focus:border-yellow-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-750 transition-colors">
                <span className="text-sm">Loop Animation</span>
                <input
                  type="checkbox"
                  checked={config.loop}
                  onChange={(e) => setConfig({ loop: e.target.checked })}
                  className="w-4 h-4 accent-yellow-500"
                />
              </label>
              <label className="flex items-center justify-between p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-750 transition-colors">
                <span className="text-sm">Reverse Direction</span>
                <input
                  type="checkbox"
                  checked={config.reverse}
                  onChange={(e) => setConfig({ reverse: e.target.checked })}
                  className="w-4 h-4 accent-yellow-500"
                />
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Export Footer */}
      <div className="p-4 border-t border-gray-800 space-y-2">
        <button
          onClick={handleExportImage}
          disabled={isExporting || !config.imageSource}
          className="w-full px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-magenta-500 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? '⏳ Exporting...' : '🖼️ Export Image (PNG)'}
        </button>
        <button
          onClick={handleExportVideo}
          disabled={isExporting || !config.imageSource}
          className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg font-bold text-sm hover:border-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? '⏳ Exporting...' : '🎬 Export Video (WebM)'}
        </button>
        <button
          onClick={handleSaveConfig}
          className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg font-bold text-sm hover:border-magenta-500 transition-colors"
        >
          💾 Save Config
        </button>
        <button
          onClick={() => setShowSaveModal(true)}
          disabled={!config.imageSource}
          className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg font-bold text-sm hover:border-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          💾 Save Preset Locally
        </button>
        <button
          onClick={() => setShowShareModal(true)}
          className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg font-bold text-sm hover:border-blue-500 transition-colors"
        >
          🔗 Share Preset
        </button>
      </div>
    </div>

    <LocalSaveModal
      isOpen={showSaveModal}
      onClose={() => setShowSaveModal(false)}
    />
    <ShareModal
      isOpen={showShareModal}
      onClose={() => setShowShareModal(false)}
    />
  </>
  );
}
