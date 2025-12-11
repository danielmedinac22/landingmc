import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'

const accountantSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  specialty: z.string().min(2).max(100),
  experience_years: z.number().min(0).max(50).optional(),
  rating: z.number().min(0).max(5).optional(),
  bio: z.string().max(500).optional(),
  is_active: z.boolean().optional(),
  service_ids: z.array(z.string()).optional(), // IDs de servicios que ofrece
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('active') === 'true'

    let query = supabase
      .from('accountants')
      .select(`
        id,
        name,
        email,
        phone,
        specialty,
        experience_years,
        rating,
        bio,
        is_active,
        created_at,
        updated_at,
        accountant_services (
          services (
            id,
            name,
            category
          )
        )
      `)
      .order('name')

    if (activeOnly) {
      query = query.eq('is_active', true)
    }

    const { data: accountants, error } = await query

    if (error) {
      console.error('Error fetching accountants:', error)
      return NextResponse.json(
        { error: 'Error al obtener contadores' },
        { status: 500 }
      )
    }

    // Formatear respuesta
    const formattedAccountants = accountants.map(accountant => ({
      ...accountant,
      services: accountant.accountant_services?.map((as: any) => as.services) || []
    }))

    return NextResponse.json({
      accountants: formattedAccountants
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = accountantSchema.parse(body)

    // Iniciar transacción
    const { data: accountant, error: accountantError } = await supabase
      .from('accountants')
      .insert({
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        specialty: validatedData.specialty,
        experience_years: validatedData.experience_years || 0,
        rating: validatedData.rating || 0,
        bio: validatedData.bio,
        is_active: validatedData.is_active !== false, // default true
      })
      .select('id')
      .single()

    if (accountantError) {
      console.error('Error inserting accountant:', accountantError)
      return NextResponse.json(
        { error: 'Error al crear contador' },
        { status: 500 }
      )
    }

    // Asignar servicios si se proporcionaron
    if (validatedData.service_ids && validatedData.service_ids.length > 0) {
      const accountantServices = validatedData.service_ids.map(serviceId => ({
        accountant_id: accountant.id,
        service_id: serviceId
      }))

      const { error: servicesError } = await supabase
        .from('accountant_services')
        .insert(accountantServices)

      if (servicesError) {
        console.error('Error inserting accountant services:', servicesError)
        // No fallar la creación del contador por esto
      }
    }

    return NextResponse.json({
      success: true,
      accountant: { id: accountant.id, ...validatedData }
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