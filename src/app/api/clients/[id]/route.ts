import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'

const updateClientSchema = z.object({
  status: z.enum(['pending', 'contacted', 'qualified', 'converted']).optional(),
  notes: z.string().optional(),
})

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  try {
    const clientId = params.id
    const body = await request.json()

    // Validar datos de entrada
    const validatedData = updateClientSchema.parse(body)

    // Actualizar cliente
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (validatedData.status) {
      updateData.status = validatedData.status
      if (validatedData.status === 'contacted' && !validatedData.notes) {
        updateData.contacted_at = new Date().toISOString()
      }
    }

    if (validatedData.notes) {
      updateData.notes = validatedData.notes
    }

    const { data: updatedClient, error: updateError } = await supabase
      .from('clients')
      .update(updateData)
      .eq('id', clientId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating client:', updateError)
      return NextResponse.json(
        { error: 'Error al actualizar el cliente' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      client: updatedClient
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
    const { id: clientId } = await params

    // Obtener cliente con sus servicios
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select(`
        id,
        name,
        email,
        phone,
        status,
        source,
        notes,
        contacted_at,
        created_at,
        updated_at
      `)
      .eq('id', clientId)
      .single()

    if (clientError) {
      console.error('Error fetching client:', clientError)
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      )
    }

    // Obtener servicios del cliente
    const { data: clientServices, error: servicesError } = await supabase
      .from('client_services')
      .select(`
        services (
          id,
          name,
          category
        )
      `)
      .eq('client_id', clientId)

    if (servicesError) {
      console.error('Error fetching client services:', servicesError)
    }

    // Obtener recomendaciones
    const { data: recommendations, error: recError } = await supabase
      .from('recommendations')
      .select(`
        id,
        match_score,
        status,
        accountants (
          id,
          name,
          specialty,
          experience_years,
          rating
        )
      `)
      .eq('client_id', clientId)

    if (recError) {
      console.error('Error fetching recommendations:', recError)
    }

    return NextResponse.json({
      client: {
        ...client,
        services: clientServices?.map(cs => cs.services) || [],
        recommendations: recommendations || []
      }
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}