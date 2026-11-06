'use client';

import React, { useState, useMemo } from 'react';
import { CheckCircle, Search, ChevronLeft, ChevronRight, MapPin, User, Check, Clock, Ticket, CalendarX, Sparkles } from 'lucide-react';
import { TrainingSession } from '@/lib/types';

interface CalendarSectionProps {
  sessions: TrainingSession[];
  userBookedSessionIds: Set<string>;
  onSelectSession: (session: TrainingSession) => void;
}

export const CalendarSection: React.FC<CalendarSectionProps> = ({
  sessions,
  userBookedSessionIds,
  onSelectSession,
}) => {
  const [currentWeek, setCurrentWeek] = useState<number>(0);
  const [activityFilter, setActivityFilter] = useState<string>('all');
  const [studioFilter, setStudioFilter] = useState<string>('all');
  const [dayFilter, setDayFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const activities = useMemo(() => {
    return Array.from(new Set(sessions.map((s) => s.activity))).sort();
  }, [sessions]);

  const studios = useMemo(() => {
    return Array.from(new Set(sessions.map((s) => s.studio))).sort();
  }, [sessions]);

  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  const filteredSessions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return sessions.filter((s) => {
      const matchWeek = s.week === currentWeek;
      const matchAct = activityFilter === 'all' || s.activity === activityFilter;
      const matchStudio = studioFilter === 'all' || s.studio === studioFilter;
      const matchDay = dayFilter === 'all' || s.day === dayFilter;
      const matchQuery =
        !q ||
        [s.activity, s.studio, s.coach].some((val) =>
          val.toLowerCase().includes(q)
        );
      return matchWeek && matchAct && matchStudio && matchDay && matchQuery;
    });
  }, [sessions, currentWeek, activityFilter, studioFilter, dayFilter, searchQuery]);

  const weekTitle = useMemo(() => {
    const start = new Date(2026, 7, 31 + currentWeek * 7);
    const end = new Date(2026, 7, 31 + currentWeek * 7 + 6);
    return `Semaine du ${start.getDate()} ${start.toLocaleDateString('fr-FR', {
      month: 'long',
    })} au ${end.getDate()} ${end.toLocaleDateString('fr-FR', {
      month: 'long',
    })} 2026`;
  }, [currentWeek]);

  return (
    <section id="planning" className="py-16 bg-[#0a0a0c] border-y border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5 mb-2">
              <CheckCircle className="w-4 h-4" />
              Places & Réservations en Temps Réel
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
              Planning des Cours · <span className="text-brand-red">Septembre 2026</span>
            </h2>
            <p className="text-neutral-400 text-sm mt-1 max-w-xl">
              Consultez les 25 créneaux hebdomadaires. Règle d'annulation 12h avec restitution en crédit de séance et liste d'attente automatique (délai 1h).
            </p>
          </div>

          <div className="flex items-center gap-3 bg-neutral-900 border border-neutral-800 px-4 py-3 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-brand-red/20 text-brand-red border border-brand-red/30 flex items-center justify-center font-black">
              MF
            </div>
            <div className="text-xs">
              <div className="font-bold text-neutral-200">25 créneaux / semaine</div>
              <div className="text-neutral-400">Studios : Fonctionnel · Collectifs · Biking</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-neutral-900/90 p-5 rounded-2xl border border-neutral-800 mb-8 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-300 mb-1.5">
                Activité
              </label>
              <select
                value={activityFilter}
                onChange={(e) => setActivityFilter(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-750 text-neutral-100 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-red"
              >
                <option value="all">Toutes les activités ({activities.length})</option>
                {activities.map((act) => (
                  <option key={act} value={act}>
                    {act}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-300 mb-1.5">
                Studio
              </label>
              <select
                value={studioFilter}
                onChange={(e) => setStudioFilter(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-750 text-neutral-100 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-red"
              >
                <option value="all">Tous les studios ({studios.length})</option>
                {studios.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-300 mb-1.5">
                Jour
              </label>
              <select
                value={dayFilter}
                onChange={(e) => setDayFilter(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-750 text-neutral-100 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-red"
              >
                <option value="all">Tous les jours (Lun - Sam)</option>
                {days.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-300 mb-1.5">
                Rechercher
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Coach, Pilates, Biking..."
                  className="w-full bg-neutral-950 border border-neutral-750 text-neutral-100 rounded-xl pl-9 pr-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-red"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Week Switcher */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-800">
          <button
            onClick={() => setCurrentWeek((w) => Math.max(0, w - 1))}
            disabled={currentWeek === 0}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-800 bg-neutral-900 text-xs font-extrabold text-neutral-200 hover:border-brand-red hover:text-brand-red disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            Semaine précédente
          </button>

          <div className="text-center">
            <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wide">
              {weekTitle}
            </h3>
            <p className="text-[11px] text-neutral-400 font-medium">Créneaux ouverts à la réservation</p>
          </div>

          <button
            onClick={() => setCurrentWeek((w) => Math.min(4, w + 1))}
            disabled={currentWeek === 4}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-800 bg-neutral-900 text-xs font-extrabold text-neutral-200 hover:border-brand-red hover:text-brand-red disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Semaine suivante
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Sessions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((session) => {
            const isFull = session.bookedSeats >= session.capacity;
            const isUserBooked = userBookedSessionIds.has(session.id);
            const isCustomLimit = session.capacity === 12; // Example of custom limit for Fight Training

            return (
              <article
                key={session.id}
                style={{ borderLeftColor: session.color, borderLeftWidth: '5px' }}
                className="bg-neutral-900/90 rounded-2xl border border-neutral-800 p-5 shadow-lg hover:shadow-2xl hover:border-neutral-700 transition-all flex flex-col justify-between relative overflow-hidden group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-black text-brand-gold uppercase tracking-wider">
                      {session.day} {session.date} sept.
                    </span>
                    <span className="font-extrabold text-neutral-200 bg-neutral-800 px-2.5 py-0.5 rounded-full border border-neutral-700">
                      {session.time}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-base font-black text-white group-hover:text-brand-red transition-colors">
                      {session.activity}
                    </h4>
                    {isCustomLimit && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider bg-brand-red/20 text-red-300 border border-brand-red/40 px-2 py-0.5 rounded-full">
                        <Sparkles className="w-2.5 h-2.5" />
                        Capacité Custom
                      </span>
                    )}
                  </div>

                  <div className="mt-2 text-xs text-neutral-400 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-neutral-500" /> {session.studio}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-neutral-500" /> Coach :{' '}
                      <span className="font-bold text-neutral-200">{session.coach}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-neutral-800">
                  <div className="flex items-center justify-between text-xs mb-3">
                    <div
                      className={`flex items-center gap-1.5 font-bold ${
                        isFull ? 'text-amber-400' : 'text-emerald-400'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isFull ? 'bg-amber-400' : 'bg-emerald-400'
                        }`}
                      />
                      {isFull ? 'Séance complète' : `${session.capacity - session.bookedSeats} places libres`}
                    </div>
                    <span className="text-neutral-400 text-[11px]">
                      {session.bookedSeats}/{session.capacity}
                    </span>
                  </div>

                  {isUserBooked ? (
                    <button
                      disabled
                      className="w-full py-2.5 rounded-xl bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-default"
                    >
                      <Check className="w-4 h-4" />
                      Place Réservée
                    </button>
                  ) : (
                    <button
                      onClick={() => onSelectSession(session)}
                      className={`w-full py-2.5 rounded-xl ${
                        isFull
                          ? 'bg-amber-500 hover:bg-amber-600 text-amber-950'
                          : 'bg-brand-red hover:bg-brand-dark text-white'
                      } font-extrabold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5`}
                    >
                      {isFull ? <Clock className="w-3.5 h-3.5" /> : <Ticket className="w-3.5 h-3.5" />}
                      {isFull ? "Rejoindre la liste d'attente (délai 1h)" : 'Réserver ma place'}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {filteredSessions.length === 0 && (
          <div className="text-center py-16 bg-neutral-900/60 rounded-2xl border border-dashed border-neutral-800">
            <CalendarX className="w-12 h-12 text-neutral-500 mx-auto mb-3" />
            <h4 className="font-bold text-neutral-300 text-base">Aucun cours ne correspond à vos filtres</h4>
            <p className="text-xs text-neutral-500 mt-1">
              Essayez d'élargir vos critères de recherche ou sélectionnez un autre jour.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
