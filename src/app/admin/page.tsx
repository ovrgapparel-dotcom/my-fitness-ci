'use client';

import React, { useState, useMemo } from 'react';
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
  PlusCircle,
  Trash2,
  Edit3,
  X,
  Filter,
  TrendingUp,
  DollarSign,
  Sparkles,
  Calendar as CalendarIcon
} from 'lucide-react';
import { generateFullYear2026Sessions, MONTH_NAMES } from '@/lib/schedule-generator';
import { TrainingSession } from '@/lib/types';

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

  // Full Year 2026 Sessions in Admin State
  const [sessions, setSessions] = useState<TrainingSession[]>(() => generateFullYear2026Sessions());

  // Filters for Admin Calendar
  const [adminMonthFilter, setAdminMonthFilter] = useState<string>('all');
  const [adminStudioFilter, setAdminStudioFilter] = useState<string>('all');
  const [adminSearch, setAdminSearch] = useState<string>('');

  // Add / Edit Session Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<TrainingSession | null>(null);

  // Form states for new session
  const [formActivity, setFormActivity] = useState('Suspension T');
  const [formStudio, setFormStudio] = useState('Studio Fonctionnel');
  const [formCoach, setFormCoach] = useState('Kramo');
  const [formDate, setFormDate] = useState('2026-10-15');
  const [formTime, setFormTime] = useState('18h00');
  const [formCapacity, setFormCapacity] = useState(15);
  const [formPrice, setFormPrice] = useState(10000);

  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([
    { id: 'wl-1', sessionTitle: 'Pilates (Septembre)', userName: 'Awa Traoré', userPhone: '+225 07 12 34 56 78', queuePosition: 1, status: 'OFFERED', expiresInMinutes: 48 },
    { id: 'wl-2', sessionTitle: 'Pilates (Septembre)', userName: 'Koffi Michel', userPhone: '+225 05 98 76 54 32', queuePosition: 2, status: 'WAITING' },
    { id: 'wl-3', sessionTitle: 'Cross T. (Octobre)', userName: 'Yasmine Bamba', userPhone: '+225 07 44 55 66 77', queuePosition: 1, status: 'WAITING' },
    { id: 'wl-4', sessionTitle: 'Fight T. (Novembre)', userName: 'Marc Diop', userPhone: '+225 01 22 33 44 55', queuePosition: 1, status: 'WAITING' },
    { id: 'wl-5', sessionTitle: 'Biking (Décembre)', userName: 'Fatou Cisse', userPhone: '+225 07 88 99 00 11', queuePosition: 1, status: 'WAITING' },
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

  // Filtered Sessions in Admin View
  const filteredAdminSessions = useMemo(() => {
    const q = adminSearch.trim().toLowerCase();
    return sessions.filter((s) => {
      const matchMonth = adminMonthFilter === 'all' || s.month === adminMonthFilter;
      const matchStudio = adminStudioFilter === 'all' || s.studio === adminStudioFilter;
      const matchQuery =
        !q ||
        [s.activity, s.studio, s.coach, s.day].some((v) =>
          v.toLowerCase().includes(q)
        );
      return matchMonth && matchStudio && matchQuery;
    });
  }, [sessions, adminMonthFilter, adminStudioFilter, adminSearch]);

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
        s.id === sessionId ? { ...s, isCancelled: !s.isCancelled } : s
      )
    );
    showToast('Statut de la séance actualisé.');
  };

  const handleDeleteSession = (sessionId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette séance ?')) {
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      showToast('Séance supprimée du planning.');
    }
  };

  const handleTriggerWaitlistOffer = (id: string) => {
    setWaitlist((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, status: 'OFFERED', expiresInMinutes: 60 } : w
      )
    );
    showToast("Offre de place envoyée au membre (délai d'acceptation : 1 heure).");
  };

  const handleCreateOrUpdateSession = (e: React.FormEvent) => {
    e.preventDefault();
    const d = new Date(formDate);
    const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const dayName = dayNames[d.getDay()];
    const monthName = d.toLocaleDateString('fr-FR', { month: 'long' });
    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

    if (editingSession) {
      // Update existing
      setSessions((prev) =>
        prev.map((s) =>
          s.id === editingSession.id
            ? {
                ...s,
                activity: formActivity,
                studio: formStudio,
                coach: formCoach,
                time: formTime,
                capacity: formCapacity,
                priceXOF: formPrice,
                isCustomLimit: true,
              }
            : s
        )
      );
      showToast('Séance modifiée avec succès.');
    } else {
      // Create new session
      const newSession: TrainingSession = {
        id: `sess-custom-${Date.now()}`,
        day: dayName,
        date: d.getDate(),
        month: capitalizedMonth,
        monthIndex: d.getMonth(),
        year: d.getFullYear(),
        time: formTime,
        activity: formActivity,
        studio: formStudio,
        coach: formCoach,
        color: '#8b1e26',
        capacity: formCapacity,
        bookedSeats: 0,
        priceXOF: formPrice,
        week: 0,
        fullDateString: `${dayName} ${d.getDate()} ${monthName} ${d.getFullYear()}`,
        isCancelled: false,
        isCustomLimit: true,
      };
      setSessions((prev) => [newSession, ...prev]);
      showToast('Nouvelle séance ajoutée au planning 2026.');
    }

    setIsAddModalOpen(false);
    setEditingSession(null);
  };

  const openEditModal = (s: TrainingSession) => {
    setEditingSession(s);
    setFormActivity(s.activity);
    setFormStudio(s.studio);
    setFormCoach(s.coach);
    setFormTime(s.time);
    setFormCapacity(s.capacity);
    setFormPrice(s.priceXOF);
    setIsAddModalOpen(true);
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
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 p-1 flex items-center justify-center">
                <img
                  src="/assets/logo.png"
                  alt="MY FITNESS Emblem"
                  className="w-full h-full object-contain filter drop-shadow-[0_1px_6px_rgba(217,28,43,0.4)]"
                />
              </div>
              <Shield className="w-4 h-4 text-brand-gold" />
              <span className="font-black text-sm tracking-tight text-white uppercase">
                MY FITNESS · Administration
              </span>
              <span className="text-[10px] bg-brand-red/30 text-red-300 border border-brand-red/50 px-2 py-0.5 rounded-full font-bold ml-1">
                ITC Cocody
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-neutral-400 font-medium">
              Base active : <strong className="text-white">{sessions.length} cours (Sept-Déc 2026)</strong>
            </span>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* KPI Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-bold">
              <span>Séances Générées (Fin 2026)</span>
              <Calendar className="w-4 h-4 text-brand-red" />
            </div>
            <div className="mt-3 text-2xl font-black text-white">{sessions.length}</div>
            <div className="mt-1 text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Septembre à Décembre 2026
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-bold">
              <span>Taux d'Occupation Estimé</span>
              <Users className="w-4 h-4 text-brand-gold" />
            </div>
            <div className="mt-3 text-2xl font-black text-brand-gold">86.2%</div>
            <div className="mt-1 text-[11px] text-neutral-400 font-medium">
              3 Studios actifs : Fonctionnel, Collectif, Biking
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-bold">
              <span>File d'Attente Active</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-3 text-2xl font-black text-amber-400">{waitlist.length}</div>
            <div className="mt-1 text-[11px] text-neutral-400 font-medium">
              Délai d'acceptation : 1 heure (60 min)
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
            Planning & Séances 2026 ({sessions.length})
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

        {/* Tab 1: Sessions & Calendar Maintenance */}
        {activeTab === 'sessions' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-base font-black text-white uppercase tracking-wide">
                  Maintenance du Planning (Septembre à Décembre 2026)
                </h3>
                <p className="text-xs text-neutral-400">
                  Gérez, ajoutez, modifiez ou annulez les créneaux jusqu'au 31 décembre 2026.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingSession(null);
                  setIsAddModalOpen(true);
                }}
                className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-dark text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                Ajouter un cours
              </button>
            </div>

            {/* Admin Filters Row */}
            <div className="bg-neutral-900 p-4 rounded-2xl border border-neutral-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-neutral-400 font-bold mb-1">Filtrer par Mois</label>
                <select
                  value={adminMonthFilter}
                  onChange={(e) => setAdminMonthFilter(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-750 text-white rounded-xl px-3 py-2 font-semibold outline-none focus:ring-1 focus:ring-brand-red"
                >
                  <option value="all">Tous les mois (Sept - Déc 2026)</option>
                  {MONTH_NAMES.map((m) => (
                    <option key={m} value={m}>
                      {m} 2026
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 font-bold mb-1">Filtrer par Studio</label>
                <select
                  value={adminStudioFilter}
                  onChange={(e) => setAdminStudioFilter(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-750 text-white rounded-xl px-3 py-2 font-semibold outline-none focus:ring-1 focus:ring-brand-red"
                >
                  <option value="all">Tous les studios</option>
                  <option value="Studio Fonctionnel">Studio Fonctionnel</option>
                  <option value="Cours Collectifs">Cours Collectifs</option>
                  <option value="Studio Biking">Studio Biking</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 font-bold mb-1">Recherche Rapide</label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-3" />
                  <input
                    type="search"
                    value={adminSearch}
                    onChange={(e) => setAdminSearch(e.target.value)}
                    placeholder="Activité, Coach, Jour..."
                    className="w-full bg-neutral-950 border border-neutral-750 text-white rounded-xl pl-9 pr-3 py-2 outline-none focus:ring-1 focus:ring-brand-red"
                  />
                </div>
              </div>
            </div>

            {/* Sessions Table */}
            <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden shadow-xl">
              <div className="p-3 bg-neutral-950 text-xs text-neutral-400 border-b border-neutral-800 flex justify-between items-center">
                <span>
                  Affichage de <strong className="text-white">{filteredAdminSessions.length}</strong> séances
                </span>
                <span className="text-[11px] text-brand-gold">
                  Capacités ajustables en temps réel
                </span>
              </div>

              <div className="max-h-[600px] overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-950/80 text-neutral-400 font-bold uppercase tracking-wider sticky top-0 z-10 border-b border-neutral-800">
                    <tr>
                      <th className="p-3.5">Date & Créneau</th>
                      <th className="p-3.5">Activité / Studio</th>
                      <th className="p-3.5">Coach</th>
                      <th className="p-3.5">Capacité / Réservés</th>
                      <th className="p-3.5">Ajuster Capacité</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {filteredAdminSessions.slice(0, 80).map((s) => (
                      <tr
                        key={s.id}
                        className={`hover:bg-neutral-850/40 transition-colors ${
                          s.isCancelled ? 'opacity-50 bg-red-950/10' : ''
                        }`}
                      >
                        <td className="p-3.5">
                          <div className="font-bold text-white">
                            {s.day} {s.date} {s.month} 2026
                          </div>
                          <div className="text-[11px] text-brand-gold font-mono">{s.time}</div>
                        </td>
                        <td className="p-3.5">
                          <div className="font-extrabold text-white flex items-center gap-1.5">
                            {s.activity}
                            {s.isCancelled && (
                              <span className="text-[9px] bg-red-900 text-white px-1.5 py-0.2 rounded font-bold">
                                Annulé
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-neutral-400">{s.studio}</div>
                        </td>
                        <td className="p-3.5 font-bold text-neutral-200">{s.coach}</td>
                        <td className="p-3.5">
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
                          <div className="w-24 h-1.5 bg-neutral-800 rounded-full mt-1 overflow-hidden">
                            <div
                              className={`h-full ${
                                s.bookedSeats >= s.capacity ? 'bg-amber-400' : 'bg-emerald-400'
                              }`}
                              style={{ width: `${Math.min(100, (s.bookedSeats / s.capacity) * 100)}%` }}
                            />
                          </div>
                        </td>
                        <td className="p-3.5">
                          <select
                            value={s.capacity}
                            onChange={(e) => handleUpdateCapacity(s.id, parseInt(e.target.value, 10))}
                            className="bg-neutral-950 border border-neutral-750 text-neutral-200 rounded-lg px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-brand-red"
                          >
                            <option value={10}>10 places (Intense)</option>
                            <option value={12}>12 places (Custom)</option>
                            <option value={15}>15 places (Standard)</option>
                            <option value={20}>20 places (Biking)</option>
                            <option value={25}>25 places (Collectif)</option>
                            <option value={30}>30 places (Master)</option>
                          </select>
                        </td>
                        <td className="p-3.5 text-right space-x-1.5">
                          <button
                            onClick={() => openEditModal(s)}
                            className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                            title="Modifier"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleToggleSessionStatus(s.id)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                              s.isCancelled
                                ? 'border-emerald-800 text-emerald-400 hover:bg-emerald-950'
                                : 'border-amber-800 text-amber-400 hover:bg-amber-950'
                            }`}
                          >
                            {s.isCancelled ? 'Restaurer' : 'Annuler'}
                          </button>
                          <button
                            onClick={() => handleDeleteSession(s.id)}
                            className="p-1 rounded bg-neutral-800 hover:bg-red-950 text-red-400"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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

      {/* Modal: Add or Edit Session */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 w-full max-w-lg rounded-2xl border border-neutral-800 overflow-hidden shadow-2xl text-neutral-100">
            <div className="p-5 bg-neutral-950 border-b border-neutral-800 flex justify-between items-center">
              <h3 className="font-black text-sm uppercase tracking-wide text-white">
                {editingSession ? 'Modifier la Séance' : 'Créer un Nouveau Cours au Planning'}
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrUpdateSession} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Activité</label>
                  <select
                    value={formActivity}
                    onChange={(e) => setFormActivity(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-750 text-white rounded-xl px-3 py-2 outline-none"
                  >
                    <option value="Suspension T">Suspension T</option>
                    <option value="Pilates">Pilates</option>
                    <option value="Cross T.">Cross T.</option>
                    <option value="Fight T.">Fight T.</option>
                    <option value="Yoga - Pilates">Yoga - Pilates</option>
                    <option value="Biking">Biking</option>
                    <option value="Danse Classique">Danse Classique</option>
                    <option value="Kizomba">Kizomba</option>
                    <option value="Stretching">Stretching</option>
                    <option value="Body Sculpt">Body Sculpt</option>
                    <option value="HIIT T.">HIIT T.</option>
                    <option value="Gymnastique">Gymnastique</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Studio</label>
                  <select
                    value={formStudio}
                    onChange={(e) => setFormStudio(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-750 text-white rounded-xl px-3 py-2 outline-none"
                  >
                    <option value="Studio Fonctionnel">Studio Fonctionnel</option>
                    <option value="Cours Collectifs">Cours Collectifs</option>
                    <option value="Studio Biking">Studio Biking</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Coach</label>
                  <select
                    value={formCoach}
                    onChange={(e) => setFormCoach(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-750 text-white rounded-xl px-3 py-2 outline-none"
                  >
                    <option value="Kramo">Coach Kramo</option>
                    <option value="Soleil">Coach Soleil</option>
                    <option value="Ismael">Coach Ismael</option>
                    <option value="Didier">Coach Didier</option>
                    <option value="Kante">Coach Kante</option>
                    <option value="Privé">Intervenant Privé</option>
                    <option value="Virtuel">Session Virtuelle</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-750 text-white rounded-xl px-3 py-2 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Heure</label>
                  <input
                    type="text"
                    required
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    placeholder="06h30"
                    className="w-full bg-neutral-950 border border-neutral-750 text-white rounded-xl px-3 py-2 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Capacité (Places)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={50}
                    value={formCapacity}
                    onChange={(e) => setFormCapacity(parseInt(e.target.value, 10))}
                    className="w-full bg-neutral-950 border border-neutral-750 text-white rounded-xl px-3 py-2 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Tarif (FCFA)</label>
                  <input
                    type="number"
                    required
                    step={1000}
                    value={formPrice}
                    onChange={(e) => setFormPrice(parseInt(e.target.value, 10))}
                    className="w-full bg-neutral-950 border border-neutral-750 text-white rounded-xl px-3 py-2 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-red hover:bg-brand-dark text-white font-bold shadow-md transition-all"
                >
                  {editingSession ? 'Sauvegarder' : 'Créer la Séance'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
