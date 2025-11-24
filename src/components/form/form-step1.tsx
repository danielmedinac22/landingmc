"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { InteractiveChip } from "@/components/ui/interactive-chip"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface FormStep1Props {
  selectedNeeds: string[]
  onNeedsChange: (needs: string[]) => void
  onNext: () => void
  onBack?: () => void
}

const mainServices = [
  "Registro en Cámara de Comercio de Medellín",
  "Trámites ante la DIAN",
  "Contabilidad para e-commerce",
  "Asesoría para urgencias",
  "Declaraciones atrasadas",
  "Acompañamiento mensual",
  "Conciliación de pasarelas",
  "Constitución de empresa",
]

const relatedServices: Record<string, string[]> = {
  "Registro en Cámara de Comercio de Medellín": ["Registro Mercantil", "Actualización RUT", "Certificaciones", "Renovación Matrícula"],
  "Trámites ante la DIAN": ["Registro RUT", "Actualización RUT", "Certificado de Existencia", "Consultas Tributarias"],
  "Contabilidad para e-commerce": ["Shopify", "WooCommerce", "Mercado Libre", "Amazon"],
  "Conciliación de pasarelas": ["Stripe", "PayPal", "Wompi", "PayU"],
  "Constitución de empresa": ["S.A.S.", "Ltda.", "Persona Natural"],
  "Acompañamiento mensual": ["Contabilidad", "Impuestos", "Nómina", "Reportes"],
}

export function FormStep1({
  selectedNeeds,
  onNeedsChange,
  onNext,
  onBack,
}: FormStep1Props) {
  const handleToggleNeed = (need: string) => {
    if (selectedNeeds.includes(need)) {
      onNeedsChange(selectedNeeds.filter((n) => n !== need))
    } else {
      onNeedsChange([...selectedNeeds, need])
    }
  }

  const handleToggleRelated = (related: string) => {
    if (selectedNeeds.includes(related)) {
      onNeedsChange(selectedNeeds.filter((n) => n !== related))
    } else {
      onNeedsChange([...selectedNeeds, related])
    }
  }

  const getRelatedServicesForSelected = () => {
    const related: string[] = []
    selectedNeeds.forEach((need) => {
      if (relatedServices[need]) {
        related.push(...relatedServices[need])
      }
    })
    return Array.from(new Set(related))
  }

  const relatedToShow = getRelatedServicesForSelected()
  const isFormValid = selectedNeeds.length >= 2

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      {/* Contador dinámico - Badge flotante */}
      <AnimatePresence>
        {selectedNeeds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
            }}
            className="mb-8 flex justify-center"
          >
            <div className="px-6 py-3 rounded-full bg-accent/20 text-accent-foreground shadow-soft">
              <span className="text-sm font-semibold">
                Tus necesidades: {selectedNeeds.length} seleccionada{selectedNeeds.length !== 1 ? "s" : ""}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Título y subtítulo */}
      <div className="text-center mb-12">
        <h2 id="form-title" className="text-4xl lg:text-5xl font-bold mb-4">
          ¿Qué necesitas de tu contador?
        </h2>
        <p id="form-description" className="text-xl text-muted-foreground">
          Selecciona al menos 2 opciones para personalizar tu búsqueda
        </p>
      </div>

      {/* Chips principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {mainServices.map((service, index) => (
          <InteractiveChip
            key={service}
            label={service}
            isSelected={selectedNeeds.includes(service)}
            onClick={() => handleToggleNeed(service)}
            index={index}
          />
        ))}
      </div>

      {/* Chips relacionados dinámicos */}
      <AnimatePresence>
        {relatedToShow.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mb-12"
          >
            <h3 className="text-2xl font-semibold mb-6 text-center">
              Opciones relacionadas
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedToShow.map((related, index) => (
                <InteractiveChip
                  key={related}
                  label={related}
                  isSelected={selectedNeeds.includes(related)}
                  onClick={() => handleToggleRelated(related)}
                  index={index}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botones */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-12">
        <div className="flex justify-start">
          {onBack && (
            <Button
              variant="outline"
              onClick={onBack}
              className="border-2 border-border bg-background hover:bg-muted hover:border-foreground/20"
            >
              <ArrowLeft className="size-4" />
              Atrás
            </Button>
          )}
        </div>

        <div className="flex justify-center sm:justify-end">
          <AnimatePresence>
            {isFormValid && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  variant="hero"
                  onClick={onNext}
                >
                  Continuar
                  <motion.span
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    →
                  </motion.span>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

