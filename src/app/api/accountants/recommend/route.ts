import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Tipos para las consultas de Supabase
interface Accountant {
  id: string
  name: string
  email: string
  phone: string
  specialty: string
  experience_years: number
  rating: number
  bio: string
}

interface Recommendation {
  id: string
  match_score: number
  status: string
  accountant_id: string
  accountants: Accountant[] | Accountant
}

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

    // Obtener recomendaciones para este cliente con join a accountants
    const { data: recommendations, error } = await supabase
      .from('recommendations')
      .select(`
        id,
        match_score,
        status,
        accountant_id,
        accountants!inner (
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
    const formattedRecommendations = (recommendations as Recommendation[])
      .filter(rec => {
        // Filtrar recomendaciones que tengan accountants válidos
        const accountant = Array.isArray(rec.accountants) ? rec.accountants[0] : rec.accountants
        return accountant && accountant.id
      })
      .map(rec => {
        // Supabase puede retornar objeto o array dependiendo de la relación
        const accountant = Array.isArray(rec.accountants) ? rec.accountants[0] : rec.accountants
        return {
          id: accountant.id,
          name: accountant.name,
          specialty: accountant.specialty,
          experience_years: accountant.experience_years,
          rating: accountant.rating,
          bio: accountant.bio,
          match_score: rec.match_score,
          is_fallback: false
        }
      })

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