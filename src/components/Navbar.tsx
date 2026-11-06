'use client';

import React, { useState, useRef } from 'react';
import { MapPin, Phone, Zap, BookmarkCheck, ArrowRight, Coins, Lock, KeyRound, X, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [pinError, setPinError] = useState(false);

  // Mobile double-tap detection
  const lastTapRef = useRef<number>(0);

  const triggerAdminAccess = () => {
    setIsAdminModalOpen(true);
    setPinCode('');
    setPinError(false);
  };

  const handleDoubleClick = () => {
    triggerAdminAccess();
  };

  const handleTouchEnd = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 350;
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      triggerAdminAccess();
    }
    lastTapRef.current = now;
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default admin access PIN (2026 or 1234 or direct enter)
    if (pinCode.trim() === '2026' || pinCode.trim() === '1234' || pinCode.trim() === '') {
      setIsAdminModalOpen(false);
      router.push('/admin');
    } else {
      setPinError(true);
    }
  };

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

            {/* Discreet Admin Lock Icon with Double-Click Feature */}
            <button
              onDoubleClick={handleDoubleClick}
              onTouchEnd={handleTouchEnd}
              className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-brand-gold hover:border-brand-gold/60 transition-all cursor-pointer group relative"
              title="Accès Administrateur (Double-clic)"
              aria-label="Accès Administration sécurisé"
            >
              <Lock className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-[#0a0a0c]/90 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-900/80 border border-neutral-800/80 p-1 shadow-md flex items-center justify-center group-hover:border-brand-red/50 transition-colors">
              <img
                src="/assets/logo.png"
                alt="MY FITNESS Logo"
                className="w-full h-full object-contain filter drop-shadow-[0_2px_10px_rgba(217,28,43,0.4)] group-hover:scale-105 transition-transform"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/assets/logo.jpg';
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

      {/* Admin Passcode Modal triggered on Double-Click */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 w-full max-w-sm rounded-2xl shadow-2xl border border-neutral-800 overflow-hidden text-neutral-100 animate-fade-in">
            <div className="bg-neutral-950 p-4 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-brand-gold" />
                <span className="font-black text-xs uppercase tracking-wider text-white">
                  Accès Administration Sécurisé
                </span>
              </div>
              <button
                onClick={() => setIsAdminModalOpen(false)}
                className="text-neutral-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePinSubmit} className="p-5 space-y-4">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-brand-red/20 border border-brand-red/40 text-brand-red mx-auto flex items-center justify-center">
                  <KeyRound className="w-6 h-6 text-brand-gold" />
                </div>
                <h4 className="text-sm font-black text-white mt-2">Espace Gestionnaire · MY FITNESS</h4>
                <p className="text-[11px] text-neutral-400">
                  Entrez votre code PIN staff ou cliquez sur valider pour accéder au tableau de bord.
                </p>
              </div>

              <div>
                <input
                  type="password"
                  autoFocus
                  value={pinCode}
                  onChange={(e) => {
                    setPinCode(e.target.value);
                    setPinError(false);
                  }}
                  placeholder="Code PIN (par défaut : 2026)"
                  className="w-full bg-neutral-950 border border-neutral-750 rounded-xl px-3 py-2.5 text-center text-sm font-mono tracking-widest text-white focus:outline-none focus:ring-2 focus:ring-brand-red"
                />
                {pinError && (
                  <p className="text-[11px] text-red-400 mt-1.5 text-center font-medium flex items-center justify-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Code PIN incorrect. Réessayez avec 2026.
                  </p>
                )}
              </div>

              <div className="space-y-2 pt-1">
                <button
                  type="submit"
                  className="w-full bg-brand-red hover:bg-brand-dark text-white font-black text-xs uppercase tracking-wider py-3 rounded-xl shadow-md transition-all"
                >
                  Déverrouiller l'Administration
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAdminModalOpen(false);
                    router.push('/admin');
                  }}
                  className="w-full text-center text-[11px] font-bold text-neutral-400 hover:text-brand-gold py-1"
                >
                  Passer directement au Dashboard →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
