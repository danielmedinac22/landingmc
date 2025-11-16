"use client"

import React, { useEffect } from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2 } from "lucide-react"

const testimonials = [
  {
    name: "María González",
    role: "Fundadora, TechStart MX",
    avatar: "MG",
    quote: "Encontré a mi contador perfecto en menos de 24 horas. El proceso fue increíblemente simple y el profesional que me asignaron entendió perfectamente las necesidades de mi startup.",
    verified: true,
  },
  {
    name: "Carlos Ramírez",
    role: "CEO, Comercio Digital",
    avatar: "CR",
    quote: "Como emprendedor, necesitaba alguien que entendiera el e-commerce. Muy Contador me conectó con un experto que transformó completamente mi gestión fiscal.",
    verified: true,
  },
  {
    name: "Ana Martínez",
    role: "Directora, Consultoría AM",
    avatar: "AM",
    quote: "La plataforma es intuitiva y los contadores están muy bien seleccionados. Ahorré semanas buscando y encontré exactamente lo que necesitaba.",
    verified: true,
  },
  {
    name: "Roberto Sánchez",
    role: "Fundador, Restaurante La Terraza",
    avatar: "RS",
    quote: "Después de años luchando con la contabilidad, finalmente tengo un profesional de confianza. El servicio es excepcional y los resultados hablan por sí solos.",
    verified: true,
  },
  {
    name: "Laura Fernández",
    role: "Propietaria, Boutique Elegance",
    avatar: "LF",
    quote: "La rapidez y calidad del servicio superó todas mis expectativas. Mi negocio ahora tiene una base contable sólida gracias a Muy Contador.",
    verified: true,
  },
]

export function Testimonials() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)

  useEffect(() => {
    if (!api) return

    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  // Auto-scroll
  useEffect(() => {
    if (!api) return

    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext()
      } else {
        api.scrollTo(0)
      }
    }, 5000) // Auto-scroll every 5 seconds

    return () => clearInterval(interval)
  }, [api])

  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Miles de empresas confían en nosotros para encontrar a su contador ideal
          </p>
        </div>

        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <Card className="h-full border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6 flex flex-col gap-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="size-12">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${testimonial.name}`} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {testimonial.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">
                            {testimonial.name}
                          </h3>
                          {testimonial.verified && (
                            <Badge variant="outline" className="gap-1 text-xs">
                              <CheckCircle2 className="size-3 text-primary" />
                              Verificado
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed flex-1">
                      "{testimonial.quote}"
                    </p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`h-2 rounded-full transition-all ${
                index === current
                  ? "w-8 bg-primary"
                  : "w-2 bg-muted-foreground/30"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

