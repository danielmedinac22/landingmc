const fs = require('fs');
const path = require('path');

console.log('🔧 Arreglando configuración de Supabase...\n');

// Leer el archivo .env.local actual
const envPath = path.join(__dirname, '.env.local');
let envContent = '';

try {
  envContent = fs.readFileSync(envPath, 'utf8');
} catch (error) {
  console.log('❌ No se pudo leer .env.local');
  process.exit(1);
}

// Reemplazar los placeholders
let newContent = envContent
  .replace('tu_anon_key_aqui_eyJ...', 'tu_anon_key_real_aqui')
  .replace('tu_service_role_key_aqui_sb_secret_...', 'sb_secret_t52OcJ5fWr3LdvXxMtXALg_PtBw1xDA');

// Agregar comentario explicativo
const comment = `# ⚠️  IMPORTANTE: Reemplaza 'tu_anon_key_real_aqui' con tu clave anónima real de Supabase
# Obtén la anon key de: https://app.supabase.com -> Settings -> API -> anon/public key
# La anon key debe empezar con 'eyJ'
`;

// Insertar comentario antes de la línea de anon key
newContent = newContent.replace(
  'NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_real_aqui',
  comment + 'NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_real_aqui'
);

// Escribir el archivo actualizado
fs.writeFileSync(envPath, newContent);

console.log('✅ Archivo .env.local actualizado');
console.log('\n📋 Próximos pasos:');
console.log('  1. Ve a https://app.supabase.com');
console.log('  2. Selecciona tu proyecto');
console.log('  3. Ve a Settings > API');
console.log('  4. Copia la "anon public" key');
console.log('  5. Reemplaza "tu_anon_key_real_aqui" en .env.local con esa key');
console.log('  6. Reinicia el servidor: npm run dev');
console.log('\n🔄 Después de actualizar, prueba enviar el formulario nuevamente.');