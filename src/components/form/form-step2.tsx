"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

interface FormStep2Props {
  formData: {
    name: string
    email: string
    phone: string
  }
  onDataChange: (data: { name: string; email: string; phone: string }) => void
  onNext: () => void
  onBack: () => void
}

const formSchema = z.object({
  name: z.string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "El nombre solo puede contener letras y espacios"),
  email: z.string()
    .email("Ingresa un correo válido")
    .max(100, "El correo no puede exceder 100 caracteres"),
  phone: z.string()
    .regex(/^[0-9]{10}$/, "Ingresa un teléfono válido de 10 dígitos")
})

export function FormStep2({
  formData,
  onDataChange,
  onNext,
  onBack,
}: FormStep2Props) {
  const [formStartTime] = React.useState(Date.now())

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
    },
  })

  const watchedValues = form.watch()

  React.useEffect(() => {
    onDataChange({
      name: watchedValues.name || "",
      email: watchedValues.email || "",
      phone: watchedValues.phone || "",
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedValues.name, watchedValues.email, watchedValues.phone])

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Agregar campos de seguridad antes de enviar
    const secureData = {
      ...values,
      timestamp: formStartTime,
      website: '', // honeypot field
    }
    onNext()
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      {/* Título y subtítulo */}
      <div className="text-center mb-8">
        <h2 className="text-3xl lg:text-4xl font-bold mb-3">
          Perfecto, ahora solo necesitamos tus datos
        </h2>
        <p className="text-lg text-muted-foreground">
          Para conectarte con el contador ideal
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Campo Nombre */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  Nombre completo
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Ingresa tu nombre completo"
                    className="h-11 px-6 text-base"
                    autoComplete="name"
                  />
                </FormControl>
                <FormMessage className="animate-in slide-in-from-top-1 duration-200" />
              </FormItem>
            )}
          />

          {/* Campo Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="tu@email.com"
                    className="h-11 px-6 text-base"
                    autoComplete="email"
                  />
                </FormControl>
                <FormMessage className="animate-in slide-in-from-top-1 duration-200" />
              </FormItem>
            )}
          />

          {/* Campo Teléfono */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  Teléfono
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="tel"
                    placeholder="1234567890"
                    maxLength={10}
                    className="h-11 px-6 text-base"
                    autoComplete="tel"
                  />
                </FormControl>
                <FormMessage className="animate-in slide-in-from-top-1 duration-200" />
              </FormItem>
            )}
          />

          {/* Botones */}
          <div className="flex justify-between items-center mt-8">
            <Button
              variant="outline"
              type="button"
              onClick={onBack}
              className="border-2 border-border bg-background hover:bg-muted hover:border-foreground/20"
            >
              <ArrowLeft className="size-4" />
              Atrás
            </Button>

            <div className="flex-1" />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity: 1,
                scale: 1
              }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                variant="hero"
                type="submit"
                disabled={!form.formState.isValid || form.formState.isSubmitting}
                className={!form.formState.isValid ? "opacity-60 cursor-not-allowed" : ""}
              >
                Continuar
                {form.formState.isValid && (
                  <motion.span
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    →
                  </motion.span>
                )}
              </Button>
            </motion.div>
          </div>
        </form>
      </Form>
    </motion.div>
  )
}

