import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { clientFormSchema } from '@/lib/validation'
import { z } from 'zod'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar datos de entrada
    const validatedData = clientFormSchema.parse(body)

    // Iniciar transacción para insertar cliente y servicios
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .insert({
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        status: 'pending',
        source: 'website'
      })
      .select('id')
      .single()

    if (clientError) {
      console.error('Error inserting client:', clientError)
      return NextResponse.json(
        { error: 'Error al guardar la información del cliente' },
        { status: 500 }
      )
    }

    // Obtener IDs de los servicios seleccionados
    const { data: servicesData, error: servicesError } = await supabase
      .from('services')
      .select('id, name')
      .in('name', validatedData.needs)

    if (servicesError) {
      console.error('Error fetching services:', servicesError)
      return NextResponse.json(
        { error: 'Error al procesar los servicios seleccionados' },
        { status: 500 }
      )
    }

    // Insertar relaciones cliente-servicio
    const clientServicesData = servicesData.map(service => ({
      client_id: clientData.id,
      service_id: service.id
    }))

    const { error: clientServicesError } = await supabase
      .from('client_services')
      .insert(clientServicesData)

    if (clientServicesError) {
      console.error('Error inserting client services:', clientServicesError)
      return NextResponse.json(
        { error: 'Error al guardar los servicios del cliente' },
        { status: 500 }
      )
    }

    // Generar recomendaciones automáticas
    await generateRecommendations(clientData.id)

    return NextResponse.json({
      success: true,
      message: 'Consulta enviada exitosamente',
      clientId: clientData.id
    })

  } catch (error) {
    console.error('API Error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Función para generar recomendaciones automáticas
async function generateRecommendations(clientId: string) {
  try {
    // Obtener servicios del cliente
    const { data: clientServices, error: clientServicesError } = await supabase
      .from('client_services')
      .select('service_id')
      .eq('client_id', clientId)

    if (clientServicesError || !clientServices) {
      console.error('Error fetching client services for recommendations:', clientServicesError)
      return
    }

    const serviceIds = clientServices.map(cs => cs.service_id)

    // Encontrar contadores que ofrecen estos servicios
    const { data: accountantServices, error: accountantsError } = await supabase
      .from('accountant_services')
      .select(`
        accountant_id,
        service_id,
        accountants!inner (
          id,
          name,
          specialty,
          experience_years,
          rating,
          is_active
        )
      `)
      .in('service_id', serviceIds)
      .eq('accountants.is_active', true)

    if (accountantsError || !accountantServices) {
      console.error('Error fetching accountants for recommendations:', accountantsError)
      return
    }

    // Agrupar y contar coincidencias por contador
    const accountantMatches = accountantServices.reduce((acc, curr) => {
      const accountantId = curr.accountant_id
      if (!acc[accountantId]) {
        acc[accountantId] = {
          accountant: curr.accountants,
          matchCount: 0
        }
      }
      acc[accountantId].matchCount += 1
      return acc
    }, {} as Record<string, any>)

    // Calcular score y ordenar
    const recommendations = Object.values(accountantMatches)
      .map((match: any) => ({
        client_id: clientId,
        accountant_id: match.accountant.id,
        match_score: (match.matchCount / serviceIds.length) * 100,
        status: 'recommended'
      }))
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, 3) // Top 3 recomendaciones

    // Insertar recomendaciones
    if (recommendations.length > 0) {
      const { error: recommendationsError } = await supabase
        .from('recommendations')
        .insert(recommendations)

      if (recommendationsError) {
        console.error('Error inserting recommendations:', recommendationsError)
      }
    }

  } catch (error) {
    console.error('Error generating recommendations:', error)
  }
}