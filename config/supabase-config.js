// Configuración temporal de Supabase - Reemplaza con variables de entorno en producción
export const supabaseConfig = {
  url: 'https://dkrmwktlresbqdveszzo.supabase.co',
  // NOTA: Esta parece ser una service role key. Necesitas obtener la anon key de Supabase
  // Ve a Settings > API en tu proyecto de Supabase para obtener la anon key
  anonKey: 'sb_secret_t52OcJ5fWr3LdvXxMtXALg_PtBw1xDA', // Temporal - reemplaza con anon key
  serviceRoleKey: 'sb_secret_t52OcJ5fWr3LdvXxMtXALg_PtBw1xDA'
}