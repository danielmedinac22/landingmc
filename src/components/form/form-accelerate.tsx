"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Loader2 } from "lucide-react"
import { InteractiveChip } from "@/components/ui/interactive-chip"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface FormAccelerateProps {
  onComplete: () => void
  onBackToHome: () => void
}

const softwareOptions = [
  "Alegra",
  "Sigo",
  "Excel",
  "Word",
  "Office",
]

const colombianCities = [
  "Bogotá",
  "Medellín",
  "Cali",
  "Barranquilla",
  "Cartagena",
  "Bucaramanga",
  "Pereira",
  "Santa Marta",
  "Manizales",
  "Ibagué",
  "Pasto",
  "Armenia",
  "Villavicencio",
  "Valledupar",
  "Montería",
  "Sincelejo",
  "Popayán",
  "Tunja",
  "Neiva",
  "Riohacha",
]

export function FormAccelerate({ onComplete, onBackToHome }: FormAccelerateProps) {
  const [selectedSoftware, setSelectedSoftware] = React.useState<string[]>([])
  const [selectedCity, setSelectedCity] = React.useState<string>("")
  const [isSubmitted, setIsSubmitted] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [searchCity, setSearchCity] = React.useState("")

  const filteredCities = React.useMemo(() => {
    if (!searchCity.trim()) return colombianCities
    return colombianCities.filter(city =>
      city.toLowerCase().includes(searchCity.toLowerCase())
    )
  }, [searchCity])

  const handleToggleSoftware = (software: string) => {
    if (selectedSoftware.includes(software)) {
      setSelectedSoftware(selectedSoftware.filter((s) => s !== software))
    } else {
      setSelectedSoftware([...selectedSoftware, software])
    }
  }

  const handleCitySelect = (city: string) => {
    setSelectedCity(city)
    setSearchCity("")
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Aquí puedes enviar los datos adicionales
      console.log("Additional form data:", {
        software: selectedSoftware,
        city: selectedCity,
      })

      // Simular envío a API
      await new Promise(resolve => setTimeout(resolve, 2000))

      setIsSubmitted(true)

      // No cerrar automáticamente, el usuario debe hacer clic en "Volver al inicio"
    } catch (error) {
      console.error('Error submitting accelerated form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = selectedSoftware.length > 0 && selectedCity !== ""

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Título */}
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                ¿Quieres acelerar el proceso de encontrar?
              </h2>
              <p className="text-xl text-muted-foreground">
                Llena este formulario para dar más contexto a tu contador y lograr una solicitud más acertada
              </p>
            </div>

            <div className="space-y-12">
              {/* Sección Software */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="text-2xl font-semibold mb-6 text-center">
                  ¿Qué software usas?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {softwareOptions.map((software, index) => (
                    <InteractiveChip
                      key={software}
                      label={software}
                      isSelected={selectedSoftware.includes(software)}
                      onClick={() => handleToggleSoftware(software)}
                      index={index}
                    />
                  ))}
                </div>
                <AnimatePresence>
                  {selectedSoftware.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4 flex justify-center"
                    >
                      <div className="px-4 py-2 rounded-full bg-accent/20 text-accent-foreground text-sm">
                        {selectedSoftware.length} software seleccionado{selectedSoftware.length !== 1 ? "s" : ""}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <Separator className="my-8" />

              {/* Sección Ciudad */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-2xl font-semibold mb-6 text-center">
                  ¿En qué ciudad se encuentra nuevamente?
                </h3>
                
                {/* Input de búsqueda */}
                <div className="mb-6">
                  <input
                    type="text"
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    placeholder="Buscar ciudad..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/50 transition-colors"
                  />
                </div>

                {/* Ciudad seleccionada */}
                {selectedCity && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6"
                  >
                    <Card className="p-4 bg-accent/20 border-2 border-accent">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Ciudad seleccionada:</p>
                          <p className="text-lg font-semibold">{selectedCity}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedCity("")}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          Cambiar
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                )}

                {/* Lista de ciudades */}
                {!selectedCity && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="max-h-64 overflow-y-auto rounded-xl border-2 border-border bg-card p-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {filteredCities.map((city, index) => (
                        <motion.button
                          key={city}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.02 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleCitySelect(city)}
                          className="px-4 py-2 rounded-lg border border-border bg-background hover:bg-muted hover:border-foreground/30 transition-all text-left"
                        >
                          {city}
                        </motion.button>
                      ))}
                    </div>
                    {filteredCities.length === 0 && (
                      <p className="text-center text-muted-foreground py-4">
                        No se encontraron ciudades
                      </p>
                    )}
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Botón de envío */}
            <div className="flex justify-center mt-12">
              <AnimatePresence>
                {isFormValid && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <Button
                      variant="hero"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="px-12 py-6 text-lg"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        "Enviar información adicional"
                      )}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            {/* Animación de éxito */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
              }}
              className="mb-8 flex justify-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.2,
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                }}
                className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center"
              >
                <CheckCircle2 className="size-12 text-accent" />
              </motion.div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-4xl lg:text-5xl font-bold mb-4"
            >
              ¡Gracias!
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-xl text-muted-foreground mb-12"
            >
              Tu información adicional ha sido enviada. Esto nos ayudará a encontrar el contador perfecto para ti.
              <br />
              Puedes cerrar esta ventana cuando gustes.
            </motion.p>

            {/* Botón volver al inicio */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <Button
                variant="hero"
                onClick={onBackToHome}
                className="px-12 py-6 text-lg"
              >
                Volver al inicio
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

