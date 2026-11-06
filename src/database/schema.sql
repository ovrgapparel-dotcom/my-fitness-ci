-- ============================================================================
-- MY FITNESS - Supabase PostgreSQL Database Schema (V1.4)
-- Location: Ivoire Trade Center, Cocody, Abidjan, Côte d'Ivoire
-- Currency: XOF (FCFA)
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('MEMBER', 'TRAINER', 'ADMIN', 'RECEPTION');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE membership_tier AS ENUM ('MONTHLY_STANDARD', 'MONTHLY_PREMIUM', 'ANNUAL_VIP');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM ('CONFIRMED', 'CANCELLED', 'LATE_CANCELLED', 'ATTENDED', 'NO_SHOW');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE waitlist_status AS ENUM ('WAITING', 'OFFERED', 'ACCEPTED', 'EXPIRED', 'DECLINED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_provider_enum AS ENUM ('WAVE', 'ORANGE_MONEY', 'MTN_MOMO', 'AGGREGATOR');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status_enum AS ENUM ('CREATED', 'PENDING', 'PROCESSING', 'SUCCEEDED', 'FAILED', 'EXPIRED', 'CANCELLED', 'REFUNDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES & ROLES
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone_number TEXT,
    role user_role DEFAULT 'MEMBER' NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. TRAINERS
CREATE TABLE IF NOT EXISTS trainers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    nickname TEXT,
    bio TEXT,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. STUDIOS
CREATE TABLE IF NOT EXISTS studios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    capacity INT DEFAULT 15 NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. TRAINING TYPES (ACTIVITIES)
CREATE TABLE IF NOT EXISTS training_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    color_hex TEXT DEFAULT '#8b1e26' NOT NULL,
    duration_minutes INT DEFAULT 60 NOT NULL,
    default_price_xof INT DEFAULT 10000 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. MEMBERSHIP PLANS
CREATE TABLE IF NOT EXISTS membership_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    tier membership_tier NOT NULL,
    description TEXT,
    price_xof INT NOT NULL,
    duration_days INT NOT NULL,
    includes_all_studios BOOLEAN DEFAULT TRUE NOT NULL,
    max_active_bookings INT DEFAULT 3 NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 8. MEMBER SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS member_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    plan_id UUID REFERENCES membership_plans(id) NOT NULL,
    status TEXT DEFAULT 'ACTIVE' NOT NULL CHECK (status IN ('ACTIVE', 'EXPIRED', 'CANCELLED', 'SUSPENDED')),
    start_date TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 9. SESSIONS (TRAINING CALENDAR OCCURRENCES)
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_id UUID REFERENCES training_types(id) NOT NULL,
    studio_id UUID REFERENCES studios(id) NOT NULL,
    trainer_id UUID REFERENCES trainers(id) NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    capacity INT DEFAULT 15 NOT NULL,
    booked_seats INT DEFAULT 0 NOT NULL CHECK (booked_seats >= 0 AND booked_seats <= capacity),
    price_xof INT DEFAULT 10000 NOT NULL,
    is_cancelled BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT check_session_times CHECK (end_time > start_time)
);

-- 10. BOOKINGS (CONFIRMED RESERVATIONS)
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    subscription_id UUID REFERENCES member_subscriptions(id),
    status booking_status DEFAULT 'CONFIRMED' NOT NULL,
    booking_type TEXT NOT NULL CHECK (booking_type IN ('MEMBERSHIP', 'INDIVIDUAL_PURCHASE')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    CONSTRAINT unique_user_session_booking UNIQUE (session_id, user_id, status)
);

-- 11. WAITLIST
CREATE TABLE IF NOT EXISTS waitlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    queue_position INT NOT NULL,
    status waitlist_status DEFAULT 'WAITING' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    offered_at TIMESTAMPTZ,
    offer_expires_at TIMESTAMPTZ,
    CONSTRAINT unique_user_session_waitlist UNIQUE (session_id, user_id)
);

-- 12. MEMBER SESSION CREDITS (CREDIT LEDGER)
CREATE TABLE IF NOT EXISTS member_credits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    amount INT DEFAULT 1 NOT NULL, -- Number of session credits
    source TEXT NOT NULL CHECK (source IN ('CANCELLATION_REFUND', 'PURCHASE', 'PROMOTIONAL', 'ADMIN_GRANT')),
    reference_id UUID, -- Reference to booking_id or payment_id
    expires_at TIMESTAMPTZ, -- Optional expiration
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 13. PAYMENT TRANSACTIONS (MOBILE MONEY IN XOF)
CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) NOT NULL,
    purchase_type TEXT NOT NULL CHECK (purchase_type IN ('SESSION_PASS', 'MEMBERSHIP')),
    purchase_reference UUID NOT NULL,
    amount_xof INT NOT NULL,
    currency TEXT DEFAULT 'XOF' NOT NULL,
    provider payment_provider_enum NOT NULL,
    provider_transaction_ref TEXT,
    idempotency_key TEXT UNIQUE NOT NULL,
    status payment_status_enum DEFAULT 'CREATED' NOT NULL,
    customer_phone TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    verified_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 14. GYM SETTINGS & BUSINESS RULES
CREATE TABLE IF NOT EXISTS gym_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Seed default gym rules
INSERT INTO gym_settings (key, value, description)
VALUES 
    ('cancellation_cutoff_hours', '12'::jsonb, 'Minimum hours before session to cancel without penalty'),
    ('waitlist_offer_timeout_minutes', '60'::jsonb, 'Window to accept waitlist seat offer (1 hour)'),
    ('cancellation_refund_policy', '"SESSION_CREDIT"'::jsonb, 'Refund method: automatically issues a session credit for cancellations >= 12h'),
    ('seat_hold_timeout_minutes', '10'::jsonb, 'Temporary hold during Mobile Money checkout'),
    ('max_concurrent_bookings_per_member', '3'::jsonb, 'Max future bookings per standard member')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();

-- 15. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_sessions_start_time ON sessions(start_time);
CREATE INDEX IF NOT EXISTS idx_sessions_activity ON sessions(activity_id);
CREATE INDEX IF NOT EXISTS idx_sessions_studio ON sessions(studio_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_session ON bookings(session_id);
CREATE INDEX IF NOT EXISTS idx_member_credits_user ON member_credits(user_id);
CREATE INDEX IF NOT EXISTS idx_waitlist_session_queue ON waitlist(session_id, queue_position);
CREATE INDEX IF NOT EXISTS idx_payments_idempotency ON payment_transactions(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_payments_user ON payment_transactions(user_id);

-- 16. ROW LEVEL SECURITY (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- Sessions: Public read
CREATE POLICY "Sessions viewable by all" ON sessions FOR SELECT USING (true);

-- Profiles: Own profile or Admin
CREATE POLICY "Users view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Bookings: Own bookings or Staff
CREATE POLICY "Users view own bookings" ON bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Waitlist: Own waitlist entries
CREATE POLICY "Users view own waitlist" ON waitlist FOR SELECT USING (auth.uid() = user_id);

-- Credits: View own credits
CREATE POLICY "Users view own credits" ON member_credits FOR SELECT USING (auth.uid() = user_id);
