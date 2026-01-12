import { User } from '@supabase/supabase-js'
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { supabase } from '../database/supabase'

interface AuthContextProps {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Restore session on app start
    const restoreSession = async () => {
      const { data } = await supabase.auth.getSession()
      console.log('Session restored:', data.session?.user) // debug current session
      setUser(data.session?.user ?? null)
      setLoading(false)
    }

    restoreSession()

    // Listen for auth state changes (sign-in, sign-out, token refresh)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signOut = async () => {
    const currentUserId = user?.id ?? 'unknown'
    await supabase.auth.signOut()
    setUser(null)
    const timestamp = new Date().toISOString()
    console.log(`User signed out | ID: ${currentUserId} | Time: ${timestamp}`)
  }

  return <AuthContext.Provider value={{ user, loading, signIn, signOut }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
