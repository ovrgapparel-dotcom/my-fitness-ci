'use client';

import React from 'react';
import { X, UserCheck, Calendar } from 'lucide-react';

export interface UserBookingItem {
  id: string;
  sessionId: string;
  activity: string;
  studio: string;
  day: string;
  time: string;
  coach: string;
  status: 'CONFIRMED' | 'CANCELLED';
  type: string;
}

interface MyBookingsModalProps {
  isOpen: boolean;
  bookings: UserBookingItem[];
  onClose: () => void;
  onCancelBooking: (bookingId: string) => void;
}

export const MyBookingsModal: React.FC<MyBookingsModalProps> = ({
  isOpen,
  bookings,
  onClose,
  onCancelBooking,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-neutral-900 w-full max-w-lg rounded-2xl shadow-2xl border border-neutral-800 overflow-hidden text-neutral-100">
        <div className="bg-neutral-950 text-white p-5 flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-brand-gold" />
            <h3 className="text-base font-black">Mes Réservations & Annulations</h3>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-neutral-950 border border-neutral-800 p-3 rounded-xl text-xs text-neutral-300">
            <span className="font-bold text-brand-gold">Règle d'annulation 12 heures :</span>{' '}
            Annulez au moins 12 heures avant la séance pour libérer votre place. Pour toute séance individuelle ou crédit, 1 crédit de séance est automatiquement restitué sur votre solde.
          </div>

          <div className="space-y-3">
            {bookings.length === 0 ? (
              <div className="text-center py-8 text-neutral-500 text-xs">
                <Calendar className="w-8 h-8 mx-auto mb-2 opacity-40" />
                Aucune réservation active.
              </div>
            ) : (
              bookings.map((b) => (
                <div
                  key={b.id}
                  className="p-3.5 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-extrabold text-white">{b.activity}</div>
                    <div className="text-neutral-400">
                      {b.day} à {b.time} · Coach {b.coach}
                    </div>
                    <div className="text-[10px] text-emerald-400 font-bold mt-0.5">
                      ● Confirmé ({b.type})
                    </div>
                  </div>
                  <button
                    onClick={() => onCancelBooking(b.id)}
                    className="px-3 py-1.5 rounded-lg border border-red-900/60 text-red-400 hover:bg-red-950/40 font-bold text-[11px] transition-all"
                  >
                    Annuler (Règle 12h)
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
