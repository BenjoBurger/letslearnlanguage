-- Create profiles table to store user display names and related data
-- Run this in your Supabase SQL editor or via psql connected to your Supabase database

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index for fast username lookups (case-insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_ci_idx ON public.profiles ((lower(username)));
