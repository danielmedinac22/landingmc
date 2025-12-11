const fs = require('fs');
const path = require('path');

console.log('🔧 Limpiando formato del archivo .env.local...\n');

const envPath = path.join(__dirname, '.env.local');
let content = fs.readFileSync(envPath, 'utf8');

// Limpiar el contenido para asegurar formato correcto
const cleanContent = `# Variables de entorno de Supabase para Next.js
# Obtén estos valores desde tu proyecto de Supabase en https://supabase.com/dashboard

# URL de tu proyecto de Supabase (pública)
NEXT_PUBLIC_SUPABASE_URL=https://dkrmwktlresbqdveszzo.supabase.co

# Clave anónima (pública) - se usa en el cliente del navegador
# IMPORTANTE: Reemplaza con tu clave anónima real de Supabase (empieza con 'eyJ')
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_real_aqui

# Clave de rol de servicio (privada) - solo para uso del servidor
SUPABASE_SERVICE_ROLE_KEY=sb_secret_t52OcJ5fWr3LdvXxMtXALg_PtBw1xDA
`;

fs.writeFileSync(envPath, cleanContent);

console.log('✅ Archivo .env.local limpiado');
console.log('\n📋 Para completar la configuración:');
console.log('  1. Ve a https://app.supabase.com');
console.log('  2. Tu proyecto: https://dkrmwktlresbqdveszzo.supabase.co');
console.log('  3. Settings > API > anon public key');
console.log('  4. Copia la key que empieza con "eyJ"');
console.log('  5. Reemplaza "tu_anon_key_real_aqui" con esa key');
console.log('  6. Reinicia el servidor con: npm run dev');
console.log('\n🔄 Después de hacer esto, el formulario debería funcionar.');