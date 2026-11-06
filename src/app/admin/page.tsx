'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Users,
  Clock,
  CreditCard,
  Settings,
  Shield,
  ArrowLeft,
  Search,
  CheckCircle,
  AlertCircle,
  Save,
  RefreshCw,
  Coins,
  DollarSign,
  TrendingUp,
  MapPin,
  Sparkles
} from 'lucide-react';

interface AdminSession {
  id: string;
  activity: string;
  studio: string;
  day: string;
  time: string;
  coach: string;
  capacity: number;
  bookedSeats: number;
  isCustomLimit: boolean;
  status: 'SCHEDULED' | 'CANCELLED';
}

interface WaitlistEntry {
  id: string;
  sessionTitle: string;
  userName: string;
  userPhone: string;
  queuePosition: number;
  status: 'WAITING' | 'OFFERED';
  offeredAt?: string;
  expiresInMinutes?: number;
}

interface PaymentTransaction {
  id: string;
  userName: string;
  userPhone: string;
  item: string;
  amountXOF: number;
  provider: 'WAVE' | 'ORANGE_MONEY' | 'MTN_MOMO';
  status: 'SUCCEEDED' | 'PENDING' | 'REFUNDED';
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'sessions' | 'waitlist' | 'payments' | 'settings'>('sessions');

  // Initial mock admin data based on My Fitness schedule
  const [sessions, setSessions] = useState<AdminSession[]>([
    { id: '1', activity: 'Suspension T', studio: 'Studio Fonctionnel', day: 'Lundi', time: '06h30', coach: 'Kramo', capacity: 15, bookedSeats: 11, isCustomLimit: false, status: 'SCHEDULED' },
    { id: '2', activity: 'Pilates', studio: 'Cours Collectifs', day: 'Lundi', time: '09h30', coach: 'Kramo', capacity: 25, bookedSeats: 25, isCustomLimit: false, status: 'SCHEDULED' },
    { id: '3', activity: 'Cross T.', studio: 'Studio Fonctionnel', day: 'Lundi', time: '12h30', coach: 'Soleil', capacity: 15, bookedSeats: 14, isCustomLimit: false, status: 'SCHEDULED' },
    { id: '4', activity: 'Fight T.', studio: 'Studio Fonctionnel', day: 'Lundi', time: '19h00', coach: 'Kramo', capacity: 12, bookedSeats: 12, isCustomLimit: true, status: 'SCHEDULED' }, // Custom limit
    { id: '5', activity: 'Yoga - Pilates', studio: 'Cours Collectifs', day: 'Mardi', time: '06h30', coach: 'Didier', capacity: 25, bookedSeats: 16, isCustomLimit: false, status: 'SCHEDULED' },
    { id: '6', activity: 'Biking', studio: 'Studio Biking', day: 'Mardi', time: '12h30', coach: 'Virtuel', capacity: 20, bookedSeats: 19, isCustomLimit: false, status: 'SCHEDULED' },
    { id: '7', activity: 'Cross T.', studio: 'Studio Fonctionnel', day: 'Mardi', time: '18h00', coach: 'Kramo', capacity: 15, bookedSeats: 15, isCustomLimit: false, status: 'SCHEDULED' },
    { id: '8', activity: 'Danse Classique', studio: 'Cours Collectifs', day: 'Mercredi', time: '09h30', coach: 'Privé', capacity: 20, bookedSeats: 14, isCustomLimit: false, status: 'SCHEDULED' },
  ]);

  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([
    { id: 'wl-1', sessionTitle: 'Pilates (Lundi 09h30)', userName: 'Awa Traoré', userPhone: '+225 07 12 34 56 78', queuePosition: 1, status: 'OFFERED', expiresInMinutes: 42 },
    { id: 'wl-2', sessionTitle: 'Pilates (Lundi 09h30)', userName: 'Koffi Michel', userPhone: '+225 05 98 76 54 32', queuePosition: 2, status: 'WAITING' },
    { id: 'wl-3', sessionTitle: 'Cross T. (Mardi 18h00)', userName: 'Yasmine Bamba', userPhone: '+225 07 44 55 66 77', queuePosition: 1, status: 'WAITING' },
    { id: 'wl-4', sessionTitle: 'Fight T. (Lundi 19h00)', userName: 'Marc Diop', userPhone: '+225 01 22 33 44 55', queuePosition: 1, status: 'WAITING' },
  ]);

