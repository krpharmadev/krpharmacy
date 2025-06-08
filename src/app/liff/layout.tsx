'use client';

import { LIFFProvider } from '../../contexts/LIFFProvider';

export default function LIFFLayout({ children }: { children: React.ReactNode }) {
  return (
    <LIFFProvider>
      <div className="min-h-screen bg-gray-100">
        {children}
      </div>
    </LIFFProvider>
  );
}