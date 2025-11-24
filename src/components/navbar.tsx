"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface NavbarProps {
  onOpenForm: () => void
}

export function Navbar({ onOpenForm }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Image
              src="/logomc.png"
              alt="Muy Contador"
              width={90}
              height={30}
              className="h-6 w-auto"
            />
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
            onClick={onOpenForm}
            size="default"
            className="rounded-full text-sm md:text-base"
          >
            <span className="hidden sm:inline">Encuentra a tu contador</span>
            <span className="sm:hidden">Comenzar</span>
          </Button>
        </div>
      </div>
    </nav>
  )
}

