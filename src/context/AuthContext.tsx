'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { authService } from '@/services/authService';
import { profileService } from '@/services/profileService';
import { Profile } from '@/types';
import { User as SupabaseUser } from '@supabase/supabase-js';

// Combine Supabase User with our Profile data
interface UserWithProfile extends SupabaseUser {
  profile?: Profile;
}

interface AuthContextType {
  user: UserWithProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserWithProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session on mount
    const initSession = async () => {
      try {
        const session = await authService.getCurrentSession();
        if (session?.user) {
          await refreshUserProfile(session.user);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing session:', error);
        setLoading(false);
      }
    };

    initSession();

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Only refresh if we don't have the user or it's a difference user
        // (Optimizing to avoid double fetch if initSession also runs, but onAuthStateChange behavior varies)
        if (!user || user.id !== session.user.id) {
          await refreshUserProfile(session.user);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const refreshUserProfile = async (authUser: SupabaseUser) => {
    try {
      const profile = await profileService.getProfile(authUser.id);
      setUser({ ...authUser, profile });
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Fallback: set user without profile data
      setUser({ ...authUser });
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await refreshUserProfile(user);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { user, session } = await authService.signIn(email, password);
      if (user && session) {
        await refreshUserProfile(user);
      } else {
        // Should generally not happen on successful sign in without session unless email confirm issue
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const { user, session } = await authService.signUp(email, password, name, null);
      if (user && session) {
        await refreshUserProfile(user);
      } else {
        // Email confirmation required or other case where session is null
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await authService.signOut();
      setUser(null);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
