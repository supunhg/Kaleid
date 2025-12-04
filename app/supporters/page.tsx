import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import BetaBanner from '@/components/BetaBanner';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support Kaleid - Help Us Build the Future',
  description: 'Support Kaleid development and help keep our glitch animation platform free and awesome. Join our amazing supporters!',
  openGraph: {
    title: 'Support Kaleid',
    description: 'Help us build the future of glitch art',
  },
};

export default function SupportersPage() {
  const supporters = [
    { name: 'Alex Chen', tier: 'Glitch Pioneer', amount: 100 },
    { name: 'Sarah Martinez', tier: 'Pixel Patron', amount: 50 },
    { name: 'Jamie Lee', tier: 'Pixel Patron', amount: 50 },
    { name: 'Morgan Blake', tier: 'Digital Supporter', amount: 25 },
    { name: 'Casey Jordan', tier: 'Digital Supporter', amount: 25 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <Navigation />
      <BetaBanner />
      
      <main className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Support Kaleid</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Help us keep Kaleid free and awesome. Your support funds development, 
            hosting, and new features.
          </p>
        </div>

        {/* Support Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 bg-gray-900 rounded-2xl border-2 border-yellow-500/50">
            <div className="text-3xl mb-3">⭐</div>
            <h3 className="text-xl font-bold mb-2">Glitch Pioneer</h3>
            <div className="text-3xl font-bold mb-4">$15</div>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>• Custom glitch effect showcase</li>
              <li>• Early access to new features</li>
              <li>• Priority support</li>
              <li>• Eternal gratitude ❤️</li>
            </ul>
          </div>

          <div className="p-6 bg-gray-900 rounded-2xl border-2 border-cyan-500/50">
            <div className="text-3xl mb-3">💎</div>
            <h3 className="text-xl font-bold mb-2">Pixel Patron</h3>
            <div className="text-3xl font-bold mb-4">$10</div>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>• Featured on supporter page</li>
              <li>• Beta feature access</li>
              <li>• Special recognition</li>
              <li>• Our sincere thanks 🙏</li>
            </ul>
          </div>

          <div className="p-6 bg-gray-900 rounded-2xl border-2 border-magenta-500/50">
            <div className="text-3xl mb-3">✨</div>
            <h3 className="text-xl font-bold mb-2">Digital Supporter</h3>
            <div className="text-3xl font-bold mb-4">$5</div>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>• Listed on supporter page</li>
              <li>• Community recognition</li>
              <li>• Good karma ✨</li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mb-16 p-8 bg-gray-900 rounded-2xl border border-gray-800">
          <h2 className="text-2xl font-bold mb-4">Ready to Support?</h2>
          <p className="text-gray-400 mb-6">
            Choose your contribution level and help us build the future of glitch art
          </p>
          <div className="flex gap-4 justify-center">
            <button className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-magenta-500 rounded-full font-bold hover:scale-105 transition-transform">
              Support via PayPal
            </button>
            <div className="relative">
              <button className="px-8 py-3 border-2 border-gray-700 rounded-full font-bold blur-sm">
                Support via Stripe
              </button>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-cyan-400">
                Coming Soon
              </span>
            </div>
          </div>
        </div>

        {/* Supporters List */}
        <div>
          <h2 className="text-3xl font-bold mb-8 text-center">Our Amazing Supporters</h2>
          <div className="space-y-4">
            {supporters.map((supporter, index) => (
              <div
                key={index}
                className="p-4 bg-gray-900 rounded-xl border border-gray-800 flex items-center justify-between hover:border-cyan-500 transition-colors"
              >
                <div>
                  <div className="font-bold text-lg glitch-text" data-text={supporter.name}>
                    {supporter.name}
                  </div>
                  <div className="text-sm text-gray-400">{supporter.tier}</div>
                </div>
                <div className="text-cyan-400 font-bold">${supporter.amount}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Thank You Message */}
        <div className="mt-16 text-center p-8 bg-gradient-to-r from-gray-900 to-black rounded-2xl border border-gray-800">
          <p className="text-gray-300 text-lg">
            Every contribution, no matter the size, makes a huge difference. 
            Thank you for believing in Kaleid! 🙏
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
