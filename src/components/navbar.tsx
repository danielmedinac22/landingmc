"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-foreground hover:opacity-80 transition-opacity">
            Muy Contador
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#como-funciona"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Cómo funciona
            </Link>
            <Link
              href="#servicios"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Servicios
            </Link>
          </div>

          {/* CTA Button */}
          <Button
            asChild
            size="default"
            className="rounded-full text-sm md:text-base"
          >
            <Link href="#formulario" className="whitespace-nowrap">
              <span className="hidden sm:inline">Encuentra a tu contador</span>
              <span className="sm:hidden">Comenzar</span>
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}

