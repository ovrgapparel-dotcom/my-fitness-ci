'use client';

import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { TrainingSession } from '@/lib/types';

interface BookingModalProps {
  session: TrainingSession | null;
  userCredits: number;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    phone: string;
    accessMode: 'MEMBERSHIP' | 'SESSION_CREDIT' | 'PAYMENT';
    provider?: 'WAVE' | 'ORANGE_MONEY' | 'MTN_MOMO';
  }) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  session,
  userCredits,
  isOpen,
  onClose,
  onSubmit,
}) => {
  if (!isOpen || !session) return null;

  const isFull = session.bookedSeats >= session.capacity;
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [accessMode, setAccessMode] = useState<'MEMBERSHIP' | 'SESSION_CREDIT' | 'PAYMENT'>(
    userCredits > 0 ? 'SESSION_CREDIT' : 'MEMBERSHIP'
  );
  const [provider, setProvider] = useState<'WAVE' | 'ORANGE_MONEY' | 'MTN_MOMO'>('WAVE');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      phone,
      accessMode,
      provider: accessMode === 'PAYMENT' ? provider : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-neutral-900 w-full max-w-lg rounded-2xl shadow-2xl border border-neutral-800 overflow-hidden text-neutral-100">
        {/* Header */}
        <div className="bg-brand-red text-white p-5 flex items-center justify-between">
          <div>
            <span
              className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                isFull ? 'bg-amber-400 text-amber-950' : 'bg-brand-gold text-brand-dark'
              }`}
            >
              {isFull ? "Liste d'Attente" : 'Réservation'}
            </span>
            <h3 className="text-lg font-black mt-1">
              {session.activity} · {session.studio}
            </h3>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800 text-xs flex justify-between items-center">
            <div>
              <div className="font-extrabold text-neutral-200">
                {session.day} {session.date} septembre 2026 à {session.time}
              </div>
              <div className="text-neutral-400">
                Coach : {session.coach} · {session.studio}
              </div>
            </div>
            <div className="text-right">
              <div className="font-black text-brand-gold">
                {session.capacity - session.bookedSeats} / {session.capacity} places
              </div>
              <div className="text-neutral-400">{session.priceXOF.toLocaleString()} FCFA</div>
            </div>
          </div>

          {/* Waitlist Notice if Full */}
          {isFull && (
            <div className="p-3 bg-amber-950/60 border border-amber-800/80 rounded-xl text-amber-200 text-xs">
              <strong className="font-bold flex items-center gap-1.5 text-amber-300">
                <AlertCircle className="w-4 h-4" /> Séance Complète !
              </strong>
              <span className="mt-1 block">
                Vous serez inscrit en priorité sur la liste d'attente (FIFO). Dès qu'un participant annule (&gt;= 12h avant), une place vous sera proposée avec un délai de confirmation de <strong>1 heure</strong> avant offre au candidat suivant.
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                Votre Nom & Prénom
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex : Jean-Yves Kouassi"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-medium text-neutral-100 focus:ring-2 focus:ring-brand-red outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                Numéro Mobile (Wave / OM / MTN)
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex : +225 07 00 00 00 00"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-medium text-neutral-100 focus:ring-2 focus:ring-brand-red outline-none"
              />
            </div>

            {/* Access Mode */}
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                Mode d'accès
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <label className="border border-neutral-800 p-2.5 rounded-xl cursor-pointer flex items-center gap-2 hover:border-brand-red has-[:checked]:border-brand-red has-[:checked]:bg-brand-red/10">
                  <input
                    type="radio"
                    name="accessMode"
                    value="MEMBERSHIP"
                    checked={accessMode === 'MEMBERSHIP'}
                    onChange={() => setAccessMode('MEMBERSHIP')}
                    className="text-brand-red focus:ring-brand-red"
                  />
                  <span className="text-xs font-bold text-neutral-200">Pass Membre</span>
                </label>

                <label
                  className={`border border-neutral-800 p-2.5 rounded-xl cursor-pointer flex items-center gap-2 hover:border-brand-red has-[:checked]:border-brand-red has-[:checked]:bg-brand-red/10 ${
                    userCredits <= 0 ? 'opacity-40 cursor-not-allowed' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="accessMode"
                    value="SESSION_CREDIT"
                    disabled={userCredits <= 0}
                    checked={accessMode === 'SESSION_CREDIT'}
                    onChange={() => setAccessMode('SESSION_CREDIT')}
                    className="text-brand-red focus:ring-brand-red"
                  />
                  <span className="text-xs font-bold text-brand-gold">
                    Crédit ({userCredits})
                  </span>
                </label>

                <label className="border border-neutral-800 p-2.5 rounded-xl cursor-pointer flex items-center gap-2 hover:border-brand-red has-[:checked]:border-brand-red has-[:checked]:bg-brand-red/10">
                  <input
                    type="radio"
                    name="accessMode"
                    value="PAYMENT"
                    checked={accessMode === 'PAYMENT'}
                    onChange={() => setAccessMode('PAYMENT')}
                    className="text-brand-red focus:ring-brand-red"
                  />
                  <span className="text-xs font-bold text-neutral-200">Paiement Mobile</span>
                </label>
              </div>
            </div>

            {/* Mobile Money Provider */}
            {accessMode === 'PAYMENT' && (
              <div className="space-y-2 pt-1 border-t border-neutral-800">
                <span className="text-[11px] font-bold text-neutral-400">
                  Opérateur Mobile Money (XOF) :
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <label className="border border-neutral-800 bg-neutral-950 p-2 rounded-xl text-center cursor-pointer hover:border-brand-red has-[:checked]:border-brand-red has-[:checked]:bg-brand-red/10">
                    <input
                      type="radio"
                      name="provider"
                      value="WAVE"
                      checked={provider === 'WAVE'}
                      onChange={() => setProvider('WAVE')}
                      className="sr-only"
                    />
                    <div className="text-xs font-black text-sky-400">Wave</div>
                    <div className="text-[9px] text-neutral-500">Instantané</div>
                  </label>
                  <label className="border border-neutral-800 bg-neutral-950 p-2 rounded-xl text-center cursor-pointer hover:border-brand-red has-[:checked]:border-brand-red has-[:checked]:bg-brand-red/10">
                    <input
                      type="radio"
                      name="provider"
                      value="ORANGE_MONEY"
                      checked={provider === 'ORANGE_MONEY'}
                      onChange={() => setProvider('ORANGE_MONEY')}
                      className="sr-only"
                    />
                    <div className="text-xs font-black text-orange-400">Orange Money</div>
                    <div className="text-[9px] text-neutral-500">Web / USSD</div>
                  </label>
                  <label className="border border-neutral-800 bg-neutral-950 p-2 rounded-xl text-center cursor-pointer hover:border-brand-red has-[:checked]:border-brand-red has-[:checked]:bg-brand-red/10">
                    <input
                      type="radio"
                      name="provider"
                      value="MTN_MOMO"
                      checked={provider === 'MTN_MOMO'}
                      onChange={() => setProvider('MTN_MOMO')}
                      className="sr-only"
                    />
                    <div className="text-xs font-black text-yellow-400">MTN MoMo</div>
                    <div className="text-[9px] text-neutral-500">Push OTP</div>
                  </label>
                </div>
              </div>
            )}

            <button
              type="submit"
              className={`w-full mt-4 text-white font-black py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md ${
                isFull
                  ? 'bg-amber-500 hover:bg-amber-600 text-amber-950'
                  : 'bg-brand-red hover:bg-brand-dark'
              }`}
            >
              {isFull ? "Prendre position sur la file d'attente (délai 1h)" : 'Confirmer la réservation'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
