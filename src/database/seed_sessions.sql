-- ============================================================================
-- MY FITNESS - Seed Script: Studios, Trainers, Activities & Sessions
-- Exact migration of the 25 classes from the legacy schedule
-- ============================================================================

-- 1. Studios
INSERT INTO studios (name, capacity, description) VALUES
('Studio Fonctionnel', 15, 'Espace dédié au Functional Training, Suspension et Combat'),
('Cours Collectifs', 25, 'Grand studio pour Pilates, Danse, Yoga et Stretching'),
('Studio Biking', 20, 'Studio immersif RPM et sessions vélo indoor')
ON CONFLICT (name) DO NOTHING;

-- 2. Trainers
INSERT INTO trainers (full_name, nickname) VALUES
('Kramo', 'Coach Kramo'),
('Soleil', 'Coach Soleil'),
('Ismael', 'Coach Ismael'),
('Didier', 'Coach Didier'),
('Kante', 'Coach Kante'),
('Privé', 'Intervenant Extérieur'),
('Virtuel', 'Session Virtuelle Assistée')
ON CONFLICT DO NOTHING;

-- 3. Training Types (Activities)
INSERT INTO training_types (name, category, color_hex, duration_minutes, default_price_xof) VALUES
('Suspension T', 'Fonctionnel', '#16804f', 60, 10000),
('Pilates', 'Collectif', '#e86b25', 60, 10000),
('Cross T.', 'Fonctionnel', '#e8b73e', 60, 12000),
('Fight T.', 'Combat', '#872028', 60, 12000),
('Yoga - Pilates', 'Bien-être', '#e8b73e', 60, 10000),
('Biking', 'Cardio', '#16804f', 45, 10000),
('Danse Classique', 'Collectif', '#872028', 60, 15000),
('Kizomba', 'Danse', '#872028', 60, 12000),
('Stretching', 'Récupération', '#16804f', 45, 8000),
('Body Sculpt', 'Renforcement', '#2675a8', 60, 10000),
('HIIT T.', 'Cardio Haute Intensité', '#2675a8', 45, 10000),
('Stretching - Danse', 'Collectif', '#872028', 60, 12000),
('Gymnastique', 'Collectif', '#872028', 60, 10000)
ON CONFLICT (name) DO NOTHING;

-- 4. Membership Plans
INSERT INTO membership_plans (name, tier, description, price_xof, duration_days, includes_all_studios, max_active_bookings) VALUES
('Pass Mensuel Essentiel', 'MONTHLY_STANDARD', 'Accès illimité aux cours collectifs et functional training', 45000, 30, true, 3),
('Pass Mensuel Premium', 'MONTHLY_PREMIUM', 'Accès illimité à tous les studios + Biking + priorité liste d''attente', 65000, 30, true, 5),
('Pass Annuel VIP', 'ANNUAL_VIP', 'Accès annuel complet VIP + casier dédié + 3 sessions de coaching privé', 550000, 365, true, 10)
ON CONFLICT DO NOTHING;
