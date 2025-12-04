import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kaleid - Modern Glitch Animation Platform',
  description: 'Create, customize, and export stunning glitch effects with real-time preview',
  keywords: ['glitch', 'animation', 'effects', 'webgl', 'creative tools'],
  authors: [{ name: 'Kaleid' }],
  openGraph: {
    title: 'Kaleid - Modern Glitch Animation Platform',
    description: 'Create stunning glitch effects with real-time preview',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
