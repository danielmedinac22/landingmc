import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30d' // '7d', '30d', '90d'

    // Calcular fecha de inicio basada en el período
    const now = new Date()
    let startDate: Date

    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }

    // Total de consultas en el período
    const { data: totalClients, error: totalError } = await supabase
      .from('clients')
      .select('id', { count: 'exact' })
      .gte('created_at', startDate.toISOString())

    if (totalError) {
      console.error('Error fetching total clients:', totalError)
    }

    // Consultas por estado
    const { data: statusStats, error: statusError } = await supabase
      .from('clients')
      .select('status')
      .gte('created_at', startDate.toISOString())

    if (statusError) {
      console.error('Error fetching status stats:', statusError)
    }

    // Servicios más solicitados
    const { data: popularServices, error: servicesError } = await supabase
      .from('client_services')
      .select(`
        services (
          name
        ),
        clients!inner (
          created_at
        )
      `)
      .gte('clients.created_at', startDate.toISOString())

    if (servicesError) {
      console.error('Error fetching popular services:', servicesError)
    }

    // Tasa de conversión (contacted + qualified + converted)
    const statusCounts = statusStats?.reduce((acc, client) => {
      acc[client.status] = (acc[client.status] || 0) + 1
      return acc
    }, {} as Record<string, number>) || {}

    const totalWithStatus = Object.values(statusCounts).reduce((sum, count) => sum + count, 0)
    const convertedCount = (statusCounts.contacted || 0) + (statusCounts.qualified || 0) + (statusCounts.converted || 0)
    const conversionRate = totalWithStatus > 0 ? (convertedCount / totalWithStatus) * 100 : 0

    // Servicios populares
    const serviceCounts = popularServices?.reduce((acc, item) => {
      const serviceName = item.services?.name
      if (serviceName) {
        acc[serviceName] = (acc[serviceName] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>) || {}

    const topServices = Object.entries(serviceCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }))

    // Estadísticas generales
    const analytics = {
      period,
      total_clients: totalClients?.length || 0,
      conversion_rate: Math.round(conversionRate * 100) / 100,
      status_breakdown: statusCounts,
      top_services: topServices,
      generated_at: new Date().toISOString()
    }

    return NextResponse.json({
      analytics
    })

  } catch (error) {
    console.error('Analytics API Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}