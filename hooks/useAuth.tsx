import { Session } from '@supabase/supabase-js';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

type User = { id: string; email: string; displayName?: string } | null;

type AuthContextType = {
  user: User;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateProfile: (displayName: string) => Promise<{ error: string | null }>;
  updateEmail: (newEmail: string) => Promise<{ error: string | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: string | null }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const mounted = React.useRef(true);

  useEffect(() => {
    // Recover session on mount
    const recoverSession = async () => {
      try {
        const {
          data: { session: recoveredSession },
        } = await supabase.auth.getSession();

        if (mounted.current) {
          setSession(recoveredSession);
          if (recoveredSession?.user) {
            const md = recoveredSession.user.user_metadata as any;
            const displayName = md?.full_name || md?.display_name || md?.name || undefined;
            setUser({
              id: recoveredSession.user.id,
              email: recoveredSession.user.email || '',
              displayName,
            });
          }
        }
      } finally {
        if (mounted.current) setLoading(false);
      }
    };

    recoverSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (mounted.current) {
        setSession(newSession);
        if (newSession?.user) {
          const md = newSession.user.user_metadata as any;
          const displayName = md?.full_name || md?.display_name || md?.name || undefined;
          setUser({
            id: newSession.user.id,
            email: newSession.user.email || '',
            displayName,
          });
        } else {
          setUser(null);
        }
      }
    });

    return () => {
      mounted.current = false;
      subscription?.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      return { error: error?.message || null };
    } catch (err) {
      return { error: (err as Error).message };
    }
  };

  const updateProfile = async (displayName: string) => {
    try {
      // Check username uniqueness in `profiles` table (case-insensitive)
      if (!session?.user) return { error: 'No authenticated user' };
      const userId = session.user.id;

      const { data: existing, error: checkErr } = await supabase
        .from('profiles')
        .select('id')
        .ilike('username', displayName)
        .limit(1)
        .maybeSingle();

      if (checkErr) {
        console.warn('Username uniqueness check failed:', checkErr.message);
      }

      if (existing && existing.id !== userId) {
        return { error: 'Username already taken' };
      }

      // Upsert into profiles table (will create or update)
      const { error: upsertErr } = await supabase.from('profiles').upsert({ id: userId, username: displayName, updated_at: new Date().toISOString() });
      if (upsertErr) {
        return { error: `Failed to save username: ${upsertErr.message}` };
      }

      // Update auth user metadata as a fallback for display name
      const { error } = await supabase.auth.updateUser({ data: { full_name: displayName } as any });
      if (error) return { error: error.message };

      if (mounted.current) {
        setUser((prev) => (prev ? { ...prev, displayName } : prev));
      }
      return { error: null };
    } catch (err) {
      if (mounted.current) {
        setUser((prev) => (prev ? { ...prev, displayName } : prev));
      }
      return { error: (err as Error).message };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error: error?.message || null };
    } catch (err) {
      return { error: (err as Error).message };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    if (mounted.current) {
      setUser(null);
      setSession(null);
    }
  };

  const updateEmail = async (newEmail: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) return { error: error.message };
      if (mounted.current) {
        setUser((prev) => (prev ? { ...prev, email: newEmail } : prev));
      }
      return { error: null };
    } catch (err) {
      return { error: (err as Error).message };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) return { error: error.message };
      return { error: null };
    } catch (err) {
      return { error: (err as Error).message };
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut, updateProfile, updateEmail, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export { AuthContext };
