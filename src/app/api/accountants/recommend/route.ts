import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('clientId')

    if (!clientId) {
      return NextResponse.json(
        { error: 'Se requiere el ID del cliente' },
        { status: 400 }
      )
    }

    // Obtener recomendaciones para este cliente
    const { data: recommendations, error } = await supabase
      .from('recommendations')
      .select(`
        id,
        match_score,
        status,
        accountants (
          id,
          name,
          email,
          phone,
          specialty,
          experience_years,
          rating,
          bio
        )
      `)
      .eq('client_id', clientId)
      .eq('status', 'recommended')
      .order('match_score', { ascending: false })
      .limit(3)

    if (error) {
      console.error('Error fetching recommendations:', error)
      return NextResponse.json(
        { error: 'Error al obtener recomendaciones' },
        { status: 500 }
      )
    }

    // Si no hay recomendaciones, obtener contadores generales ordenados por rating
    if (!recommendations || recommendations.length === 0) {
      const { data: fallbackAccountants, error: fallbackError } = await supabase
        .from('accountants')
        .select('id, name, specialty, experience_years, rating, bio')
        .eq('is_active', true)
        .order('rating', { ascending: false })
        .limit(3)

      if (fallbackError) {
        console.error('Error fetching fallback accountants:', fallbackError)
        return NextResponse.json(
          { error: 'Error al obtener contadores' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        recommendations: fallbackAccountants.map(accountant => ({
          ...accountant,
          match_score: null,
          is_fallback: true
        }))
      })
    }

    // Formatear respuesta
    const formattedRecommendations = recommendations.map(rec => ({
      id: rec.accountants.id,
      name: rec.accountants.name,
      specialty: rec.accountants.specialty,
      experience_years: rec.accountants.experience_years,
      rating: rec.accountants.rating,
      bio: rec.accountants.bio,
      match_score: rec.match_score,
      is_fallback: false
    }))

    return NextResponse.json({
      recommendations: formattedRecommendations
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}