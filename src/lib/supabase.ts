// ============================================================================
// MY FITNESS - Supabase Client Initialization
// Supports both public browser client and elevated server client
// ============================================================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key';

// Client-side Supabase instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side privileged client with Service Role (Edge API only)
export function getServiceSupabase() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;
  return createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
