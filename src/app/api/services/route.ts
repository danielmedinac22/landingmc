import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') // 'main', 'related', or null for all

    let query = supabase
      .from('services')
      .select('id, name, category, description')
      .order('name')

    // Filtrar por categoría si se especifica
    if (category) {
      query = query.eq('category', category)
    }

    const { data: services, error } = await query

    if (error) {
      console.error('Error fetching services:', error)
      return NextResponse.json(
        { error: 'Error al obtener servicios' },
        { status: 500 }
      )
    }

    // Organizar servicios por categoría
    const organizedServices = {
      main: services.filter(service => service.category === 'main'),
      related: services.filter(service => service.category === 'related'),
      all: services
    }

    return NextResponse.json({
      services: organizedServices
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}