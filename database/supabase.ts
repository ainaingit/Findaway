import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error(
    'Supabase environment variables are missing. Please check your .env file and make sure EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_KEY are defined.'
  )
}

// The client is created once and used throughout the app
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

// Helper to safely get Supabase client
export const getSupabase = () => {
  if (!supabase) throw new Error('Supabase client is not available during build')
  return supabase
}


/* ========================
Alternative version with non-null assertion (!)

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,  // ❗ the ! tells TypeScript "I know this is not null/undefined"
  process.env.EXPO_PUBLIC_SUPABASE_KEY!,  // ❗ same here
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
)
*/