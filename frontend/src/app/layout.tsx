import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GearGuard - Equipment Management',
  description:
    'Equipment management and tracking application built with Next.js, React, and TypeScript',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
