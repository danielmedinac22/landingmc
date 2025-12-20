import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'

const updateClientSchema = z.object({
  status: z.enum(['pending', 'contacted', 'qualified', 'converted']).optional(),
  notes: z.string().optional(),
  city: z.string().max(100).optional(),
  software: z.array(z.string()).optional(),
})

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: clientId } = await params
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

    if (validatedData.city) {
      updateData.city = validatedData.city
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

    // Insertar relaciones de software si se proporcionan
    if (validatedData.software && validatedData.software.length > 0) {
      // Obtener IDs de los software por nombre
      const { data: softwareData, error: softwareError } = await supabase
        .from('software')
        .select('id, name')
        .in('name', validatedData.software)

      if (softwareError) {
        console.error('Error fetching software:', softwareError)
        return NextResponse.json(
          { error: 'Error al procesar el software seleccionado' },
          { status: 500 }
        )
      }

      if (softwareData && softwareData.length > 0) {
        // Preparar datos para insertar
        const clientSoftwareData = softwareData.map(sw => ({
          client_id: clientId,
          software_id: sw.id
        }))

        // Insertar relaciones (ignorar duplicados)
        const { error: insertError } = await supabase
          .from('client_software')
          .upsert(clientSoftwareData, {
            onConflict: 'client_id,software_id',
            ignoreDuplicates: true
          })

        if (insertError) {
          console.error('Error inserting client software:', insertError)
          return NextResponse.json(
            { error: 'Error al guardar el software del cliente' },
            { status: 500 }
          )
        }
      }
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

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
        services: clientServices?.map(cs => {
          const service = cs.services
          return Array.isArray(service) ? service[0] : service
        }).filter(Boolean) || [],
        recommendations: recommendations?.map(rec => ({
          ...rec,
          accountants: Array.isArray(rec.accountants) ? rec.accountants[0] : rec.accountants
        })) || []
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