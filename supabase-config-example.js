// Archivo de ejemplo para configurar Supabase
// Copia este archivo y renómbralo a supabase-config.js con tus valores reales

export const supabaseConfig = {
  // URL de tu proyecto Supabase (https://xxxxx.supabase.co)
  url: 'your_supabase_project_url',

  // Clave anónima (public key) - segura para usar en el frontend
  anonKey: 'your_supabase_anon_key',

  // Clave de servicio (service role key) - NUNCA la uses en el frontend
  // Solo para operaciones del servidor
  serviceRoleKey: 'your_supabase_service_role_key'
}

// Para obtener estas claves:
// 1. Ve a https://app.supabase.com
// 2. Crea un nuevo proyecto o selecciona uno existente
// 3. Ve a Settings > API
// 4. Copia la URL del proyecto y las claves