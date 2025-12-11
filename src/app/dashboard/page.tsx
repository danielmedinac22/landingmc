import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"

// Esta página requiere autenticación en un entorno real
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <AnalyticsDashboard />
      </div>
    </div>
  )
}