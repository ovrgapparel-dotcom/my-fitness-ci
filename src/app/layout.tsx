import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#0a0a0c',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://my-fitness.ci'),
  title: 'MY FITNESS · Club Sport & Santé · Ivoire Trade Center',
  description:
    'Club d\'entraînement haut de gamme à l\'Ivoire Trade Center, Cocody, Abidjan. Studios Biking, Fonctionnel et Cours Collectifs. Visite virtuelle 3D interactive, planning 2026 et réservation en ligne.',
  applicationName: 'MY FITNESS',
  authors: [{ name: 'MY FITNESS ITC Cocody' }],
  generator: 'Next.js',
  keywords: [
    'MY FITNESS',
    'Salle de sport Abidjan',
    'Ivoire Trade Center',
    'Fitness Cocody',
    'Biking Abidjan',
    'Cross Training Côte d\'Ivoire',
    'Musculation ITC',
    'Coaching sportif Abidjan',
    'Sport Santé Abidjan',
  ],
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/assets/logo.png', type: 'image/png' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    shortcut: '/assets/logo.png',
    apple: [
      { url: '/assets/logo.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'MY FITNESS · Club Sport & Santé · Ivoire Trade Center',
    description:
      'Club d\'entraînement d\'exception à Abidjan. Studios Biking, Fonctionnel & Collectifs. Visite 3D immersive et planning des cours.',
    url: 'https://my-fitness.ci',
    siteName: 'MY FITNESS - Mon rdv sport & santé',
    images: [
      {
        url: '/assets/logo.png',
        width: 1200,
        height: 630,
        alt: 'MY FITNESS - Logo Officiel 3D Métallique Chrome Rouge',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MY FITNESS · Club Sport & Santé · Ivoire Trade Center',
    description:
      'Club d\'entraînement d\'exception à Abidjan. Studios Biking, Fonctionnel & Collectifs. Visite 3D immersive et planning des cours.',
    images: ['/assets/logo.png'],
    creator: '@myfitnessci',
  },
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
