// Script simple para verificar variables de entorno
const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración de Supabase...\n');

// Leer archivo .env.local si existe
const envPath = path.join(__dirname, '.env.local');
let envContent = '';

try {
  envContent = fs.readFileSync(envPath, 'utf8');
  console.log('📄 Archivo .env.local encontrado');
} catch (error) {
  console.log('❌ Archivo .env.local no encontrado');
}

// Verificar variables de entorno cargadas
const envVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
];

console.log('\n📋 Variables de entorno actuales:');
envVars.forEach(key => {
  const value = process.env[key];
  const status = value ? '✅' : '❌';
  const maskedValue = value ?
    `${value.substring(0, 15)}${value.length > 15 ? '...' : ''}` :
    'No configurado';
  console.log(`  ${key}: ${status} ${maskedValue}`);
});

// Buscar en el contenido del archivo si existe
if (envContent) {
  console.log('\n📝 Contenido del .env.local (primeras líneas):');
  const lines = envContent.split('\n').slice(0, 10);
  lines.forEach((line, i) => {
    if (line.trim() && !line.startsWith('#')) {
      console.log(`  ${i + 1}: ${line}`);
    }
  });
}

console.log('\n💡 Para configurar correctamente:');
console.log('  1. Ve a https://app.supabase.com');
console.log('  2. Tu proyecto: https://dkrmwktlresbqdveszzo.supabase.co');
console.log('  3. Settings > API');
console.log('  4. Copia la URL y las keys al .env.local');