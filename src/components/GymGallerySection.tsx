'use client';

import React, { useState } from 'react';
import { Flame, Users, Bike, Dumbbell, ArrowRight, Eye, Sparkles, KeyRound, Award } from 'lucide-react';

interface GymGallerySectionProps {
  onFilterStudio?: (studioName: string) => void;
}

export const GymGallerySection: React.FC<GymGallerySectionProps> = ({ onFilterStudio }) => {
  const [activeModalImage, setActiveModalImage] = useState<{ src: string; title: string; subtitle: string } | null>(null);

  const spaces = [
    {
      id: 'biking',
      title: 'Studio Biking Indoor',
      subtitle: 'Immersion Cardio & RPM sur écran géant',
      description: 'Vélos indoor haute précision, sonorisation dynamique et projections immersives pour des sessions cardio intenses.',
      capacity: '20 vélos de compétition',
      image: '/assets/studios/studio-biking.jpg',
      tag: 'Studio Biking',
      filterStudio: 'Studio Biking',
      icon: Bike,
    },
    {
      id: 'collectifs',
      title: 'Studio Cours Collectifs',
      subtitle: 'Pilates, Danse, Body Sculpt & Yoga',
      description: 'Grand studio avec parquet technique, matériel Les Mills, barres pump, steps réglables et fresques graphiques motivantes.',
      capacity: '25 participants',
      image: '/assets/studios/studio-collectifs.jpg',
      tag: 'Cours Collectifs',
      filterStudio: 'Cours Collectifs',
      icon: Users,
    },
    {
      id: 'fonctionnel',
      title: 'Zone Functional & Musculation',
      subtitle: 'Suspension T, Fight T. & Poids Libres',
      description: 'Espace Panatta équipé de bancs professionnels, haltères, barres olympiques et espaliers. Devise du club : « Seul on va plus vite, ensemble on va plus loin ! »',
      capacity: '15 participants en circuit',
      image: '/assets/studios/zone-fonctionnel-poids.jpg',
      tag: 'Studio Fonctionnel',
      filterStudio: 'Studio Fonctionnel',
      icon: Dumbbell,
    },
    {
      id: 'cardio',
      title: 'Plateau Cardio & Rameurs',
      subtitle: 'Tapis de course, vélos elliptiques & RowErg',
      description: 'Alignement d’équipements cardio connectés dernière génération sous éclairage LED suspendu design et écrans HD.',
      capacity: 'Accès libre permanent',
      image: '/assets/studios/plateau-cardio.jpg',
      tag: 'Plateau Cardio',
      filterStudio: 'Studio Fonctionnel',
      icon: Flame,
    },
    {
      id: 'vestiaires',
      title: 'Vestiaires VIP & Casiers Sécurisés',
      subtitle: 'Confort, design boisé & finitions granit',
      description: 'Casiers individuels digitaux à code (MF101, MF102...), bancs en bois massif, douches privatives haut de gamme et vasques en granit.',
      capacity: 'Espaces Homme & Femme',
      image: '/assets/studios/vestiaires-vip.jpg',
      tag: 'Confort & Prestige',
      filterStudio: 'all',
      icon: KeyRound,
    },
    {
      id: 'coaching',
      title: 'Performance & Personal Coaching',
      subtitle: 'Accompagnement d’élite par coachs certifiés',
      description: 'Programmes sur mesure pour renforcement, préparation athlétique et perte de poids avec nos coachs Kramo, Soleil, Didier et Ismael.',
      capacity: 'Suivi individuel personnalisé',
      image: '/assets/studios/coach-musculation.jpg',
      tag: 'Élite Coaching',
      filterStudio: 'Studio Fonctionnel',
      icon: Award,
    },
  ];

  return (
    <section id="studios" className="py-20 bg-[#0d0d10] border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand-gold flex items-center gap-1.5 mb-2">
              <Sparkles className="w-4 h-4 text-brand-gold" />
              Espaces & Équipements de Haute Précision
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
              Nos Studios & Installations · <span className="text-brand-red">MY FITNESS</span>
            </h2>
            <p className="text-neutral-400 text-sm mt-1 max-w-xl">
              Découvrez les installations réelles de notre club à l'Ivoire Trade Center, Cocody. Un environnement premium conçu pour maximiser vos performances sportives.
            </p>
          </div>

          <a
            href="#hero-tour"
            className="inline-flex items-center gap-2 text-xs font-extrabold text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 px-4 py-2.5 rounded-xl hover:border-brand-red transition-all"
          >
            <Eye className="w-4 h-4 text-brand-red" />
            Visiter aussi en 3D immersive
          </a>
        </div>

        {/* Gallery Grid (3 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spaces.map((space) => {
            const Icon = space.icon;
            return (
              <div
                key={space.id}
                className="group bg-neutral-900/90 rounded-2xl border border-neutral-800 overflow-hidden shadow-2xl hover:border-neutral-700 transition-all flex flex-col justify-between"
              >
                {/* Photo frame */}
                <div
                  className="relative h-56 sm:h-64 w-full overflow-hidden bg-neutral-950 cursor-pointer"
                  onClick={() =>
                    setActiveModalImage({
                      src: space.image,
                      title: space.title,
                      subtitle: space.subtitle,
                    })
                  }
                >
                  <img
                    src={space.image}
                    alt={space.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
                  
                  {/* Tag badge */}
                  <div className="absolute top-3.5 left-3.5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-950/80 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold">
                      <Icon className="w-3.5 h-3.5 text-brand-gold" />
                      {space.tag}
                    </span>
                  </div>

                  {/* Zoom button */}
                  <div className="absolute bottom-3.5 right-3.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-white text-[11px] font-bold border border-white/30 flex items-center gap-1">
                      <Eye className="w-3 h-3" /> Zoom
                    </button>
                  </div>
                </div>

                {/* Content details */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-lg font-black text-white group-hover:text-brand-gold transition-colors">
                      {space.title}
                    </h3>
                    <p className="text-[11px] font-bold text-brand-red uppercase tracking-wider mt-0.5">
                      {space.subtitle}
                    </p>
                    <p className="text-xs text-neutral-400 leading-relaxed mt-2">
                      {space.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
                    <span className="text-[11px] text-neutral-400">
                      Capacité : <strong className="text-neutral-200">{space.capacity}</strong>
                    </span>

                    {onFilterStudio && space.filterStudio !== 'all' && (
                      <button
                        onClick={() => onFilterStudio(space.filterStudio)}
                        className="inline-flex items-center gap-1 text-xs font-black text-brand-gold hover:text-white transition-colors"
                      >
                        <span>Voir cours</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Motivational Banner with Coach Visual */}
        <div className="mt-12 bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 rounded-3xl border border-neutral-800 p-8 sm:p-10 relative overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-red/30 text-red-300 border border-brand-red/50 text-[11px] font-bold uppercase tracking-wider">
                Conseil & Esprit MY FITNESS
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight leading-tight">
                "N'attendez pas demain, commencez dès aujourd'hui à sculpter votre corps de rêve."
              </h3>
              <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-xl">
                Que vous souhaitiez vous dépasser en RPM Biking, vous affiner en Pilates ou forger votre puissance en Functional Training, nos coachs certifiés vous attendent à l'Ivoire Trade Center.
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <a
                  href="#planning"
                  className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-dark text-white px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
                >
                  Réserver un créneau cette semaine
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center gap-4">
              <div className="w-40 sm:w-48 h-56 sm:h-64 rounded-2xl overflow-hidden border-2 border-brand-red/40 shadow-2xl relative group">
                <img
                  src="/assets/studios/coach-fitness.jpg"
                  alt="Coach MY FITNESS"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                  <div className="text-xs">
                    <div className="font-black text-white">Coaching Fitness</div>
                    <div className="text-[10px] text-brand-gold">Mon rdv sport & santé</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Lightbox Modal for Full Res Image */}
      {activeModalImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveModalImage(null)}
        >
          <div className="max-w-4xl w-full bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden shadow-2xl">
            <div className="relative max-h-[75vh] overflow-hidden bg-black flex items-center justify-center">
              <img
                src={activeModalImage.src}
                alt={activeModalImage.title}
                className="w-full h-auto max-h-[75vh] object-contain"
              />
            </div>
            <div className="p-4 bg-neutral-950 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">{activeModalImage.title}</h4>
                <p className="text-xs text-brand-gold">{activeModalImage.subtitle}</p>
              </div>
              <button
                onClick={() => setActiveModalImage(null)}
                className="px-3 py-1.5 rounded-lg bg-neutral-800 text-white text-xs font-bold hover:bg-neutral-700"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
