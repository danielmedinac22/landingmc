require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

async function testConnection() {
  console.log('🔍 Probando conexión a Supabase...\n');

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log('📋 Configuración:');
  console.log(`URL: ${url ? '✅' : '❌'} ${url || 'No configurada'}`);
  console.log(`Anon Key: ${anonKey ? '✅' : '❌'} ${anonKey ? anonKey.substring(0, 20) + '...' : 'No configurada'}`);

  if (!url || !anonKey) {
    console.log('\n❌ Variables de entorno no configuradas');
    return;
  }

  const supabase = createClient(url, anonKey);

  try {
    console.log('\n🧪 Probando consulta de lectura...');
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('id, name')
      .limit(1);

    if (servicesError) {
      console.log('❌ Error en consulta de lectura:', servicesError.message);
      return;
    }

    console.log('✅ Lectura funciona - Servicios encontrados:', services?.length || 0);

    console.log('\n🧪 Probando consulta de escritura (simulada)...');
    // Probar inserción en una tabla que permita escritura con anon key
    const { data: testInsert, error: insertError } = await supabase
      .from('clients')
      .insert({
        name: 'Test User',
        email: 'test@example.com',
        phone: '+1234567890',
        status: 'test',
        source: 'test'
      })
      .select('id')
      .single();

    if (insertError) {
      console.log('❌ Error en consulta de escritura:', insertError.message);
      console.log('💡 Esto indica que las políticas RLS no permiten escritura con anon key');
      console.log('   Necesitas ajustar las políticas RLS en Supabase o usar service role key');
    } else {
      console.log('✅ Escritura funciona - Cliente de prueba creado con ID:', testInsert?.id);

      // Limpiar el registro de prueba
      await supabase.from('clients').delete().eq('email', 'test@example.com');
      console.log('🧹 Registro de prueba eliminado');
    }

  } catch (error) {
    console.log('❌ Error inesperado:', error.message);
  }
}

testConnection();