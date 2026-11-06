'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface PricingSectionProps {
  onSelectPlan: (planName: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPlan }) => {
  return (
    <section id="tarifs" className="py-16 bg-[#0d0d10] border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-gold">
            Formules Flexibles
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mt-1">
            Abonnements & Séances à la carte
          </h2>
          <p className="text-neutral-400 text-sm mt-2">
            Réglez en toute sécurité via Mobile Money (Wave, Orange Money, MTN MoMo). Tous les montants sont en FCFA (XOF).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Séance Unique */}
          <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-7 shadow-xl hover:border-neutral-700 transition-all flex flex-col justify-between">
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-neutral-400 mb-2">
                Accès Libre
              </div>
              <h3 className="text-xl font-black text-white">Séance à l'Unité</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Idéal pour tester nos studios ou s'entraîner ponctuellement.
              </p>
              <div className="mt-6 mb-6">
                <span className="text-3xl font-black text-white">10 000</span>
                <span className="text-xs font-extrabold text-neutral-400 uppercase ml-1">
                  FCFA / séance
                </span>
              </div>
              <ul className="space-y-3 text-xs text-neutral-300 border-t border-neutral-800 pt-6">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  Accès direct au cours de votre choix
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  Paiement instantané Wave / OM / MTN
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  Annulation sans frais &gt;= 12h (restitué en crédit)
                </li>
              </ul>
            </div>
            <button
              onClick={() => onSelectPlan('Séance Unique')}
              className="mt-8 w-full py-3 rounded-xl border border-brand-red text-red-200 font-black text-xs uppercase tracking-wider hover:bg-brand-red hover:text-white transition-all"
            >
              Choisir un cours
            </button>
          </div>

          {/* Card 2: Pass Mensuel (Featured) */}
          <div className="bg-neutral-900 rounded-2xl border-2 border-brand-red p-7 shadow-2xl relative flex flex-col justify-between">
            <div className="absolute -top-3.5 right-6 bg-brand-red text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
              Plus Populaire
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-brand-gold mb-2">
                Abonnement Mensuel
              </div>
              <h3 className="text-xl font-black text-white">Pass Mensuel Essentiel</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Accès complet aux cours collectifs et au studio fonctionnel.
              </p>
              <div className="mt-6 mb-6">
                <span className="text-3xl font-black text-brand-gold">45 000</span>
                <span className="text-xs font-extrabold text-neutral-400 uppercase ml-1">
                  FCFA / mois
                </span>
              </div>
              <ul className="space-y-3 text-xs text-neutral-300 border-t border-neutral-800 pt-6">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  Accès illimité aux 3 studios
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  Jusqu'à 3 réservations simultanées
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  Priorité sur les listes d'attente (délai 1h)
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  Renouvellement Mobile Money
                </li>
              </ul>
            </div>
            <button
              onClick={() => onSelectPlan('Pass Mensuel Essentiel')}
              className="mt-8 w-full py-3 rounded-xl bg-brand-red text-white font-black text-xs uppercase tracking-wider hover:bg-brand-dark shadow-md transition-all"
            >
              Souscrire au Pass Mensuel
            </button>
          </div>

          {/* Card 3: VIP Annuel */}
          <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-7 shadow-xl hover:border-neutral-700 transition-all flex flex-col justify-between">
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-brand-gold mb-2">
                Prestige & Performance
              </div>
              <h3 className="text-xl font-black text-white">Pass Annuel VIP</h3>
              <p className="text-xs text-neutral-400 mt-1">
                L'engagement total pour transformer votre condition physique.
              </p>
              <div className="mt-6 mb-6">
                <span className="text-3xl font-black text-white">550 000</span>
                <span className="text-xs font-extrabold text-neutral-400 uppercase ml-1">
                  FCFA / an
                </span>
              </div>
              <ul className="space-y-3 text-xs text-neutral-300 border-t border-neutral-800 pt-6">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  Accès illimité 365 jours
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  3 sessions de coaching privé offertes
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  Casier nominatif & kit athlète MY FITNESS
                </li>
              </ul>
            </div>
            <button
              onClick={() => onSelectPlan('Pass Annuel VIP')}
              className="mt-8 w-full py-3 rounded-xl border border-neutral-700 text-neutral-200 font-black text-xs uppercase tracking-wider hover:bg-neutral-800 transition-all"
            >
              Souscrire au VIP
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
