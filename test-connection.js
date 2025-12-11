// Test rápido de conexión con Supabase
const { createClient } = require('@supabase/supabase-js')

// Leer variables de entorno
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno no configuradas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('🔍 Probando conexión con Supabase...')
  console.log('URL:', supabaseUrl)
  console.log('Key starts with:', supabaseKey.substring(0, 10) + '...')

  try {
    // Test básico de conexión
    const { data, error } = await supabase.from('services').select('count').limit(1)

    if (error) {
      console.error('❌ Error de conexión:', error.message)
      return false
    }

    console.log('✅ ¡Conexión exitosa!')

    // Contar registros
    const { count, error: countError } = await supabase
      .from('services')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      console.error('❌ Error al contar servicios:', countError.message)
    } else {
      console.log(`📊 Servicios encontrados: ${count}`)
    }

    return true

  } catch (error) {
    console.error('❌ Error:', error.message)
    return false
  }
}

testConnection().then(success => {
  if (success) {
    console.log('\n🎉 ¡Todo está configurado correctamente!')
    console.log('Ahora puedes ejecutar: npm run dev')
  } else {
    console.log('\n❌ Hay problemas con la configuración. Revisa el setup de Supabase.')
  }
  process.exit(success ? 0 : 1)
})