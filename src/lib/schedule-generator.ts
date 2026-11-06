// ============================================================================
// MY FITNESS - Full Year 2026 Schedule Generator (Sept - Dec 2026)
// Generates recurring occurrences across all months with admin overrides support
// ============================================================================

import { TrainingSession } from './types';

export const BASE_SESSIONS = [
  { day: 'Lundi', time: '06h30', activity: 'Suspension T', studio: 'Studio Fonctionnel', coach: 'Kramo', color: '#16804f', capacity: 15, defaultBooked: 11, price: 10000 },
  { day: 'Lundi', time: '09h30', activity: 'Pilates', studio: 'Cours Collectifs', coach: 'Kramo', color: '#e86b25', capacity: 25, defaultBooked: 25, price: 10000 },
  { day: 'Lundi', time: '12h30', activity: 'Cross T.', studio: 'Studio Fonctionnel', coach: 'Soleil', color: '#e8b73e', capacity: 15, defaultBooked: 14, price: 12000 },
  { day: 'Lundi', time: '17h30', activity: 'Suspension T', studio: 'Studio Fonctionnel', coach: 'Ismael', color: '#16804f', capacity: 15, defaultBooked: 8, price: 10000 },
  { day: 'Lundi', time: '19h00', activity: 'Fight T.', studio: 'Studio Fonctionnel', coach: 'Kramo', color: '#872028', capacity: 12, defaultBooked: 10, price: 12000, isCustomLimit: true },

  { day: 'Mardi', time: '06h30', activity: 'Yoga - Pilates', studio: 'Cours Collectifs', coach: 'Didier', color: '#e8b73e', capacity: 25, defaultBooked: 16, price: 10000 },
  { day: 'Mardi', time: '12h30', activity: 'Biking', studio: 'Studio Biking', coach: 'Virtuel', color: '#16804f', capacity: 20, defaultBooked: 19, price: 10000 },
  { day: 'Mardi', time: '18h00', activity: 'Cross T.', studio: 'Studio Fonctionnel', coach: 'Kramo', color: '#e8b73e', capacity: 15, defaultBooked: 15, price: 12000 },
  { day: 'Mardi', time: '19h30', activity: 'Fight T.', studio: 'Studio Fonctionnel', coach: 'Virtuel', color: '#872028', capacity: 12, defaultBooked: 9, price: 12000, isCustomLimit: true },

  { day: 'Mercredi', time: '06h30', activity: 'Cross T.', studio: 'Studio Fonctionnel', coach: 'Kramo', color: '#e8b73e', capacity: 15, defaultBooked: 10, price: 12000 },
  { day: 'Mercredi', time: '09h30', activity: 'Danse Classique', studio: 'Cours Collectifs', coach: 'Privé', color: '#872028', capacity: 20, defaultBooked: 14, price: 15000 },
  { day: 'Mercredi', time: '18h00', activity: 'Suspension T', studio: 'Studio Fonctionnel', coach: 'Ismael', color: '#16804f', capacity: 15, defaultBooked: 7, price: 10000 },
  { day: 'Mercredi', time: '19h30', activity: 'Kizomba', studio: 'Cours Collectifs', coach: 'Privé', color: '#872028', capacity: 25, defaultBooked: 18, price: 12000 },

  { day: 'Jeudi', time: '06h30', activity: 'Stretching', studio: 'Cours Collectifs', coach: 'Didier', color: '#16804f', capacity: 25, defaultBooked: 12, price: 8000 },
  { day: 'Jeudi', time: '12h30', activity: 'Cross T.', studio: 'Studio Fonctionnel', coach: 'Kramo', color: '#e8b73e', capacity: 15, defaultBooked: 13, price: 12000 },
  { day: 'Jeudi', time: '18h00', activity: 'Body Sculpt', studio: 'Cours Collectifs', coach: 'Kante', color: '#2675a8', capacity: 25, defaultBooked: 20, price: 10000 },
  { day: 'Jeudi', time: '19h30', activity: 'Fight T.', studio: 'Studio Fonctionnel', coach: 'Kramo', color: '#872028', capacity: 12, defaultBooked: 12, price: 12000, isCustomLimit: true },

  { day: 'Vendredi', time: '06h30', activity: 'HIIT T.', studio: 'Studio Fonctionnel', coach: 'Didier', color: '#2675a8', capacity: 15, defaultBooked: 11, price: 10000 },
  { day: 'Vendredi', time: '09h30', activity: 'Yoga - Pilates', studio: 'Cours Collectifs', coach: 'Kramo', color: '#16804f', capacity: 25, defaultBooked: 15, price: 10000 },
  { day: 'Vendredi', time: '12h30', activity: 'Biking', studio: 'Studio Biking', coach: 'Didier', color: '#16804f', capacity: 20, defaultBooked: 17, price: 10000 },
  { day: 'Vendredi', time: '18h00', activity: 'Pilates', studio: 'Cours Collectifs', coach: 'Ismael', color: '#e86b25', capacity: 25, defaultBooked: 21, price: 10000 },
  { day: 'Vendredi', time: '19h30', activity: 'Cross T.', studio: 'Studio Fonctionnel', coach: 'Kante', color: '#e8b73e', capacity: 15, defaultBooked: 14, price: 12000 },

  { day: 'Samedi', time: '09h30', activity: 'Stretching - Danse', studio: 'Cours Collectifs', coach: 'Privé', color: '#872028', capacity: 20, defaultBooked: 18, price: 12000 },
  { day: 'Samedi', time: '12h30', activity: 'Gymnastique', studio: 'Cours Collectifs', coach: 'Soleil', color: '#872028', capacity: 20, defaultBooked: 16, price: 10000 },
  { day: 'Samedi', time: '18h00', activity: 'Fight T.', studio: 'Studio Fonctionnel', coach: 'Kramo', color: '#872028', capacity: 12, defaultBooked: 11, price: 12000, isCustomLimit: true },
];

