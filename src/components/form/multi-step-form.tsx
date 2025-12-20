"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { FormStep1 } from "./form-step1"
import { FormStep2 } from "./form-step2"
import { FormStep3 } from "./form-step3"
import { FormAccelerate } from "./form-accelerate"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

interface FormData {
  needs: string[]
  name: string
  email: string
  phone: string
  timestamp?: number
  website?: string
}

interface MultiStepFormProps {
  isOpen: boolean
  onClose: () => void
}

export function MultiStepForm({ isOpen, onClose }: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = React.useState(1)
  const [showAccelerateForm, setShowAccelerateForm] = React.useState(false)
  const [clientId, setClientId] = React.useState<string | null>(null)
  const [formData, setFormData] = React.useState<FormData>({
    needs: [],
    name: "",
    email: "",
    phone: "",
    timestamp: Date.now(),
    website: "",
  })

  const handleStep1Complete = (needs: string[]) => {
    setFormData((prev) => ({ ...prev, needs }))
    setCurrentStep(2)
  }

  const handleStep2Complete = (data: { name: string; email: string; phone: string }) => {
    setFormData((prev) => ({ ...prev, ...data }))
    setCurrentStep(3)
  }

  const handleFinalSubmit = async () => {
    try {
      const submissionData = {
        ...formData,
        timestamp: formData.timestamp || Date.now(),
      }

      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al enviar el formulario')
      }

      const result = await response.json()
      console.log("Form submitted successfully:", result)

      // Aquí puedes hacer algo con el clientId si lo necesitas
      // Por ejemplo, guardarlo en el estado para mostrar recomendaciones específicas

    } catch (error) {
      console.error("Error submitting form:", error)
      // Aquí puedes mostrar un mensaje de error al usuario
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      alert(`Error al enviar el formulario: ${errorMessage}`)
    }
  }

  const handleNeedsChange = React.useCallback((needs: string[]) => {
    setFormData((prev) => ({ ...prev, needs }))
  }, [])

  const handleDataChange = React.useCallback((data: { name: string; email: string; phone: string }) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }, [])

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleAccelerate = () => {
    setShowAccelerateForm(true)
  }

  const handleClientCreated = (id: string) => {
    setClientId(id)
  }

  const handleAccelerateComplete = () => {
    setShowAccelerateForm(false)
    handleBackToHome()
  }

  const handleBackToHome = () => {
    // Resetear el formulario
    setCurrentStep(1)
    setShowAccelerateForm(false)
    setClientId(null)
    setFormData({
      needs: [],
      name: "",
      email: "",
      phone: "",
      timestamp: Date.now(),
      website: "",
    })

    // Cerrar el modal y regresar a la página principal
    onClose()
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="form-title"
      aria-describedby="form-description"
    >
      {/* Botón cerrar - visible en todos los pasos cuando no está el formulario acelerado */}
      {!showAccelerateForm && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="fixed top-8 right-8 w-12 h-12 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center z-50 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label="Cerrar formulario"
          type="button"
        >
          <X className="size-5" />
          <span className="sr-only">Cerrar formulario</span>
        </motion.button>
      )}

      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        {/* Indicador de progreso - solo visible cuando no está el formulario acelerado */}
        {!showAccelerateForm && (
          <div className="max-w-4xl mx-auto mb-12 space-y-8">
            {/* Barra de progreso continua */}
            <div className="space-y-2">
              <div className="flex justify-between items-center pr-16">
                <span className="text-sm font-medium text-muted-foreground">
                  Progreso del formulario
                </span>
                <span className="text-sm font-medium">
                  {Math.round((currentStep / 3) * 100)}%
                </span>
              </div>
              <Progress
                value={(currentStep / 3) * 100}
                className="h-3"
                aria-label={`Paso ${currentStep} de 3 completado`}
              />
            </div>

            <Separator />

            {/* Indicador de progreso circular 1-2-3 */}
            <div className="flex items-center justify-center gap-4">
            {/* Paso 1 */}
            <div className="flex items-center gap-2 sm:gap-4">
              <motion.div
                animate={{
                  scale: currentStep >= 1 ? 1 : 0.8,
                  opacity: currentStep >= 1 ? 1 : 0.3,
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  currentStep >= 1
                    ? "bg-primary text-primary-foreground shadow-medium"
                    : "bg-muted text-muted-foreground"
                }`}
                aria-current={currentStep === 1 ? "step" : undefined}
                role="tab"
                aria-label={`Paso 1: ${currentStep >= 1 ? 'Completado' : 'Pendiente'}`}
              >
                1
              </motion.div>
              {currentStep > 1 && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "2rem" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="h-1 bg-primary hidden sm:block"
                />
              )}
            </div>

            {/* Paso 2 */}
            <div className="flex items-center gap-2 sm:gap-4">
              {currentStep > 2 && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "2rem" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="h-1 bg-primary hidden sm:block"
                />
              )}
              <motion.div
                animate={{
                  scale: currentStep >= 2 ? 1 : 0.8,
                  opacity: currentStep >= 2 ? 1 : 0.3,
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  currentStep >= 2
                    ? "bg-primary text-primary-foreground shadow-medium"
                    : "bg-muted text-muted-foreground"
                }`}
                aria-current={currentStep === 2 ? "step" : undefined}
                role="tab"
                aria-label={`Paso 2: ${currentStep >= 2 ? 'Completado' : 'Pendiente'}`}
              >
                2
              </motion.div>
              {currentStep > 2 && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "2rem" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="h-1 bg-primary hidden sm:block"
                />
              )}
            </div>

            {/* Paso 3 */}
            <div className="flex items-center gap-2 sm:gap-4">
              {currentStep > 2 && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "2rem" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="h-1 bg-primary hidden sm:block"
                />
              )}
              <motion.div
                animate={{
                  scale: currentStep >= 3 ? 1 : 0.8,
                  opacity: currentStep >= 3 ? 1 : 0.3,
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  currentStep >= 3
                    ? "bg-primary text-primary-foreground shadow-medium"
                    : "bg-muted text-muted-foreground"
                }`}
                aria-current={currentStep === 3 ? "step" : undefined}
                role="tab"
                aria-label={`Paso 3: ${currentStep >= 3 ? 'Completado' : 'Pendiente'}`}
              >
                3
              </motion.div>
            </div>
          </div>

          {/* Labels debajo */}
          <div className="flex items-center justify-center gap-4 sm:gap-8 lg:gap-16 mt-4">
            <span className="text-xs sm:text-sm text-muted-foreground text-center">
              Necesidades
            </span>
            <span className="text-xs sm:text-sm text-muted-foreground text-center">
              Datos básicos
            </span>
            <span className="text-xs sm:text-sm text-muted-foreground text-center">
              Confirmación
            </span>
          </div>
        </div>
        )}

        {/* Contenido del formulario */}
        <AnimatePresence mode="wait">
          {showAccelerateForm ? (
            <FormAccelerate
              key="accelerate"
              clientId={clientId}
              onComplete={handleAccelerateComplete}
              onBackToHome={handleBackToHome}
            />
          ) : (
            <>
              {currentStep === 1 && (
                <FormStep1
                  key="step1"
                  selectedNeeds={formData.needs}
                  onNeedsChange={handleNeedsChange}
                  onNext={() => handleStep1Complete(formData.needs)}
                />
              )}

              {currentStep === 2 && (
                <FormStep2
                  key="step2"
                  formData={{
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                  }}
                  onDataChange={handleDataChange}
                  onNext={() => handleStep2Complete({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                  })}
                  onBack={handleBack}
                />
              )}

              {currentStep === 3 && (
                <FormStep3
                  key="step3"
                  formData={formData}
                  onSubmit={handleFinalSubmit}
                  onAccelerate={handleAccelerate}
                  onBackToHome={handleBackToHome}
                  onClientCreated={handleClientCreated}
                />
              )}
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