  const [transactions, setTransactions] = useState<PaymentTransaction[]>([
    { id: 'tx-801', userName: 'Jean-Yves Kouassi', userPhone: '+225 07 04 87 76 57', item: 'Séance Cross T.', amountXOF: 12000, provider: 'WAVE', status: 'SUCCEEDED', createdAt: 'Aujourd’hui 14:22' },
    { id: 'tx-802', userName: 'Fatou Diabate', userPhone: '+225 05 11 22 33 44', item: 'Pass Mensuel Essentiel', amountXOF: 45000, provider: 'ORANGE_MONEY', status: 'SUCCEEDED', createdAt: 'Aujourd’hui 12:05' },
    { id: 'tx-803', userName: 'Eric Yao', userPhone: '+225 01 99 88 77 66', item: 'Séance Biking', amountXOF: 10000, provider: 'MTN_MOMO', status: 'SUCCEEDED', createdAt: 'Aujourd’hui 10:18' },
    { id: 'tx-804', userName: 'Sarah Toure', userPhone: '+225 07 55 66 77 88', item: 'Pass Annuel VIP', amountXOF: 550000, provider: 'WAVE', status: 'SUCCEEDED', createdAt: 'Hier 17:40' },
  ]);

  const [settings, setSettings] = useState({
    cancellationCutoffHours: 12,
    waitlistOfferTimeoutMinutes: 60,
    sessionCreditRefundEnabled: true,
    maxActiveBookings: 3,
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUpdateCapacity = (sessionId: string, newCapacity: number) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId ? { ...s, capacity: newCapacity, isCustomLimit: true } : s
      )
    );
    showToast(`Capacité modifiée à ${newCapacity} places.`);
  };

  const handleToggleSessionStatus = (sessionId: string) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? { ...s, status: s.status === 'SCHEDULED' ? 'CANCELLED' : 'SCHEDULED' }
          : s
      )
    );
    showToast('Statut de la séance actualisé.');
  };

  const handleTriggerWaitlistOffer = (id: string) => {
    setWaitlist((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, status: 'OFFERED', expiresInMinutes: 60 } : w
      )
    );
    showToast("Offre de place envoyée au membre (délai d'acceptation : 1 heure).");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-neutral-100">
      
      {/* Top Admin Bar */}
      <header className="border-b border-neutral-800 bg-neutral-950/90 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-white transition-colors bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-xl"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Retour au site
            </Link>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-brand-gold" />
              <span className="font-black text-sm tracking-tight text-white uppercase">
                MY FITNESS · Administration
              </span>
              <span className="text-[10px] bg-brand-red/30 text-red-300 border border-brand-red/50 px-2 py-0.5 rounded-full font-bold ml-1">
                ITC Cocody
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-neutral-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Système synchronisé</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* KPI Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-bold">
              <span>Réservations Confirmées</span>
              <Calendar className="w-4 h-4 text-brand-red" />
            </div>
            <div className="mt-3 text-2xl font-black text-white">137</div>
            <div className="mt-1 text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +12% vs semaine dernière
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-bold">
              <span>Taux d'Occupation Studios</span>
              <Users className="w-4 h-4 text-brand-gold" />
            </div>
            <div className="mt-3 text-2xl font-black text-brand-gold">88.4%</div>
            <div className="mt-1 text-[11px] text-neutral-400 font-medium">
              Studios Fonctionnel & Collectifs à pleine capacité
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-bold">
              <span>Membres en File d'Attente</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-3 text-2xl font-black text-amber-400">18</div>
            <div className="mt-1 text-[11px] text-neutral-400 font-medium">
              Délai d'offre configuré : 1 heure
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-bold">
              <span>Volume Mobile Money</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-3 text-2xl font-black text-emerald-400">617 000 <span className="text-xs font-bold text-neutral-400">FCFA</span></div>
            <div className="mt-1 text-[11px] text-neutral-400 font-medium">
              Wave · Orange Money · MTN MoMo
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-neutral-800 pb-3 mb-6 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('sessions')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'sessions'
                ? 'bg-brand-red text-white shadow-md'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Planning & Capacités ({sessions.length})
          </button>

          <button
            onClick={() => setActiveTab('waitlist')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'waitlist'
                ? 'bg-brand-red text-white shadow-md'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            File d'Attente FIFO ({waitlist.length})
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'payments'
                ? 'bg-brand-red text-white shadow-md'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Transactions Mobiles ({transactions.length})
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'bg-brand-red text-white shadow-md'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            Règles & Paramètres
          </button>
        </div>

        {/* Tab 1: Sessions & Custom Capacities */}
        {activeTab === 'sessions' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-base font-black text-white uppercase tracking-wide">
                Gestion des Créneaux et Capacités Personnalisées
              </h3>
              <span className="text-xs text-neutral-400">
                Vous pouvez surcharger la capacité par défaut d'un cours spécifique.
              </span>
            </div>

            <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-950 text-neutral-400 font-bold uppercase tracking-wider border-b border-neutral-800">
                  <tr>
                    <th className="p-4">Cours / Studio</th>
                    <th className="p-4">Jour & Heure</th>
                    <th className="p-4">Coach</th>
                    <th className="p-4">Capacité / Réservés</th>
                    <th className="p-4">Régler Capacité Custom</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {sessions.map((s) => (
                    <tr key={s.id} className="hover:bg-neutral-850/40 transition-colors">
                      <td className="p-4">
                        <div className="font-extrabold text-white">{s.activity}</div>
                        <div className="text-[11px] text-neutral-400">{s.studio}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-brand-gold">{s.day}</div>
                        <div className="text-neutral-400">{s.time}</div>
                      </td>
                      <td className="p-4 font-bold text-neutral-200">{s.coach}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-white">
                            {s.bookedSeats} / {s.capacity}
                          </span>
                          {s.isCustomLimit && (
                            <span className="text-[9px] bg-brand-red/30 text-red-300 px-1.5 py-0.5 rounded border border-brand-red/40 font-bold">
                              Custom
                            </span>
                          )}
                        </div>
                        <div className="w-24 h-1.5 bg-neutral-800 rounded-full mt-1.5 overflow-hidden">
                          <div
                            className={`h-full ${
                              s.bookedSeats >= s.capacity ? 'bg-amber-400' : 'bg-emerald-400'
                            }`}
                            style={{ width: `${Math.min(100, (s.bookedSeats / s.capacity) * 100)}%` }}
                          />
                        </div>
                      </td>
                      <td className="p-4">
                        <select
                          value={s.capacity}
                          onChange={(e) => handleUpdateCapacity(s.id, parseInt(e.target.value, 10))}
                          className="bg-neutral-950 border border-neutral-750 text-neutral-200 rounded-lg px-2.5 py-1 text-xs focus:ring-1 focus:ring-brand-red outline-none"
                        >
                          <option value={10}>10 places (Intense)</option>
                          <option value={12}>12 places (Custom)</option>
                          <option value={15}>15 places (Standard)</option>
                          <option value={20}>20 places (Biking/Danse)</option>
                          <option value={25}>25 places (Collectif)</option>
                          <option value={30}>30 places (Masterclass)</option>
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleToggleSessionStatus(s.id)}
                          className={`px-3 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                            s.status === 'SCHEDULED'
                              ? 'border-red-900/50 text-red-400 hover:bg-red-950/40'
                              : 'border-emerald-900/50 text-emerald-400 hover:bg-emerald-950/40'
                          }`}
                        >
                          {s.status === 'SCHEDULED' ? 'Annuler Séance' : 'Restaurer'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Waitlist & Reallocations */}
        {activeTab === 'waitlist' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-base font-black text-white uppercase tracking-wide">
                File d'Attente FIFO & Offres de Réattribution (Délai 1h)
              </h3>
              <span className="text-xs text-neutral-400">
                Attribution automatique par rang dès annulation (&gt;= 12h avant).
              </span>
            </div>

            <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-950 text-neutral-400 font-bold uppercase tracking-wider border-b border-neutral-800">
                  <tr>
                    <th className="p-4">Rang FIFO</th>
                    <th className="p-4">Membre</th>
                    <th className="p-4">Téléphone Mobile</th>
                    <th className="p-4">Séance Demandée</th>
                    <th className="p-4">Statut de la Place</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {waitlist.map((w) => (
                    <tr key={w.id} className="hover:bg-neutral-850/40 transition-colors">
                      <td className="p-4">
                        <span className="w-6 h-6 rounded-full bg-neutral-800 border border-neutral-700 font-black text-brand-gold flex items-center justify-center text-[11px]">
                          #{w.queuePosition}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-white">{w.userName}</td>
                      <td className="p-4 text-neutral-300 font-mono">{w.userPhone}</td>
                      <td className="p-4 font-bold text-brand-gold">{w.sessionTitle}</td>
                      <td className="p-4">
                        {w.status === 'OFFERED' ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/60 text-amber-300 border border-amber-800/80 text-[10px] font-bold">
                            <Clock className="w-3 h-3 animate-spin" />
                            Offre active (expire dans {w.expiresInMinutes} min)
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700 text-[10px] font-bold">
                            En attente d'une place
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        {w.status === 'WAITING' ? (
                          <button
                            onClick={() => handleTriggerWaitlistOffer(w.id)}
                            className="px-3 py-1 rounded-lg bg-brand-red hover:bg-brand-dark text-white font-bold text-[11px] shadow-sm transition-all"
                          >
                            Proposer place (1h)
                          </button>
                        ) : (
                          <span className="text-[11px] text-neutral-500 font-semibold">
                            Notification SMS envoyée
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Mobile Money Transactions */}
        {activeTab === 'payments' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-base font-black text-white uppercase tracking-wide">
                Transactions & Encaissements Mobile Money (XOF)
              </h3>
              <span className="text-xs text-neutral-400">
                Paiements vérifiés côté serveur par webhook (Wave, Orange Money, MTN MoMo).
              </span>
            </div>

            <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-950 text-neutral-400 font-bold uppercase tracking-wider border-b border-neutral-800">
                  <tr>
                    <th className="p-4">Réf Transaction</th>
                    <th className="p-4">Client</th>
                    <th className="p-4">Prestation</th>
                    <th className="p-4">Opérateur Mobile</th>
                    <th className="p-4">Montant XOF</th>
                    <th className="p-4">Statut</th>
                    <th className="p-4 text-right">Horodatage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-neutral-850/40 transition-colors">
                      <td className="p-4 font-mono font-bold text-neutral-300">{tx.id}</td>
                      <td className="p-4">
                        <div className="font-bold text-white">{tx.userName}</div>
                        <div className="text-[11px] text-neutral-400 font-mono">{tx.userPhone}</div>
                      </td>
                      <td className="p-4 text-neutral-200">{tx.item}</td>
                      <td className="p-4">
                        <span
                          className={`font-black text-[11px] px-2 py-0.5 rounded-md ${
                            tx.provider === 'WAVE'
                              ? 'bg-sky-950 text-sky-400 border border-sky-800'
                              : tx.provider === 'ORANGE_MONEY'
                              ? 'bg-orange-950 text-orange-400 border border-orange-800'
                              : 'bg-yellow-950 text-yellow-400 border border-yellow-800'
                          }`}
                        >
                          {tx.provider}
                        </span>
                      </td>
                      <td className="p-4 font-black text-white">
                        {tx.amountXOF.toLocaleString()} FCFA
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                          <CheckCircle className="w-3 h-3" />
                          Confirmé
                        </span>
                      </td>
                      <td className="p-4 text-right text-neutral-400 font-mono text-[11px]">
                        {tx.createdAt}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Gym Business Rules & Configuration */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-3xl">
            <h3 className="text-base font-black text-white uppercase tracking-wide">
              Configuration des Politiques Commerciales & Algorithmes
            </h3>

            <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-6 space-y-6 shadow-xl">
              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Délai Limite d'Annulation Sans Pénalité (Heures)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={settings.cancellationCutoffHours}
                    onChange={(e) =>
                      setSettings({ ...settings, cancellationCutoffHours: parseInt(e.target.value, 10) })
                    }
                    className="w-32 bg-neutral-950 border border-neutral-750 text-neutral-100 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:ring-1 focus:ring-brand-red"
                  />
                  <span className="text-xs text-neutral-400">
                    Fixé à <strong>12 heures</strong>. Toute annulation à &lt; 12h est marquée comme annulation tardive.
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Délai d'Acceptation de Place en Liste d'Attente (Minutes)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={settings.waitlistOfferTimeoutMinutes}
                    onChange={(e) =>
                      setSettings({ ...settings, waitlistOfferTimeoutMinutes: parseInt(e.target.value, 10) })
                    }
                    className="w-32 bg-neutral-950 border border-neutral-750 text-neutral-100 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:ring-1 focus:ring-brand-red"
                  />
                  <span className="text-xs text-neutral-400">
                    Fixé à <strong>60 minutes (1 heure)</strong>. À expiration, l'offre passe automatiquement au suivant.
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Mode de Remboursement d'Annulation Valide (&gt;= 12h)
                </label>
                <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl text-xs flex items-center justify-between">
                  <div>
                    <div className="font-extrabold text-white">Restitution en Crédit de Séance</div>
                    <div className="text-neutral-400">1 crédit crédité sur le solde du membre (validité 90 jours).</div>
                  </div>
                  <span className="text-emerald-400 font-bold text-xs bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-md">
                    Actif
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-800 flex justify-end">
                <button
                  onClick={() => showToast('Paramètres du club enregistrés avec succès.')}
                  className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-dark text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all"
                >
                  <Save className="w-4 h-4" />
                  Enregistrer les modifications
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Admin Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 border border-neutral-700 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
