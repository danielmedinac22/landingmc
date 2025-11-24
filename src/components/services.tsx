"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Calculator,
  TrendingUp,
  Users,
  CheckCircle2,
  ArrowRight,
  Search
} from "lucide-react"

interface ServicesProps {
  onOpenForm?: () => void
}

const services = [
  {
    id: "contabilidad",
    label: "Contabilidad",
    icon: FileText,
    title: "Contabilidad General",
    description: "Encuentra contadores que mantendrán tus libros al día y sin errores.",
    features: [
      "Registro de operaciones",
      "Conciliación bancaria",
      "Estados financieros",
      "Cumplimiento fiscal",
    ],
    badge: "Más Buscado",
    gradient: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-500"
  },
  {
    id: "fiscal",
    label: "Fiscal",
    icon: Calculator,
    title: "Estrategia Fiscal",
    description: "Conecta con expertos fiscales para optimizar tus impuestos legalmente.",
    features: [
      "Declaraciones anuales",
      "Planeación estratégica",
      "Atención a la DIAN",
      "Devoluciones de saldo",
    ],
    gradient: "from-yellow-500/20 to-amber-500/20",
    iconColor: "text-yellow-500"
  },
  {
    id: "financiera",
    label: "Financiera",
    icon: TrendingUp,
    title: "Asesoría Financiera",
    description: "Especialistas que te ayudarán a proyectar el crecimiento de tu negocio.",
    features: [
      "Análisis de flujo",
      "Proyecciones a futuro",
      "Rentabilidad",
      "Inversiones inteligentes",
    ],
    gradient: "from-orange-500/20 to-red-500/20",
    iconColor: "text-orange-500"
  },
  {
    id: "nómina",
    label: "Nómina",
    icon: Users,
    title: "Gestión de Nómina",
    description: "Profesionales para gestionar los pagos de tu equipo a tiempo.",
    features: [
      "Cálculo de nómina",
      "Afiliaciones seguridad social",
      "Prima de servicios",
      "Contratos laborales",
    ],
    gradient: "from-amber-400/20 to-yellow-600/20",
    iconColor: "text-amber-400"
  },
]

export function Services({ onOpenForm }: ServicesProps) {
  return (
    <section id="servicios" className="py-20 lg:py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-1 text-sm border-primary/30 bg-primary/5 text-primary backdrop-blur-sm">
            Marketplace de Talentos
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
            ¿Qué tipo de contador <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-600">
              necesitas hoy?
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Desde llevar la contabilidad diaria hasta estrategias fiscales complejas.
            Conecta con contadores certificados en Medellín y toda Colombia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-7xl mx-auto">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <Card
                key={service.id}
                className="group relative border-border/50 bg-background/40 backdrop-blur-md overflow-hidden hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
              >
                {/* Hover Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <CardHeader className="relative z-10 pb-3 pt-5 px-5">
                  <div className="flex justify-between items-start mb-3">
                    <div className={`p-2.5 rounded-xl bg-background/80 backdrop-blur-sm border border-border/50 shadow-sm ${service.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="size-6" />
                    </div>
                    {service.badge && (
                      <Badge className="bg-primary/90 text-[10px] px-2 py-0.5 h-5 text-primary-foreground shadow-lg shadow-primary/20">
                        {service.badge}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors duration-300">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-sm mt-2 leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="relative z-10 px-5 pb-5">
                  <div className="grid gap-2.5 mb-5">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2.5 text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                        <CheckCircle2 className={`size-3.5 ${service.iconColor} opacity-70`} />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div
                    onClick={onOpenForm}
                    className="pt-3 border-t border-border/30 flex items-center justify-between text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors duration-300 cursor-pointer hover:bg-primary/5 rounded-md px-2 py-1 -mx-2 -mb-1"
                  >
                    <span className="flex items-center gap-1.5">
                      <Search className="size-3.5" />
                      Buscar expertos
                    </span>
                    <ArrowRight className="size-3.5 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

