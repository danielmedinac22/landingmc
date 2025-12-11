const fs = require('fs');
const path = require('path');

console.log('🧹 Limpiando archivo .env.local...\n');

const envPath = path.join(__dirname, '.env.local');

// Nuevo contenido simplificado
const cleanContent = `# Variables de entorno de Supabase para Next.js

# URL de tu proyecto de Supabase (pública)
NEXT_PUBLIC_SUPABASE_URL=https://dkrmwktlresbqdveszzo.supabase.co

# Clave anónima (pública) - se usa para todas las operaciones
# IMPORTANTE: Obtén esta key de: https://app.supabase.com -> Settings -> API -> anon public key
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_real_aqui
`;

fs.writeFileSync(envPath, cleanContent);

console.log('✅ Archivo .env.local simplificado');
console.log('\n📋 Para completar la configuración:');
console.log('  1. Ve a https://app.supabase.com');
console.log('  2. Tu proyecto: https://dkrmwktlresbqdveszzo.supabase.co');
console.log('  3. Settings > API');
console.log('  4. Copia la "anon public" key (empieza con "eyJ")');
console.log('  5. Reemplaza "tu_anon_key_real_aqui" con esa key');
console.log('  6. Reinicia el servidor con: npm run dev');

console.log('\nℹ️  Nota: Ahora solo se usa la anon key para todas las operaciones.');
console.log('   Asegúrate de que las políticas RLS en Supabase permitan las operaciones necesarias.');