export const MONTH_NAMES = ['Septembre', 'Octobre', 'Novembre', 'Décembre'];

const dayOffsets: Record<string, number> = {
  Lundi: 0,
  Mardi: 1,
  Mercredi: 2,
  Jeudi: 3,
  Vendredi: 4,
  Samedi: 5,
};

/**
 * Generates all training sessions from August 31, 2026 to December 31, 2026
 * Total of 18 full calendar weeks (~450 dated sessions)
 */
export function generateFullYear2026Sessions(): TrainingSession[] {
  const result: TrainingSession[] = [];
  const startMonday = new Date(2026, 7, 31); // Aug 31, 2026 (Monday)

  // 18 weeks covers through Sunday January 3, 2027
  for (let weekIndex = 0; weekIndex < 18; weekIndex++) {
    BASE_SESSIONS.forEach((base, sessionIdx) => {
      const date = new Date(startMonday);
      date.setDate(startMonday.getDate() + weekIndex * 7 + dayOffsets[base.day]);

      // Stop at end of 2026 (Dec 31, 2026)
      if (date.getFullYear() !== 2026 || date.getMonth() < 8) return;

      const monthName = date.toLocaleDateString('fr-FR', { month: 'long' });
      const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
      const dayNum = date.getDate();
      const monthIndex = date.getMonth(); // 8 = Sept, 9 = Oct, 10 = Nov, 11 = Dec

      const sessionId = `sess-2026-${String(monthIndex + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}-${base.day.toLowerCase()}-${sessionIdx}`;

      result.push({
        id: sessionId,
        day: base.day,
        date: dayNum,
        month: capitalizedMonth,
        monthIndex: monthIndex,
        year: 2026,
        time: base.time,
        activity: base.activity,
        studio: base.studio,
        coach: base.coach,
        color: base.color,
        capacity: base.capacity,
        bookedSeats: Math.min(base.capacity, Math.max(0, base.defaultBooked + (weekIndex % 3) - 1)),
        priceXOF: base.price,
        week: weekIndex,
        fullDateString: `${base.day} ${dayNum} ${monthName} 2026`,
        isCancelled: false,
        isCustomLimit: base.isCustomLimit || false,
      });
    });
  }

  return result;
}
