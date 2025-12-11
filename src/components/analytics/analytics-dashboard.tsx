"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Users, Target, BarChart3 } from "lucide-react"

interface AnalyticsData {
  period: string
  total_clients: number
  conversion_rate: number
  status_breakdown: Record<string, number>
  top_services: Array<{ name: string; count: number }>
  generated_at: string
}

interface AnalyticsDashboardProps {
  initialData?: AnalyticsData
}

export function AnalyticsDashboard({ initialData }: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = React.useState<AnalyticsData | null>(initialData || null)
  const [loading, setLoading] = React.useState(!initialData)
  const [period, setPeriod] = React.useState('30d')

  React.useEffect(() => {
    if (!initialData) {
      fetchAnalytics(period)
    }
  }, [period, initialData])

  const fetchAnalytics = async (selectedPeriod: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/analytics?period=${selectedPeriod}`)
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data.analytics)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground">No se pudieron cargar las métricas</p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Selector de período */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dashboard de Analytics</h2>
        <Tabs value={period} onValueChange={setPeriod}>
          <TabsList>
            <TabsTrigger value="7d">7 días</TabsTrigger>
            <TabsTrigger value="30d">30 días</TabsTrigger>
            <TabsTrigger value="90d">90 días</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Consultas</p>
              <p className="text-2xl font-bold">{analytics.total_clients}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tasa de Conversión</p>
              <p className="text-2xl font-bold">{analytics.conversion_rate}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Servicios Populares</p>
              <p className="text-2xl font-bold">{analytics.top_services.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Estado de consultas */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          Estado de Consultas
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(analytics.status_breakdown).map(([status, count]) => (
            <div key={status} className="text-center">
              <Badge variant={getStatusVariant(status)} className="mb-2">
                {status}
              </Badge>
              <p className="text-2xl font-bold">{count}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Servicios más solicitados */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Servicios Más Solicitados</h3>
        <div className="space-y-3">
          {analytics.top_services.slice(0, 10).map((service, index) => (
            <div key={service.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-muted-foreground w-6">
                  #{index + 1}
                </span>
                <span className="text-sm">{service.name}</span>
              </div>
              <Badge variant="secondary">{service.count}</Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Información de actualización */}
      <div className="text-xs text-muted-foreground text-center">
        Última actualización: {new Date(analytics.generated_at).toLocaleString('es-ES')}
      </div>
    </div>
  )
}

function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case 'pending':
      return 'secondary'
    case 'contacted':
      return 'default'
    case 'qualified':
      return 'outline'
    case 'converted':
      return 'default'
    default:
      return 'secondary'
  }
}