"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Search, UserCheck, MessageSquare, CheckCircle2 } from "lucide-react"

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
    <section id="como-funciona" className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Cómo funciona
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Un proceso simple y rápido para encontrar a tu contador ideal
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="relative">
                <Card className="h-full border-border/50 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-8 flex flex-col items-center text-center">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl" />
                      <div className="relative bg-primary/5 rounded-full p-4">
                        <Icon className="size-8 text-primary" />
                      </div>
                    </div>
                    <div className="text-5xl font-bold text-muted-foreground/20 mb-2">
                      {step.number}
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-border z-0">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full" />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-16 flex justify-center">
          <Card className="max-w-2xl w-full border-primary/20 bg-primary/5">
            <CardContent className="p-6 flex items-center gap-4">
              <CheckCircle2 className="size-6 text-primary shrink-0" />
              <div>
                <p className="font-semibold text-foreground mb-1">
                  Proceso 100% verificado
                </p>
                <p className="text-sm text-muted-foreground">
                  Todos nuestros contadores pasan por un riguroso proceso de verificación para garantizar la calidad del servicio.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

