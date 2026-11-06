'use client';

import React from 'react';
import { MapPin, Phone, Mail, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const Footer: React.FC = () => {
  const router = useRouter();

  const handleAdminDoubleClick = () => {
    router.push('/admin');
  };

  return (
    <footer id="contact" className="bg-brand-dark text-white pt-14 pb-8 border-t-4 border-brand-red">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white p-1">
                <img
                  src="/assets/logo.jpg"
                  alt="MY FITNESS Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl font-black tracking-tight">MY FITNESS</span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              Votre club de sport & santé à l'Ivoire Trade Center, Cocody, Abidjan. Studios Biking, Fonctionnel et Cours Collectifs.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-brand-gold mb-3">
              Horaires d'Ouverture
            </h4>
            <ul className="text-xs text-white/80 space-y-2">
              <li>Lundi – Vendredi : 06h00 – 21h30</li>
              <li>Samedi : 08h30 – 19h30</li>
              <li>Dimanche : Fermé (Maintenance)</li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-brand-gold mb-3">
              Localisation & Contact
            </h4>
            <ul className="text-xs text-white/80 space-y-2">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <span>Ivoire Trade Center, ITC Cocody, Galerie Commerciale, Abidjan</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-gold shrink-0" />
                <span>+225 07 04 87 76 57</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-gold shrink-0" />
                <span>contact@myfitness.ci</span>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-brand-gold mb-3">
              Paiements Mobiles
            </h4>
            <p className="text-xs text-white/70 mb-3">
              Transactions instantanées et sécurisées en FCFA (XOF) :
            </p>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-white/10 rounded-lg text-[11px] font-bold">Wave</span>
              <span className="px-2.5 py-1 bg-white/10 rounded-lg text-[11px] font-bold">Orange Money</span>
              <span className="px-2.5 py-1 bg-white/10 rounded-lg text-[11px] font-bold">MTN MoMo</span>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 gap-3">
          <div className="flex items-center gap-2">
            <p>© 2026 MY FITNESS. Tous droits réservés.</p>
            <button
              onDoubleClick={handleAdminDoubleClick}
              className="text-white/20 hover:text-white/60 transition-colors p-1"
              title="Accès Admin (Double-clic)"
              aria-label="Accès Admin"
            >
              <Lock className="w-3 h-3" />
            </button>
          </div>
          <p>Règle d'annulation : 12 heures avant chaque séance (restitution en crédit).</p>
        </div>
      </div>
    </footer>
  );
};
