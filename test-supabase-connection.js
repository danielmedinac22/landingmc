require('dotenv').config({ path: '.env.local' });

console.log('🔍 Verificando configuración de Supabase...\n');

// Verificar variables de entorno
const envVars = {
  'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
  'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  'SUPABASE_SERVICE_ROLE_KEY': process.env.SUPABASE_SERVICE_ROLE_KEY
};

console.log('📋 Variables de entorno:');
Object.entries(envVars).forEach(([key, value]) => {
  const status = value ? '✅' : '❌';
  const maskedValue = value ? `${value.substring(0, 10)}...` : 'No configurado';
  console.log(`  ${key}: ${status} ${maskedValue}`);
});

console.log('\n💡 Recuerda:');
console.log('  - La ANON KEY debe empezar con "eyJ"');
console.log('  - La SERVICE ROLE KEY debe empezar con "sb_secret"');
console.log('  - Si las variables están vacías, configura tu archivo .env.local');