'use client';

import Navigation from '@/components/Navigation';
import BetaBanner from '@/components/BetaBanner';
import Footer from '@/components/Footer';
import { useEffect, useState } from 'react';
import { getPublicCreations } from '@/lib/gallery';
import LiveGlitchPreview from '@/components/LiveGlitchPreview';
import type { Creation } from '@/types/glitch';

export default function GalleryPage() {
  const [creations, setCreations] = useState<Creation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCreations();
  }, []);

  const loadCreations = async () => {
    setLoading(true);
    const { data, error } = await getPublicCreations(24);
    if (data && !error) {
      setCreations(data);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex flex-col">
      <Navigation />
      <BetaBanner />
      
      <main className="max-w-6xl mx-auto px-6 py-16 flex-1">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Gallery</h1>
          <p className="text-xl text-gray-300">
            Explore amazing glitch creations from our community
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="text-6xl mb-4 animate-pulse">⏳</div>
              <p className="text-gray-400">Loading creations...</p>
            </div>
          </div>
        ) : creations.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {creations.map((creation) => (
              <div key={creation.id}>
                <LiveGlitchPreview
                  config={creation.config}
                  imageUrl={creation.config.imageSource || ''}
                  title={creation.config.effectName}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="text-6xl mb-4">🎨</div>
              <h2 className="text-2xl font-bold mb-2">No Public Creations Yet</h2>
              <p className="text-gray-400 mb-6">
                Be the first to share your glitch art with the community!
              </p>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
