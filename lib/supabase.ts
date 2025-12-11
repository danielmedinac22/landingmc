import { createClient } from '@supabase/supabase-js'
import { supabaseConfig } from '../src/config/supabase-config'

// Usar configuración temporal - en producción usar variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || supabaseConfig.url
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || supabaseConfig.anonKey
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseConfig.serviceRoleKey

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Client para server-side operations (con service role key)
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey
)