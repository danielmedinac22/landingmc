import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'

const updateRecommendationSchema = z.object({
  status: z.enum(['recommended', 'accepted', 'declined']),
  notes: z.string().optional(),
})

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: recommendationId } = await params
    const body = await request.json()

    const validatedData = updateRecommendationSchema.parse(body)

    const { data: updatedRecommendation, error } = await supabase
      .from('recommendations')
      .update({
        status: validatedData.status,
        notes: validatedData.notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', recommendationId)
      .select(`
        id,
        status,
        notes,
        client_id,
        accountant_id,
        clients (
          name,
          email
        ),
        accountants (
          name,
          specialty
        )
      `)
      .single()

    if (error) {
      console.error('Error updating recommendation:', error)
      return NextResponse.json(
        { error: 'Error al actualizar recomendación' },
        { status: 500 }
      )
    }

    // Si se acepta la recomendación, actualizar el estado del cliente
    if (validatedData.status === 'accepted') {
      const { error: clientError } = await supabase
        .from('clients')
        .update({
          status: 'contacted',
          contacted_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedRecommendation.client_id)

      if (clientError) {
        console.error('Error updating client status:', clientError)
      }
    }

    return NextResponse.json({
      success: true,
      recommendation: updatedRecommendation
    })

  } catch (error) {
    console.error('API Error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: recommendationId } = await params

    const { data: recommendation, error } = await supabase
      .from('recommendations')
      .select(`
        id,
        match_score,
        status,
        notes,
        created_at,
        updated_at,
        clients (
          id,
          name,
          email,
          phone,
          status
        ),
        accountants (
          id,
          name,
          specialty,
          experience_years,
          rating
        )
      `)
      .eq('id', recommendationId)
      .single()

    if (error) {
      console.error('Error fetching recommendation:', error)
      return NextResponse.json(
        { error: 'Recomendación no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      recommendation
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}