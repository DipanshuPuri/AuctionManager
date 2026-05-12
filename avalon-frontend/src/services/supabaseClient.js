import { createClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// Supabase Client – Avalon Frontend
// ---------------------------------------------------------------------------
// Used for realtime subscriptions (bid_logs) on the client side.
// ---------------------------------------------------------------------------

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn('Supabase not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export default supabase;
