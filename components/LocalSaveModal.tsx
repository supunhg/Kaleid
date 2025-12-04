'use client';

import { useState } from 'react';
import { savePreset, getSavedPresets, deletePreset } from '@/lib/localStorage';
import { useGlitchStore } from '@/lib/store';
import { downloadBlob } from '@/lib/export';
import { SuccessMessage, ErrorMessage } from './LoadingStates';

interface LocalSaveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LocalSaveModal({ isOpen, onClose }: LocalSaveModalProps) {
  const { config } = useGlitchStore();
  const [presetName, setPresetName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (!presetName.trim()) {
      setError('Please enter a preset name');
      return;
    }

    try {
      savePreset(presetName.trim(), config);
      setSuccess(`Preset "${presetName}" saved to browser!`);
      setTimeout(() => {
        onClose();
        setPresetName('');
        setSuccess('');
        setError('');
      }, 1500);
    } catch (err) {
      setError('Failed to save preset');
    }
  };

  const handleExportData = () => {
    const presets = getSavedPresets();
    const dataStr = JSON.stringify(presets, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    downloadBlob(blob, `kaleid-presets-${Date.now()}.json`);
    setSuccess('Presets exported!');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-magenta-400 bg-clip-text text-transparent">
          Save Preset Locally
        </h2>
        <p className="text-sm text-gray-400 mb-4">
          Saves to your browser's local storage (no account needed)
        </p>

        <input
          type="text"
          value={presetName}
          onChange={(e) => setPresetName(e.target.value)}
          placeholder="Enter preset name..."
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-cyan-500 focus:outline-none mb-4"
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
        />

        {error && <ErrorMessage message={error} onDismiss={() => setError('')} className="mb-4" />}
        {success && <SuccessMessage message={success} onDismiss={() => setSuccess('')} className="mb-4" />}

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={!presetName.trim()}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-magenta-500 rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Save Preset
          </button>
          <button
            onClick={onClose}
            className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg font-bold hover:border-cyan-500 transition-colors"
          >
            Cancel
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-800">
          <button
            onClick={handleExportData}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm hover:border-cyan-500 transition-colors"
          >
            📦 Export All Presets (Backup)
          </button>
        </div>
      </div>
    </div>
  );
}
