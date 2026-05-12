const { createClient } = require('@supabase/supabase-js');

// ---------------------------------------------------------------------------
// Supabase Configuration – Avalon (AuctionManager)
// ---------------------------------------------------------------------------
// Initializes the Supabase client for server-side usage (storage, realtime).
// Reads credentials from environment variables.
// ---------------------------------------------------------------------------

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️  Supabase credentials not found in environment variables.\n' +
    '   Set SUPABASE_URL and SUPABASE_ANON_KEY to enable cloud features.'
  );
}

const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

module.exports = { supabase };
