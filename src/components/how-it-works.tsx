"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, UserCheck, MessageSquare, CheckCircle2, ArrowRight } from "lucide-react"

const steps = [
  {
    number: "01",
    title: "Completa tu perfil",
    description: "Cuéntanos sobre tu negocio y necesidades contables en minutos.",
    icon: Search,
  },
  {
    number: "02",
    title: "Recibe propuestas",
    description: "Te conectamos con contadores verificados que se adaptan a tu perfil.",
    icon: UserCheck,
  },
  {
    number: "03",
    title: "Elige y comienza",
    description: "Selecciona al profesional ideal y comienza a trabajar de inmediato.",
    icon: MessageSquare,
  },
]

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-20 lg:py-24 bg-background relative overflow-hidden">
      {/* Subtle Background Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none opacity-40">
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <Badge variant="outline" className="mb-4 px-4 py-1 text-sm border-primary/30 bg-primary/5 text-primary backdrop-blur-sm">
              Proceso Simplificado
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
              Tu contador ideal <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-600">
                a tres pasos de distancia
              </span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Hemos optimizado cada etapa para que encuentres confianza y seguridad sin perder tiempo.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground bg-muted/30 px-4 py-2 rounded-full border border-border/50">
            <CheckCircle2 className="size-4 text-primary" />
            <span>Proceso 100% Verificado</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-border to-transparent z-0" />

          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="relative z-10 group">
                <Card className="h-full border-border/40 bg-background/60 backdrop-blur-sm hover:border-primary/30 transition-all duration-500 hover:shadow-lg hover:shadow-primary/5">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative bg-background border border-border/50 rounded-xl p-3 shadow-sm group-hover:scale-105 transition-transform duration-300">
                          <Icon className="size-6 text-primary" />
                        </div>
                      </div>
                      <span className="text-4xl font-bold text-muted-foreground/10 group-hover:text-primary/10 transition-colors duration-300">
                        {step.number}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {step.description}
                    </p>

                    <div className="flex items-center text-xs font-medium text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      <span>Siguiente paso</span>
                      <ArrowRight className="size-3 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>

        {/* Mobile Verification Badge */}
        <div className="mt-8 md:hidden flex justify-center">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground bg-muted/30 px-4 py-2 rounded-full border border-border/50">
            <CheckCircle2 className="size-4 text-primary" />
            <span>Proceso 100% Verificado</span>
          </div>
        </div>
      </div>
    </section>
  )
}

