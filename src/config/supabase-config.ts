// Configuración temporal de Supabase - Reemplaza con variables de entorno en producción
export interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceRoleKey: string;
}

export const supabaseConfig: SupabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dkrmwktlresbqdveszzo.supabase.co',
  // IMPORTANTE: Esta debe ser la ANON KEY (pública), no la service role key
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || ''
}