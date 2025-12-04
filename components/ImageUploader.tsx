'use client';

import { useGlitchStore } from '@/lib/store';

export default function ImageUploader() {
  const { config, setConfig } = useGlitchStore();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageDataUrl = event.target?.result as string;
      setConfig({ imageSource: imageDataUrl, renderMode: 'image' });
    };
    reader.readAsDataURL(file);
  };

  const loadSampleImage = (imagePath: string) => {
    setConfig({ imageSource: imagePath, renderMode: 'image' });
  };

  const clearImage = () => {
    setConfig({ imageSource: undefined });
  };

  return (
    <div>
      {/* Current Image Preview */}
      {config.imageSource ? (
        <div className="relative mb-3 rounded-lg overflow-hidden border border-gray-700 group">
          <img
            src={config.imageSource}
            alt="Preview"
            className="w-full h-32 object-cover"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <label className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-600 rounded text-xs font-medium cursor-pointer transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              Change
            </label>
            <button
              onClick={clearImage}
              className="px-3 py-1.5 bg-red-500 hover:bg-red-600 rounded text-xs font-medium transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <label className="block w-full px-4 py-8 bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg text-center cursor-pointer hover:border-cyan-500 transition-colors mb-3">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="text-3xl mb-2">📁</div>
          <div className="text-xs text-gray-400">Click to upload image</div>
        </label>
      )}

      {/* Sample Images */}
      <div>
        <p className="text-xs text-gray-400 mb-2">Quick samples:</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => loadSampleImage('https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=800')}
            className="px-2 py-1.5 bg-gray-800 border border-gray-700 rounded text-xs hover:border-cyan-500 transition-colors"
          >
            🌆 City
          </button>
          <button
            onClick={() => loadSampleImage('https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800')}
            className="px-2 py-1.5 bg-gray-800 border border-gray-700 rounded text-xs hover:border-cyan-500 transition-colors"
          >
            👤 Portrait
          </button>
          <button
            onClick={() => loadSampleImage('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800')}
            className="px-2 py-1.5 bg-gray-800 border border-gray-700 rounded text-xs hover:border-cyan-500 transition-colors"
          >
            🌌 Space
          </button>
          <button
            onClick={() => loadSampleImage('https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800')}
            className="px-2 py-1.5 bg-gray-800 border border-gray-700 rounded text-xs hover:border-cyan-500 transition-colors"
          >
            🎨 Abstract
          </button>
          <button
            onClick={() => loadSampleImage('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800')}
            className="px-2 py-1.5 bg-gray-800 border border-gray-700 rounded text-xs hover:border-cyan-500 transition-colors"
          >
            🎭 Neon
          </button>
          <button
            onClick={() => loadSampleImage('https://images.unsplash.com/photo-1518770660439-4636190af475?w=800')}
            className="px-2 py-1.5 bg-gray-800 border border-gray-700 rounded text-xs hover:border-cyan-500 transition-colors"
          >
            💻 Tech
          </button>
          <button
            onClick={() => loadSampleImage('https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800')}
            className="px-2 py-1.5 bg-gray-800 border border-gray-700 rounded text-xs hover:border-cyan-500 transition-colors"
          >
            🌈 Gradient
          </button>
          <button
            onClick={() => loadSampleImage('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800')}
            className="px-2 py-1.5 bg-gray-800 border border-gray-700 rounded text-xs hover:border-cyan-500 transition-colors"
          >
            🏔️ Nature
          </button>
        </div>
      </div>
    </div>
  );
}

