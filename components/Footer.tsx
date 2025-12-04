'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="px-6 py-8 border-t border-gray-800 bg-gray-900/50">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
          <div className="text-center md:text-left">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-magenta-400 bg-clip-text text-transparent">
              KALEID
            </Link>
            <p className="text-gray-400 text-sm mt-1">Modern Glitch Animation Platform</p>
          </div>
          <div className="flex gap-6">
            <Link href="/editor" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
              Editor
            </Link>
            <Link href="/gallery" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
              Gallery
            </Link>
            <Link href="/supporters" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
              Support
            </Link>
            <a href="https://github.com/supunhg" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
              GitHub
            </a>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-4 flex flex-col md:flex-row justify-between items-center gap-2 text-sm text-gray-500">
          <p>© 2025 Kaleid. All rights reserved.</p>
          <p>
            Created by{' '}
            <a 
              href="https://github.com/supunhg" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Supun Hewagamage
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
