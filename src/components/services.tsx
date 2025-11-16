"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, 
  Calculator, 
  TrendingUp, 
  Shield,
  Clock,
  Users
} from "lucide-react"

const services = [
  {
    id: "contabilidad",
    label: "Contabilidad",
    icon: FileText,
    title: "Gestión contable completa",
    description: "Mantén tus libros al día con profesionales certificados",
    features: [
      "Registro de operaciones diarias",
      "Conciliación bancaria",
      "Elaboración de estados financieros",
      "Cumplimiento fiscal",
    ],
    badge: "Más popular",
  },
  {
    id: "fiscal",
    label: "Fiscal",
    icon: Calculator,
    title: "Asesoría fiscal especializada",
    description: "Optimiza tu carga fiscal con expertos en legislación mexicana",
    features: [
      "Declaraciones mensuales y anuales",
      "Planeación fiscal estratégica",
      "Resolución de requerimientos SAT",
      "Optimización de impuestos",
    ],
  },
  {
    id: "financiera",
    label: "Financiera",
    icon: TrendingUp,
    title: "Análisis y planeación financiera",
    description: "Toma decisiones informadas con análisis financieros profundos",
    features: [
      "Análisis de flujo de efectivo",
      "Proyecciones financieras",
      "Análisis de rentabilidad",
      "Estrategias de crecimiento",
    ],
  },
  {
    id: "nómina",
    label: "Nómina",
    icon: Users,
    title: "Administración de nómina",
    description: "Gestiona la nómina de tu equipo de forma eficiente y legal",
    features: [
      "Cálculo de nómina",
      "IMSS e INFONAVIT",
      "Aguinaldos y PTU",
      "Cumplimiento laboral",
    ],
  },
]

export function Services() {
  return (
    <section id="servicios" className="py-24 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Servicios especializados
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Encuentra el experto perfecto para cada necesidad de tu negocio
          </p>
        </div>

        <Tabs defaultValue="contabilidad" className="max-w-5xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <TabsTrigger
                  key={service.id}
                  value={service.id}
                  className="flex flex-col gap-2 h-auto py-3 data-[state=active]:bg-background"
                >
                  <Icon className="size-5" />
                  <span className="text-xs">{service.label}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          {services.map((service) => {
            const Icon = service.icon
            return (
              <TabsContent key={service.id} value={service.id}>
                <Card className="border-border/50 shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 rounded-lg p-2">
                          <Icon className="size-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl mb-1">
                            {service.title}
                          </CardTitle>
                          <CardDescription className="text-base">
                            {service.description}
                          </CardDescription>
                        </div>
                      </div>
                      {service.badge && (
                        <Badge variant="default" className="shrink-0">
                          {service.badge}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {service.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <Shield className="size-5 text-primary shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-6 border-t border-border/50 flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="size-4" />
                      <span>Respuesta promedio: menos de 24 horas</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )
          })}
        </Tabs>
      </div>
    </section>
  )
}

