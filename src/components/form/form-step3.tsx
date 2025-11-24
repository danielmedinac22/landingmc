"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Loader2, Edit3, Save, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface FormStep3Props {
  formData: {
    needs: string[]
    name: string
    email: string
    phone: string
    customMessage?: string
  }
  onSubmit: () => void
  onAccelerate?: () => void
  onBackToHome?: () => void
  onCustomMessageChange?: (message: string) => void
  onGenerateMessage?: (needs: string[]) => Promise<void>
}

export function FormStep3({ formData, onSubmit, onAccelerate, onBackToHome, onCustomMessageChange, onGenerateMessage }: FormStep3Props) {
  const [isSubmitted, setIsSubmitted] = React.useState(false)
  const [showRecommendations, setShowRecommendations] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isEditingMessage, setIsEditingMessage] = React.useState(false)
  const [isGeneratingMessage, setIsGeneratingMessage] = React.useState(false)
  const [messageGenerated, setMessageGenerated] = React.useState(false)

  // Función para renderizar el contenido del formulario
  const renderFormContent = () => {
    if (isGeneratingMessage) {
      return (
        <motion.div
          key="generating"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="text-center space-y-8"
        >
          <div className="space-y-6">
            {/* Título de generación */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                Creando tu mensaje inteligente
              </h2>
              <p className="text-xl text-muted-foreground">
                La IA está analizando tus necesidades para generar el mensaje perfecto
              </p>
            </motion.div>

            {/* Animación de IA trabajando */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex justify-center"
            >
              <div className="relative">
                {/* Círculo principal */}
                <motion.div
                  animate={{
                    rotate: 360,
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border-2 border-primary/30"
                >
                  <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary-foreground">AI</span>
                  </div>
                </motion.div>

                {/* Partículas flotantes */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [0, -20, 0],
                      opacity: [0.3, 1, 0.3]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: "easeInOut"
                    }}
                    className="absolute w-3 h-3 rounded-full bg-primary/60"
                    style={{
                      top: `${20 + i * 8}%`,
                      left: `${15 + (i % 3) * 25}%`,
                    }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Indicadores de progreso */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="space-y-4"
            >
              <div className="flex justify-center gap-2">
                {["Analizando", "Procesando", "Generando"].map((step, index) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0.3 }}
                    animate={{
                      opacity: [0.3, 1, 0.3]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.5,
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-2 h-2 border border-primary border-t-transparent rounded-full"
                    />
                    <span className="text-sm font-medium">{step}</span>
                  </motion.div>
                ))}
              </div>

              <p className="text-sm text-muted-foreground">
                Esto tomará solo unos segundos...
              </p>
            </motion.div>
          </div>
        </motion.div>
      )
    }

    if (messageGenerated) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Título */}
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl lg:text-5xl font-bold mb-4"
            >
              ¡Listo! Revisa tu mensaje
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-muted-foreground"
            >
              Tu mensaje personalizado está listo para enviar
            </motion.p>
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

            {/* Sección Mensaje personalizado para el contador */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative p-8 rounded-3xl border border-border/30 bg-gradient-to-br from-accent/5 via-background/80 to-accent/10 shadow-lg backdrop-blur-sm"
            >
              {/* Elementos decorativos de fondo */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-accent/3 to-transparent pointer-events-none" />
              <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-gradient-to-br from-primary/8 to-accent/8 blur-xl" />
              <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-gradient-to-br from-accent/8 to-primary/8 blur-xl" />

              {/* Header con icono de IA */}
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg"
                  >
                    <span className="text-primary-foreground text-lg font-bold">AI</span>
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">
                      Mensaje Inteligente
                    </h3>
                    <p className="text-sm text-muted-foreground">Generado por IA para tu contador</p>
                  </div>
                </div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingMessage(!isEditingMessage)}
                    className="flex items-center gap-2 border-border/60 hover:border-primary/50 bg-background/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    {isEditingMessage ? (
                      <>
                        <X className="size-4" />
                        <span>Cancelar</span>
                      </>
                    ) : (
                      <>
                        <Edit3 className="size-4" />
                        <span>Editar</span>
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>

              {/* Contenido del mensaje */}
              <div className="relative z-10">
                {isEditingMessage ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-4"
                  >
                    <div className="relative">
                      <textarea
                        value={formData.customMessage || ""}
                        onChange={(e) => onCustomMessageChange?.(e.target.value)}
                        className="w-full min-h-40 p-6 text-base border-2 border-border/60 rounded-2xl bg-background/95 backdrop-blur-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 shadow-md transition-all duration-300"
                        placeholder="Escribe tu mensaje personalizado para el contador..."
                        maxLength={500}
                      />
                      <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-primary animate-pulse" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        {formData.customMessage?.length || 0}/500 caracteres
                      </div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditingMessage(false)}
                          className="flex items-center gap-2 border-border/60 hover:border-primary/60 bg-accent/30 hover:bg-accent/40 text-accent-foreground shadow-sm hover:shadow-md transition-all duration-300"
                        >
                          <Save className="size-4" />
                          Guardar
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative"
                  >
                    <div className="p-6 rounded-2xl bg-background/80 backdrop-blur-sm border border-border/40 shadow-md min-h-40 flex items-center relative overflow-hidden">
                      {/* Efectos de fondo animados */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/10 to-transparent animate-pulse" />
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/60 via-accent/40 to-primary/60" />

                      <div className="relative z-10 w-full">
                        {formData.customMessage ? (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-base leading-relaxed text-foreground font-medium"
                          >
                            {formData.customMessage}
                          </motion.p>
                        ) : (
                          <div className="flex items-center gap-3">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full"
                            />
                            <span className="text-muted-foreground font-medium">Generando mensaje inteligente...</span>
                          </div>
                        )}
                      </div>

                      {/* Indicador de IA */}
                      {formData.customMessage && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5, type: "spring" }}
                          className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg"
                        >
                          <span className="text-primary-foreground text-xs font-bold">AI</span>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Footer informativo */}
              {!isEditingMessage && formData.customMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-6 p-4 rounded-xl bg-accent/10 border border-border/20 relative z-10 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse" />
                    <span className="font-medium">
                      Este mensaje personalizado será enviado a tu contador junto con tus datos
                    </span>
                  </div>
                </motion.div>
              )}

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
          </div>
        </motion.div>
      )
    }

    return null
  }

  // Generar mensaje automáticamente cuando se monta el componente
  React.useEffect(() => {
    if (!messageGenerated && formData.needs.length > 0 && !formData.customMessage) {
      generateMessage()
    } else if (formData.customMessage) {
      setMessageGenerated(true)
    }
  }, [formData.needs, formData.customMessage, messageGenerated])

  const generateMessage = async () => {
    if (!onGenerateMessage || isGeneratingMessage) return

    try {
      setIsGeneratingMessage(true)
      await onGenerateMessage(formData.needs)
      setMessageGenerated(true)
    } catch (error) {
      console.error('Error generando mensaje:', error)
      setMessageGenerated(true) // Mostrar el estado final incluso con error
    } finally {
      setIsGeneratingMessage(false)
    }
  }

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
            {/* Contenedor principal del contenido del form */}
            <div>
              {renderFormContent()}
            </div>
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center space-y-8"
              >
                <div className="space-y-6">
                  {/* Título de generación */}
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                      Creando tu mensaje inteligente
                    </h2>
                    <p className="text-xl text-muted-foreground">
                      La IA está analizando tus necesidades para generar el mensaje perfecto
                    </p>
                  </motion.div>

                  {/* Animación de IA trabajando */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="flex justify-center"
                  >
                    <div className="relative">
                      {/* Círculo principal */}
                      <motion.div
                        animate={{
                          rotate: 360,
                          scale: [1, 1.1, 1]
                        }}
                        transition={{
                          rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border-2 border-primary/30"
                      >
                        <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center">
                          <span className="text-2xl font-bold text-primary-foreground">AI</span>
                        </div>
                      </motion.div>

                      {/* Partículas flotantes */}
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{
                            y: [0, -20, 0],
                            opacity: [0.3, 1, 0.3]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.3,
                            ease: "easeInOut"
                          }}
                          className="absolute w-3 h-3 rounded-full bg-primary/60"
                          style={{
                            top: `${20 + i * 8}%`,
                            left: `${15 + (i % 3) * 25}%`,
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>

                  {/* Indicadores de progreso */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-4"
                  >
                    <div className="flex justify-center gap-2">
                      {["Analizando", "Procesando", "Generando"].map((step, index) => (
                        <motion.div
                          key={step}
                          initial={{ opacity: 0.3 }}
                          animate={{
                            opacity: [0.3, 1, 0.3]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: index * 0.5,
                          }}
                          className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20"
                        >
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-2 h-2 border border-primary border-t-transparent rounded-full"
                          />
                          <span className="text-sm font-medium">{step}</span>
                        </motion.div>
                      ))}
                    </div>

                    <p className="text-sm text-muted-foreground">
                      Esto tomará solo unos segundos...
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            ) : messageGenerated ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {/* Título */}
                <div className="text-center mb-12">
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl lg:text-5xl font-bold mb-4"
                  >
                    ¡Listo! Revisa tu mensaje
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl text-muted-foreground"
                  >
                    Tu mensaje personalizado está listo para enviar
                  </motion.p>
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

              {/* Sección Mensaje personalizado para el contador */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative p-8 rounded-3xl border border-border/30 bg-gradient-to-br from-accent/5 via-background/80 to-accent/10 shadow-lg backdrop-blur-sm"
              >
                {/* Elementos decorativos de fondo */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/3 via-accent/2 to-primary/3 pointer-events-none" />
                <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-gradient-to-br from-primary/8 to-accent/8 blur-xl" />
                <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-gradient-to-br from-accent/8 to-primary/8 blur-xl" />

                {/* Header con icono de IA */}
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg"
                    >
                      <span className="text-primary-foreground text-lg font-bold">AI</span>
                    </motion.div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">
                        Mensaje Inteligente
                      </h3>
                      <p className="text-sm text-muted-foreground">Generado por IA para tu contador</p>
                    </div>
                  </div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditingMessage(!isEditingMessage)}
                      className="flex items-center gap-2 border-border/60 hover:border-primary/50 bg-background/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      {isEditingMessage ? (
                        <>
                          <X className="size-4" />
                          <span>Cancelar</span>
                        </>
                      ) : (
                        <>
                          <Edit3 className="size-4" />
                          <span>Editar</span>
                        </>
                      )}
                    </Button>
                  </motion.div>
                </div>

                {/* Contenido del mensaje */}
                <div className="relative z-10">
                  {isEditingMessage ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="space-y-4"
                    >
                      <div className="relative">
                        <textarea
                          value={formData.customMessage || ""}
                          onChange={(e) => onCustomMessageChange?.(e.target.value)}
                          className="w-full min-h-40 p-6 text-base border-2 border-border/60 rounded-2xl bg-background/95 backdrop-blur-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 shadow-md transition-all duration-300"
                          placeholder="Escribe tu mensaje personalizado para el contador..."
                          maxLength={500}
                        />
                        <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-primary animate-pulse" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                          {formData.customMessage?.length || 0}/500 caracteres
                        </div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditingMessage(false)}
                            className="flex items-center gap-2 border-border/60 hover:border-primary/60 bg-accent/30 hover:bg-accent/40 text-accent-foreground shadow-sm hover:shadow-md transition-all duration-300"
                          >
                            <Save className="size-4" />
                            Guardar
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="relative"
                    >
                      <div className="p-6 rounded-2xl bg-background/80 backdrop-blur-sm border border-border/40 shadow-md min-h-40 flex items-center relative overflow-hidden">
                        {/* Efectos de fondo animados */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/10 to-transparent animate-pulse" />
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/60 via-accent/40 to-primary/60" />

                        <div className="relative z-10 w-full">
                          {formData.customMessage ? (
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.3 }}
                              className="text-base leading-relaxed text-foreground font-medium"
                            >
                              {formData.customMessage}
                            </motion.p>
                          ) : (
                            <div className="flex items-center gap-3">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full"
                              />
                              <span className="text-muted-foreground font-medium">Generando mensaje inteligente...</span>
                            </div>
                          )}
                        </div>

                        {/* Indicador de IA */}
                        {formData.customMessage && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5, type: "spring" }}
                            className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg"
                          >
                            <span className="text-primary-foreground text-xs font-bold">AI</span>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Footer informativo */}
                {!isEditingMessage && formData.customMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-6 p-4 rounded-xl bg-accent/10 border border-border/20 relative z-10 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse" />
                      <span className="font-medium">
                        Este mensaje personalizado será enviado a tu contador junto con tus datos
                      </span>
                    </div>
                  </motion.div>
                )}

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
            )
              }
            </div>
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

