'use client';

import React, { useRef } from 'react';
import { Calendar, PlayCircle, Smartphone, ExternalLink, Maximize } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const toggleFullscreen = () => {
    if (iframeRef.current) {
      if (iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen();
      }
    }
  };

  return (
    <section
      id="hero-tour"
      className="relative pt-10 pb-16 overflow-hidden bg-gradient-to-b from-[#0a0a0c] via-[#111115] to-[#0a0a0c]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-10">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-red/20 border border-brand-red/40 text-red-300 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
              Plateau Fitness d'Exception · Ivoire Trade Center Cocody
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] uppercase">
              L'excellence du sport{' '}
              <span className="text-brand-red underline decoration-brand-gold decoration-4 underline-offset-8">
                en immersion 3D
              </span>
            </h1>

            <p className="text-neutral-300 text-base sm:text-lg max-w-2xl leading-relaxed">
              Explorez nos 3 studios d'entraînement (Fonctionnel, Cours Collectifs, Biking) et réservez vos séances en temps réel. Naviguez dans la visite virtuelle 3D ci-dessous ou scannez le QR code pour vivre l'expérience en réalité augmentée.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#planning"
                className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-dark text-white px-6 py-3.5 rounded-xl font-extrabold text-sm shadow-lg shadow-brand-red/20 hover:shadow-xl transition-all"
              >
                <Calendar className="w-4 h-4 text-brand-gold" />
                Voir le planning des cours
              </a>
              <button
                onClick={toggleFullscreen}
                className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-100 border border-neutral-700 px-5 py-3.5 rounded-xl font-bold text-sm shadow-sm transition-all"
              >
                <PlayCircle className="w-4 h-4 text-brand-red" />
                Visite 3D plein écran
              </button>
            </div>
          </div>

          {/* Quick Access QR Card for Mobile 3D Immersion */}
          <div className="lg:col-span-5">
            <div className="bg-neutral-900/90 rounded-2xl border border-neutral-800 p-6 shadow-2xl relative overflow-hidden backdrop-blur-sm">
              <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-brand-red/20 rounded-full blur-3xl pointer-events-none" />
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black tracking-wider uppercase text-brand-gold flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4" />
                  Expérience Mobile 3D
                </span>
                <span className="text-[10px] font-bold bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded-md border border-neutral-700">
                  AR / VR Ready
                </span>
              </div>

              <div className="flex items-center gap-5">
                <div className="w-32 h-32 p-2 bg-white rounded-xl border-2 border-brand-red/50 shadow-inner shrink-0 flex items-center justify-center">
                  <img
                    src="/assets/qr-code.png"
                    alt="QR Code Visite 3D"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://my.matterport.com/show/?m=QLt2w88DUC7';
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <h2 className="font-extrabold text-sm text-white">Scannez pour visiter sur mobile</h2>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Pointez l'appareil photo de votre smartphone pour naviguer dans la salle en 3D immersive.
                  </p>
                  <a
                    href="https://my.matterport.com/show/?m=QLt2w88DUC7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-gold hover:text-white transition-colors"
                  >
                    Ouvrir le lien direct
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FULL-FRAME MATTERPORT 3D IFRAME CONTAINER */}
        <div className="bg-neutral-900 p-2.5 sm:p-3 rounded-2xl border border-neutral-800 shadow-2xl">
          <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-950 text-white rounded-xl mb-3 text-xs border border-neutral-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold tracking-wide uppercase text-neutral-200">
                Visite Virtuelle 3D Interactive · MY FITNESS (ITC Cocody)
              </span>
            </div>
            <button
              onClick={toggleFullscreen}
              className="hover:text-brand-gold flex items-center gap-1 font-semibold text-neutral-300 transition-colors"
            >
              <Maximize className="w-3.5 h-3.5" />
              Plein écran
            </button>
          </div>

          {/* Full frame 3D Tour */}
          <div className="matterport-container bg-neutral-950 border border-neutral-800/80">
            <iframe
              ref={iframeRef}
              src="https://my.matterport.com/show/?m=QLt2w88DUC7"
              className="w-full h-full border-0"
              allowFullScreen
              allow="fullscreen; vr; xr; accelerometer; gyroscope"
              title="MY FITNESS Virtual Tour"
            />
          </div>

          {/* Studio Quick Previews Row */}
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <a
              href="#studios"
              className="group p-2 rounded-xl bg-neutral-950/80 border border-neutral-800 hover:border-brand-red flex items-center gap-2.5 transition-all"
            >
              <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-neutral-700">
                <img
                  src="/assets/studios/studio-biking.jpg"
                  alt="Studio Biking"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
              </div>
              <div className="text-[11px] leading-tight">
                <div className="font-bold text-white group-hover:text-brand-gold">Studio Biking</div>
                <div className="text-[9px] text-neutral-400">RPM Immersif</div>
              </div>
            </a>

            <a
              href="#studios"
              className="group p-2 rounded-xl bg-neutral-950/80 border border-neutral-800 hover:border-brand-red flex items-center gap-2.5 transition-all"
            >
              <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-neutral-700">
                <img
                  src="/assets/studios/studio-collectifs.jpg"
                  alt="Studio Collectifs"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
              </div>
              <div className="text-[11px] leading-tight">
                <div className="font-bold text-white group-hover:text-brand-gold">Cours Collectifs</div>
                <div className="text-[9px] text-neutral-400">Pilates & Danse</div>
              </div>
            </a>

            <a
              href="#studios"
              className="group p-2 rounded-xl bg-neutral-950/80 border border-neutral-800 hover:border-brand-red flex items-center gap-2.5 transition-all"
            >
              <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-neutral-700">
                <img
                  src="/assets/studios/zone-fonctionnel-poids.jpg"
                  alt="Zone Fonctionnel"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
              </div>
              <div className="text-[11px] leading-tight">
                <div className="font-bold text-white group-hover:text-brand-gold">Zone Fonctionnel</div>
                <div className="text-[9px] text-neutral-400">Panatta & Poids</div>
              </div>
            </a>

            <a
              href="#studios"
              className="group p-2 rounded-xl bg-neutral-950/80 border border-neutral-800 hover:border-brand-red flex items-center gap-2.5 transition-all"
            >
              <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-neutral-700">
                <img
                  src="/assets/studios/vestiaires-vip.jpg"
                  alt="Vestiaires VIP"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
              </div>
              <div className="text-[11px] leading-tight">
                <div className="font-bold text-white group-hover:text-brand-gold">Vestiaires VIP</div>
                <div className="text-[9px] text-neutral-400">Casiers Digitaux</div>
              </div>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
