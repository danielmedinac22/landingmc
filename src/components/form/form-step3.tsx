"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface FormStep3Props {
  formData: {
    needs: string[]
    name: string
    email: string
    phone: string
  }
  onSubmit: () => void
  onAccelerate?: () => void
  onBackToHome?: () => void
}

export function FormStep3({ formData, onSubmit, onAccelerate, onBackToHome }: FormStep3Props) {
  const [isSubmitted, setIsSubmitted] = React.useState(false)
  const [showRecommendations, setShowRecommendations] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Simular envío a API
      await new Promise(resolve => setTimeout(resolve, 2000))
      onSubmit()

      setIsSubmitted(true)

      // Mostrar recomendaciones inmediatamente después del envío exitoso
      setShowRecommendations(true)
    } catch (error) {
      console.error('Error submitting form:', error)
      // Aquí podrías mostrar un mensaje de error
    } finally {
      setIsSubmitting(false)
    }
  }

  const recommendedAccountants = [
    {
      id: 1,
      name: "María González",
      specialty: "E-commerce & Pasarelas",
      experience: "8 años",
      rating: 4.9,
    },
    {
      id: 2,
      name: "Carlos Ramírez",
      specialty: "Constitución & Asesoría",
      experience: "12 años",
      rating: 4.8,
    },
    {
      id: 3,
      name: "Ana Martínez",
      specialty: "Contabilidad Mensual",
      experience: "10 años",
      rating: 4.9,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
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
                Confirma tu información
              </h2>
              <p className="text-xl text-muted-foreground">
                Revisa que todo esté correcto antes de continuar
              </p>
            </div>

            {/* Resumen de datos */}
            <div className="space-y-8 mb-12">
              {/* Sección Tus datos */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-6 rounded-2xl border-2 border-border bg-card"
              >
                <h3 className="text-2xl font-semibold mb-4">Tus datos</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-muted-foreground">Nombre:</span>
                    <p className="text-lg font-medium">{formData.name}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Email:</span>
                    <p className="text-lg font-medium">{formData.email}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Teléfono:</span>
                    <p className="text-lg font-medium">{formData.phone}</p>
                  </div>
                </div>
              </motion.div>

              {/* Sección Tus necesidades */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-2xl border-2 border-border bg-card"
              >
                <h3 className="text-2xl font-semibold mb-4">Tus necesidades</h3>
                <div className="flex flex-wrap gap-3">
                  {formData.needs.map((need, index) => (
                    <motion.div
                      key={need}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      className="px-4 py-2 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium"
                    >
                      {need}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            <Separator className="my-8" />

            {/* Botón de envío */}
            <div className="flex justify-center">
              <Button
                variant="hero"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-12 py-6 text-lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando información...
                  </>
                ) : (
                  "Enviar y encontrar mi contador ideal"
                )}
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            {/* Animación de éxito con checkmark */}
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
              ¡Perfecto!
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-xl text-muted-foreground mb-8"
            >
              Serás contactado por uno de nuestros contadores o asesores en menos de 4 horas.
              <br />
              Puedes explorar las recomendaciones abajo o cerrar esta ventana cuando gustes.
            </motion.p>

            <Separator className="my-8" />

            {/* Recomendaciones */}
            <AnimatePresence>
              {showRecommendations && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-12"
                >
                  <h3 className="text-2xl font-semibold mb-6 text-center">
                    Contadores recomendados para ti
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {recommendedAccountants.map((accountant, index) => (
                      <motion.div
                        key={accountant.id}
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                          delay: 0.3 + index * 0.1,
                          duration: 0.4,
                          ease: "easeOut",
                        }}
                        whileHover={{ scale: 1.02, y: -4 }}
                      >
                        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                          <div className="space-y-3">
                            <h4 className="text-xl font-semibold">
                              {accountant.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {accountant.specialty}
                            </p>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-muted-foreground">
                                {accountant.experience}
                              </span>
                              <span className="font-medium">
                                ⭐ {accountant.rating}
                              </span>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Opciones después de la confirmación */}
            <AnimatePresence>
              {showRecommendations && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-12 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    {onAccelerate && (
                      <Button
                        variant="hero"
                        onClick={onAccelerate}
                        className="px-8 py-6 text-lg w-full sm:w-auto"
                      >
                        ¿Quieres acelerar el proceso de encontrar?
                      </Button>
                    )}
                    {onBackToHome && (
                      <Button
                        variant="outline"
                        onClick={onBackToHome}
                        className="px-8 py-6 text-lg w-full sm:w-auto border-2 border-border bg-background hover:bg-muted hover:border-foreground/20"
                      >
                        Volver al inicio
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

