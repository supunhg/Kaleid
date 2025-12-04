import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Glitch Editor - Kaleid',
  description: 'Create and customize stunning glitch animations with real-time preview. Interactive editor with professional presets.',
  openGraph: {
    title: 'Glitch Editor - Kaleid',
    description: 'Create stunning glitch animations in real-time',
  },
};

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
