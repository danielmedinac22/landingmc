// Script de prueba para verificar la conexión con Supabase
// Ejecutar con: node test-supabase.js

const { createClient } = require('@supabase/supabase-js')

// Configuración temporal (reemplaza con tus variables de entorno)
const supabaseUrl = 'https://dkrmwktlresbqdveszzo.supabase.co'
const supabaseKey = 'sb_secret_t52OcJ5fWr3LdvXxMtXALg_PtBw1xDA' // Usa anon key en producción

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('🔍 Probando conexión con Supabase...')
  console.log('URL:', supabaseUrl)
  console.log('Key length:', supabaseKey.length)

  try {
    // Probar conexión básica
    const { data, error } = await supabase.from('services').select('count').limit(1)

    if (error) {
      console.error('❌ Error de conexión:', error.message)
      return false
    }

    console.log('✅ Conexión exitosa!')

    // Verificar tablas
    console.log('\n📊 Verificando tablas...')

    const tables = ['services', 'accountants', 'clients', 'client_services', 'accountant_services', 'recommendations']

    for (const table of tables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true })

        if (error) {
          console.log(`❌ Tabla ${table}: Error - ${error.message}`)
        } else {
          console.log(`✅ Tabla ${table}: ${count || 0} registros`)
        }
      } catch (err) {
        console.log(`❌ Tabla ${table}: No encontrada`)
      }
    }

    // Probar inserción (solo si hay tablas)
    console.log('\n🧪 Probando inserción de prueba...')

    const testClient = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '3000000000',
      status: 'pending',
      source: 'website'
    }

    const { data: insertedData, error: insertError } = await supabase
      .from('clients')
      .insert(testClient)
      .select()
      .single()

    if (insertError) {
      console.log('❌ Error al insertar:', insertError.message)
    } else {
      console.log('✅ Inserción exitosa:', insertedData.id)

      // Limpiar dato de prueba
      await supabase.from('clients').delete().eq('id', insertedData.id)
      console.log('🧹 Dato de prueba eliminado')
    }

    return true

  } catch (error) {
    console.error('❌ Error general:', error.message)
    return false
  }
}

testConnection().then(() => {
  console.log('\n🏁 Prueba completada')
})