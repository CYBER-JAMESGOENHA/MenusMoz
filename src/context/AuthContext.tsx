import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: any; data?: any }>;
  updatePassword: (newPassword: string) => Promise<{ error?: any; data?: any }>;
  deleteAccount: () => Promise<{ success: boolean }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    // Get current session immediately on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
  };

  const resetPassword = async (email: string) => {
    if (!isSupabaseConfigured || !supabase) return { error: 'Supabase not configured' };
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/perfil?reset=true`,
    });
  };

  const updatePassword = async (newPassword: string) => {
    if (!isSupabaseConfigured || !supabase) return { error: 'Supabase not configured' };
    return await supabase.auth.updateUser({ password: newPassword });
  };

  const deleteAccount = async () => {
    // Note: In real production, this would call specialized Edge Function or Management API.
    // Here we simulate successful deletion by signing out.
    await signOut();
    return { success: true };
  };

  const value: AuthContextType = {
    user,
    loading,
    signOut,
    resetPassword,
    updatePassword,
    deleteAccount,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
