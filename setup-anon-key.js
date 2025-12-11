const fs = require('fs');
const path = require('path');

console.log('🔧 Configuración de clave anónima de Supabase\n');

// Verificar el estado actual
const envPath = path.join(__dirname, '.env.local');
let envContent = fs.readFileSync(envPath, 'utf8');

console.log('📄 Archivo .env.local actual:');
console.log(envContent);

// Verificar si ya tiene una clave válida
const anonKeyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/);
const currentKey = anonKeyMatch ? anonKeyMatch[1].trim() : '';

console.log('\n🔍 Estado de la clave anónima:');
console.log(`Actual: ${currentKey}`);
console.log(`Es válida: ${currentKey.startsWith('eyJ') && currentKey.length > 100 ? '✅' : '❌'}`);

if (currentKey.startsWith('eyJ') && currentKey.length > 100) {
    console.log('\n✅ La clave anónima ya está configurada correctamente.');
    console.log('Si el formulario aún no funciona, revisa las políticas RLS en Supabase.');
} else {
    console.log('\n❌ La clave anónima no está configurada.');
    console.log('\n📋 PASOS PARA OBTENER LA CLAVE ANÓNIMA:');
    console.log('  1. Ve a: https://app.supabase.com');
    console.log('  2. Selecciona tu proyecto: https://dkrmwktlresbqdveszzo.supabase.co');
    console.log('  3. Ve a: Settings > API');
    console.log('  4. Copia la "anon public" key (empieza con "eyJ")');
    console.log('  5. Ejecuta este comando reemplazando TU_CLAVE_AQUI:');
    console.log(`     sed -i 's|tu_anon_key_real_aqui|TU_CLAVE_AQUI|' .env.local`);
    console.log('  6. Reinicia el servidor: npm run dev');

    console.log('\n🔄 O puedes ejecutar:');
    console.log('     node setup-anon-key.js TU_CLAVE_AQUI');
    console.log('     npm run dev');
}

// Si se proporciona una clave como argumento, actualizarla
if (process.argv[2]) {
    const newKey = process.argv[2];
    if (newKey.startsWith('eyJ') && newKey.length > 100) {
        const updatedContent = envContent.replace(/tu_anon_key_real_aqui/, newKey);
        fs.writeFileSync(envPath, updatedContent);
        console.log('\n✅ Clave anónima actualizada correctamente!');
        console.log('Reinicia el servidor con: npm run dev');
    } else {
        console.log('\n❌ La clave proporcionada no parece ser válida.');
        console.log('Debe empezar con "eyJ" y tener más de 100 caracteres.');
    }
}