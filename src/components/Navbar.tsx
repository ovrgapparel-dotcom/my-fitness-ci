'use client';

import React from 'react';
import { MapPin, Phone, Zap, BookmarkCheck, ArrowRight, Coins, Shield } from 'lucide-react';
import Link from 'next/link';

interface NavbarProps {
  userCredits: number;
  bookingsCount: number;
  onOpenMyBookings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  userCredits,
  bookingsCount,
  onOpenMyBookings,
}) => {
  return (
    <>
      {/* Top Banner */}
      <aside className="bg-black/90 text-white text-xs py-2 px-4 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-medium text-neutral-300">
              <MapPin className="w-3.5 h-3.5 text-brand-gold" />
              Ivoire Trade Center (ITC), Cocody, Abidjan
            </span>
            <span className="hidden sm:inline text-neutral-600">•</span>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-neutral-300">
              <Phone className="w-3.5 h-3.5 text-brand-gold" />
              +225 07 04 87 76 57
            </span>
          </div>
          <div className="flex items-center gap-3 text-white/90">
            <span className="inline-flex items-center gap-1 text-[11px] bg-brand-red/30 text-red-200 px-2 py-0.5 rounded-full border border-brand-red/50">
              <Zap className="w-3 h-3 text-brand-gold" />
              Wave • Orange Money • MTN MoMo
            </span>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 text-[11px] bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-2.5 py-0.5 rounded-full border border-neutral-700 transition-colors"
            >
              <Shield className="w-3 h-3 text-brand-gold" />
              Espace Admin
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-[#0a0a0c]/90 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 p-1 shadow-sm flex items-center justify-center">
              <img
                src="/assets/logo.jpg"
                alt="MY FITNESS Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/48?text=MF';
                }}
              />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-white group-hover:text-brand-red transition-colors">
                MY FITNESS
              </span>
              <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest -mt-1">
                Club Sport & Santé
              </p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-neutral-300">
            <a href="#hero-tour" className="hover:text-brand-red transition-colors">
              Visite 3D
            </a>
            <a href="#studios" className="hover:text-brand-red transition-colors">
              Nos Studios
            </a>
            <a href="#planning" className="hover:text-brand-red transition-colors">
              Planning des Cours
            </a>
            <a href="#tarifs" className="hover:text-brand-red transition-colors">
              Abonnements & Séances
            </a>
            <a href="#contact" className="hover:text-brand-red transition-colors">
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {/* Session Credits Balance */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-bold text-neutral-200">
              <Coins className="w-4 h-4 text-brand-gold" />
              <span>
                Crédits : <span className="text-brand-gold font-black">{userCredits}</span>
              </span>
            </div>

            <button
              onClick={onOpenMyBookings}
              className="relative p-2.5 rounded-xl border border-neutral-800 bg-neutral-900 text-white hover:border-brand-red transition-all"
              title="Mes Réservations"
            >
              <BookmarkCheck className="w-5 h-5 text-brand-red" />
              <span className="absolute -top-1.5 -right-1.5 bg-brand-red text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-neutral-900">
                {bookingsCount}
              </span>
            </button>

            <a
              href="#planning"
              className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-dark text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all"
            >
              <span>Réserver</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>
    </>
  );
};
