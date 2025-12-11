import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const accountantId = searchParams.get('accountantId')
    const status = searchParams.get('status') || 'recommended'
    const limit = parseInt(searchParams.get('limit') || '50')

    let query = supabase
      .from('recommendations')
      .select(`
        id,
        match_score,
        status,
        notes,
        created_at,
        clients (
          id,
          name,
          email,
          phone,
          status as client_status,
          client_services (
            services (
              name
            )
          )
        ),
        accountants (
          id,
          name,
          specialty
        )
      `)
      .eq('status', status)
      .order('created_at', { ascending: false })
      .limit(limit)

    // Filtrar por contador si se especifica
    if (accountantId) {
      query = query.eq('accountant_id', accountantId)
    }

    const { data: recommendations, error } = await query

    if (error) {
      console.error('Error fetching recommendations:', error)
      return NextResponse.json(
        { error: 'Error al obtener recomendaciones' },
        { status: 500 }
      )
    }

    // Formatear respuesta
    const formattedRecommendations = recommendations.map(rec => ({
      id: rec.id,
      match_score: rec.match_score,
      status: rec.status,
      notes: rec.notes,
      created_at: rec.created_at,
      client: {
        id: rec.clients.id,
        name: rec.clients.name,
        email: rec.clients.email,
        phone: rec.clients.phone,
        status: rec.clients.client_status,
        services: rec.clients.client_services?.map((cs: any) => cs.services.name) || []
      },
      accountant: {
        id: rec.accountants.id,
        name: rec.accountants.name,
        specialty: rec.accountants.specialty
      }
    }))

    return NextResponse.json({
      recommendations: formattedRecommendations,
      total: formattedRecommendations.length
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}