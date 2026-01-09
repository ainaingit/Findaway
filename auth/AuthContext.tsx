import { User } from '@supabase/supabase-js';
import React, { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import { getSupabase } from '../database/supabase';
import * as SecureStore from 'expo-secure-store';

const ROLE_KEY = 'user_role';
const USERNAME_KEY = 'user_name';

interface SignInResult {
  user: User | null;
  role: string | null;
  username: string | null;
}

interface AuthContextProps {
  user: User | null;
  role: string | null;
  username: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<SignInResult | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabase();

  // fetch role et username depuis Supabase
  const fetchProfileFromDb = async (userId?: string): Promise<{ role: string | null; username: string | null }> => {
    if (!userId) return { role: null, username: null };
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('role, username')
        .eq('id', userId)
        .single();
      if (error || !data) return { role: null, username: null };
      return { role: data.role ?? null, username: data.username ?? null };
    } catch {
      return { role: null, username: null };
    }
  };

  useEffect(() => {
    let mounted = true;

    const restoreSession = async () => {
      setLoading(true);
      try {
        const { data } = await supabase.auth.getSession();
        const sessionUser = data?.session?.user ?? null;

        if (!sessionUser) {
          setUser(null);
          setRole(null);
          setUsername(null);
        } else {
          setUser(sessionUser);

          // lit le role et username depuis SecureStore
          let storedRole = await SecureStore.getItemAsync(ROLE_KEY);
          let storedUsername = await SecureStore.getItemAsync(USERNAME_KEY);

          // si absent, fetch depuis DB
          if (!storedRole || !storedUsername) {
            const profile = await fetchProfileFromDb(sessionUser.id);
            storedRole = profile.role;
            storedUsername = profile.username;

            if (storedRole) await SecureStore.setItemAsync(ROLE_KEY, storedRole);
            if (storedUsername) await SecureStore.setItemAsync(USERNAME_KEY, storedUsername);
          }

          setRole(storedRole);
          setUsername(storedUsername);
        }
      } catch {
        setUser(null);
        setRole(null);
        setUsername(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    restoreSession();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const sessionUser = session?.user ?? null;
      if (!sessionUser) {
        setUser(null);
        setRole(null);
        setUsername(null);
      } else {
        setUser(sessionUser);

        let storedRole = await SecureStore.getItemAsync(ROLE_KEY);
        let storedUsername = await SecureStore.getItemAsync(USERNAME_KEY);

        if (!storedRole || !storedUsername) {
          const profile = await fetchProfileFromDb(sessionUser.id);
          storedRole = profile.role;
          storedUsername = profile.username;

          if (storedRole) await SecureStore.setItemAsync(ROLE_KEY, storedRole);
          if (storedUsername) await SecureStore.setItemAsync(USERNAME_KEY, storedUsername);
        }

        setRole(storedRole);
        setUsername(storedUsername);
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<SignInResult | null> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    const signedInUser = data.user ?? null;
    if (!signedInUser) return { user: null, role: null, username: null };

    setUser(signedInUser);

    const profile = await fetchProfileFromDb(signedInUser.id);
    setRole(profile.role);
    setUsername(profile.username);

    if (profile.role) await SecureStore.setItemAsync(ROLE_KEY, profile.role);
    if (profile.username) await SecureStore.setItemAsync(USERNAME_KEY, profile.username);

    return { user: signedInUser, role: profile.role, username: profile.username };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
    setUsername(null);
    await SecureStore.deleteItemAsync(ROLE_KEY);
    await SecureStore.deleteItemAsync(USERNAME_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, role, username, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
