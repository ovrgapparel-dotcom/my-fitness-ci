import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MY FITNESS · Club Sport & Santé · Ivoire Trade Center',
  description: 'Réservez vos cours de fitness, biking et functional training à Ivoire Trade Center, Cocody, Abidjan. Visite virtuelle 3D interactive.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-[#0a0a0c] text-neutral-100 selection:bg-brand-red selection:text-white">
        {children}
      </body>
    </html>
  );
}
