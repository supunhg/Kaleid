import Link from 'next/link';
import { glitchPresets } from '@/lib/presets';
import LiveGlitchPreview from '@/components/LiveGlitchPreview';
import Navigation from '@/components/Navigation';
import BetaBanner from '@/components/BetaBanner';
import Footer from '@/components/Footer';

const SAMPLE_IMAGE = 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=600';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <Navigation />
      <BetaBanner />
      {/* Hero Section */}
      <section className="relative px-6 py-20 text-center">
        <div className="max-w-5xl mx-auto">
          <h1 
            className="glitch-text text-6xl md:text-8xl font-bold mb-6" 
            data-text="KALEID"
          >
            KALEID
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Create stunning glitch animations with real-time preview. 
            No coding required.
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/editor"
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-magenta-500 rounded-full font-bold text-lg hover:scale-105 transition-transform"
            >
              Start Creating
            </Link>
            <Link 
              href="/gallery"
              className="px-8 py-4 border-2 border-gray-600 rounded-full font-bold text-lg hover:border-cyan-500 transition-colors"
            >
              View Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800 hover:border-cyan-500 transition-colors">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2">Real-Time Preview</h3>
            <p className="text-gray-400">
              See your glitch effects come to life instantly as you adjust parameters
            </p>
          </div>
          <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800 hover:border-magenta-500 transition-colors">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-bold mb-2">Preset Library</h3>
            <p className="text-gray-400">
              Start with professionally designed presets or create from scratch
            </p>
          </div>
          <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800 hover:border-yellow-500 transition-colors">
            <div className="text-4xl mb-4">💾</div>
            <h3 className="text-xl font-bold mb-2">Export & Save</h3>
            <p className="text-gray-400">
              Export as GIF, MP4, or save your configurations to the cloud
            </p>
          </div>
        </div>
      </section>

      {/* Presets Preview */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4">Live Glitch Previews</h2>
        <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
          Watch real-time glitch effects in action. Click any preview to start creating with that preset.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {glitchPresets.slice(0, 8).map((preset) => (
            <Link
              key={preset.id}
              href={`/editor?preset=${preset.id}`}
              className="block"
            >
              <LiveGlitchPreview
                config={preset.config}
                imageUrl={SAMPLE_IMAGE}
                title={preset.name}
              />
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-3xl mx-auto p-12 bg-gradient-to-r from-gray-900 to-black rounded-3xl border border-gray-800">
          <h2 className="text-4xl font-bold mb-4">Ready to Create?</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Join thousands of creators making amazing glitch art
          </p>
          <Link 
            href="/editor"
            className="inline-block px-10 py-4 bg-gradient-to-r from-cyan-500 to-magenta-500 rounded-full font-bold text-lg hover:scale-105 transition-transform"
          >
            Launch Editor
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
