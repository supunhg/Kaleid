'use client';

import { useState } from 'react';
import { useGlitchStore } from '@/lib/store';
import { saveCreation } from '@/lib/gallery';
import { getCurrentUser } from '@/lib/auth';

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SaveModal({ isOpen, onClose, onSuccess }: SaveModalProps) {
  const { config } = useGlitchStore();
  const [effectName, setEffectName] = useState(config.effectName || 'My Glitch Effect');
  const [isPublic, setIsPublic] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSave = async () => {
    setError('');
    setSaving(true);

    try {
      const user = await getCurrentUser();
      if (!user) {
        setError('Please sign in to save your creation');
        setSaving(false);
        return;
      }

      const updatedConfig = { ...config, effectName };
      const { error: saveError } = await saveCreation(user.id, updatedConfig, isPublic);

      if (saveError) {
        setError(saveError.message);
      } else {
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save creation');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Save to Gallery</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="effectName" className="block text-sm font-medium mb-2">
              Effect Name
            </label>
            <input
              id="effectName"
              type="text"
              value={effectName}
              onChange={(e) => setEffectName(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-cyan-500"
              placeholder="My Awesome Glitch"
              required
            />
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-800 rounded-lg">
            <input
              id="isPublic"
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-5 h-5 accent-cyan-500"
            />
            <label htmlFor="isPublic" className="text-sm cursor-pointer">
              <div className="font-medium">Make Public</div>
              <div className="text-gray-400">Share with the community in the gallery</div>
            </label>
          </div>

          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg text-sm text-red-200">
              {error}
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={saving || !effectName.trim()}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-magenta-500 rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Creation'}
          </button>
        </div>
      </div>
    </div>
  );
}
