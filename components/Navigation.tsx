'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import AuthModal from './AuthModal';
import { getCurrentUser, signOut } from '@/lib/auth';

export default function Navigation() {
  const pathname = usePathname();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<any>(null);

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  };

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
  };

  return (
    <>
      <nav className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-magenta-400 bg-clip-text text-transparent">
                KALEID
              </span>
            </Link>

            {/* Nav Links */}
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className={`hover:text-cyan-400 transition-colors ${
                  isActive('/') ? 'text-cyan-400' : 'text-gray-300'
                }`}
              >
                Home
              </Link>
              <Link
                href="/editor"
                className={`hover:text-cyan-400 transition-colors ${
                  isActive('/editor') ? 'text-cyan-400' : 'text-gray-300'
                }`}
              >
                Editor
              </Link>
              <Link
                href="/gallery"
                className={`hover:text-cyan-400 transition-colors ${
                  isActive('/gallery') ? 'text-cyan-400' : 'text-gray-300'
                }`}
              >
                Gallery
              </Link>
              <Link
                href="/supporters"
                className={`hover:text-cyan-400 transition-colors ${
                  isActive('/supporters') ? 'text-cyan-400' : 'text-gray-300'
                }`}
              >
                Support
              </Link>
              
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400">{user.email}</span>
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 border border-gray-700 rounded-full text-sm font-bold hover:border-cyan-500 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-magenta-500 rounded-full text-sm font-bold hover:opacity-90 transition-opacity"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={loadUser}
      />
    </>
  );
}
