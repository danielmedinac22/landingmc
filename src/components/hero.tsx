"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface HeroProps {
  onOpenForm?: () => void
}

export function Hero({ onOpenForm }: HeroProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Verificar si la imagen existe
  useEffect(() => {
    const checkImage = async () => {
      try {
        const img = new window.Image()
        img.onload = () => setImageLoaded(true)
        img.onerror = () => {
          setImageError(true)
          setImageLoaded(false)
        }
        img.src = "/ImagenHero.png"
      } catch (error) {
        setImageError(true)
        setImageLoaded(false)
      }
    }
    checkImage()
  }, [])

  return (
    <section className="relative min-h-[100dvh] w-full overflow-hidden pt-32 lg:pt-36">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-amber-50/30 to-orange-50/20 dark:from-slate-950 dark:via-amber-950/30 dark:to-orange-950/20">
        {/* Animated particles/gradient effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl animate-pulse [animation-duration:8s]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl animate-pulse [animation-delay:2s] [animation-duration:10s]" />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl animate-pulse [animation-delay:4s] [animation-duration:12s]" />
          {/* Additional subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent" />
        </div>
      </div>

      {/* Mobile Background Image (Visible only on small screens) */}
      <div className="absolute inset-0 z-0 lg:hidden opacity-20 pointer-events-none">
        {imageLoaded && !imageError && (
          <Image
            src="/ImagenHero.png"
            alt="Background"
            fill
            className="object-cover object-center"
            priority
          />
        )}
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/90" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-6 lg:px-12 h-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center lg:items-end h-full pb-12 lg:pb-32 pt-8 lg:pt-0 min-h-[80vh] lg:min-h-full">
          {/* Left Column - Text Content */}
          <div className="flex flex-col justify-center lg:justify-center h-full pt-10 lg:pt-0">
            <div className="max-w-2xl mx-auto lg:mx-0 text-left">

              {/* Badge */}
              <div className="mb-4">
                <Badge variant="secondary" className="px-4 py-2 rounded-full bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-none text-sm font-medium gap-2">
                  <Sparkles className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  Contadores verificados
                </Badge>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-foreground mb-6">
                Encuentra a tu <br className="hidden lg:block" />
                contador ideal en <br className="hidden lg:block" />
                horas
              </h1>

              <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 md:mb-10 max-w-xl leading-relaxed">
                Conecta con contadores verificados, especializados en tu negocio y listos para ayudarte hoy mismo.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-start justify-start mb-10 md:mb-12">
                <Button
                  onClick={onOpenForm}
                  size="lg"
                  className="rounded-xl text-sm md:text-base px-6 py-4 md:px-8 md:py-6 h-auto w-full sm:w-auto shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 font-bold bg-yellow-400 hover:bg-yellow-500 text-black border-none"
                >
                  Encontrar mi contador
                  <ArrowRight className="ml-2 size-4 md:size-5" />
                </Button>
              </div>

              {/* Stats Section */}
              <div className="border-t border-border/40 pt-6 md:pt-8 grid grid-cols-2 sm:grid-cols-3 gap-6 md:gap-8">
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">500+</p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">Contadores activos</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">24hrs</p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">Tiempo promedio de respuesta</p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">98%</p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">Satisfacción del cliente</p>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column - Image (Hidden on mobile, visible on desktop) */}
          <div className="hidden lg:flex items-end justify-end h-full">
            <div className="relative w-full max-w-xl h-[600px] xl:h-[700px]">
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/2 to-transparent rounded-3xl blur-2xl -z-10" />
              <div className="relative w-full h-full animate-float">
                {imageLoaded && !imageError ? (
                  <Image
                    src="/ImagenHero.png"
                    alt="Profesional trabajando con datos verificados y seguros"
                    fill
                    className="object-contain object-bottom drop-shadow-2xl"
                    priority
                    sizes="50vw"
                    onError={() => {
                      setImageError(true)
                      setImageLoaded(false)
                    }}
                  />
                ) : null}
                {/* Placeholder si la imagen no existe o falla */}
                {(imageError || !imageLoaded) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 via-primary/3 to-transparent rounded-2xl border border-border/20">
                    <div className="text-center p-8 max-w-xs">
                      <div className="w-40 h-40 mx-auto mb-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-20 h-20 text-primary/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-xs text-muted-foreground font-medium">Agrega hero-illustration.png en /public</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
