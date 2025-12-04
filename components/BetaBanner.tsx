'use client';

import { useState, useEffect } from 'react';

export default function BetaBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('beta-banner-dismissed');
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('beta-banner-dismissed', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-cyan-500/20 to-magenta-500/20 border-b border-cyan-500/30">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <span className="text-cyan-400 text-lg">🚧</span>
            <p className="text-sm text-gray-200">
              <strong className="font-semibold">Beta Version:</strong> Kaleid is in active development. 
              Some features are still being built and may not function as expected. Thank you for your patience!
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/10"
            aria-label="Dismiss banner"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
