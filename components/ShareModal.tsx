'use client';

import { useState } from 'react';
import { useGlitchStore } from '@/lib/store';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareModal({ isOpen, onClose }: ShareModalProps) {
  const { config } = useGlitchStore();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateShareUrl = () => {
    const params = new URLSearchParams();
    params.set('config', btoa(JSON.stringify(config)));
    return `${window.location.origin}/editor?${params.toString()}`;
  };

  const shareUrl = generateShareUrl();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const shareOnTwitter = () => {
    const text = `Check out my glitch effect created with Kaleid!`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Share Your Creation</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Share URL */}
          <div>
            <label className="block text-sm font-medium mb-2">Shareable Link</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-sm font-medium transition-colors"
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Anyone with this link can view and edit your preset
            </p>
          </div>

          {/* Social Share Buttons */}
          <div>
            <label className="block text-sm font-medium mb-2">Share on Social Media</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={shareOnTwitter}
                className="px-4 py-2 bg-[#1DA1F2] hover:opacity-90 rounded-lg text-sm font-medium transition-opacity flex items-center justify-center gap-2"
              >
                <span>🐦</span> Twitter
              </button>
              <button
                onClick={shareOnFacebook}
                className="px-4 py-2 bg-[#4267B2] hover:opacity-90 rounded-lg text-sm font-medium transition-opacity flex items-center justify-center gap-2"
              >
                <span>📘</span> Facebook
              </button>
            </div>
          </div>

          {/* QR Code Placeholder */}
          <div className="p-4 bg-gray-800 rounded-lg text-center">
            <div className="text-6xl mb-2">📱</div>
            <p className="text-xs text-gray-400">
              Scan QR code feature coming soon!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
