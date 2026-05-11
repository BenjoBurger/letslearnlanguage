import { createClient } from '@supabase/supabase-js';

// Replace with your Supabase project URL and anon key from supabase.com dashboard
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    'Supabase credentials missing. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_KEY in your .env.local'
  );
}

// Fallback in-memory storage for Expo Go (doesn't support native AsyncStorage)
const memoryStorage: Record<string, string> = {};
const storage = {
  getItem: async (key: string) => memoryStorage[key] ?? null,
  setItem: async (key: string, value: string) => {
    memoryStorage[key] = value;
  },
  removeItem: async (key: string) => {
    delete memoryStorage[key];
  },
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: storage as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
