"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

export function Hero() {
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
    <section className="relative h-screen w-full overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950/20">
        {/* Animated particles/gradient effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse [animation-duration:8s]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse [animation-delay:2s] [animation-duration:10s]" />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse [animation-delay:4s] [animation-duration:12s]" />
          {/* Additional subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent" />
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-6 lg:px-12 h-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-end h-full pb-24 lg:pb-32">
          {/* Left Column - Text Content */}
          <div className="flex flex-col justify-end">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-foreground mb-6">
                Encuentra a tu contador ideal en horas.
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-10">
                Conecta con expertos verificados para tu negocio, sin complicaciones.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full text-base px-8 py-6 h-auto"
                >
                  <Link href="#formulario">
                    Comenzar ahora
                    <ArrowRight className="ml-2 size-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  size="lg"
                  className="rounded-full text-base px-8 py-6 h-auto"
                >
                  <Link href="#como-funciona">
                    Ver cómo funciona
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="flex items-end justify-center lg:justify-end h-full pt-16 lg:pt-0">
            <div className="relative w-full max-w-lg lg:max-w-xl h-[500px] lg:h-[600px] xl:h-[700px]">
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
                    sizes="(max-width: 1024px) 100vw, 50vw"
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

