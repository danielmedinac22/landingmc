import { z } from 'zod'
import { validateEmailSecurity, validateNameSecurity, validateFormTiming } from './security'

// Función para validar email con patrón más estricto
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  return emailRegex.test(email)
}

// Función para detectar emails temporales/desechables
export const isDisposableEmail = (email: string): boolean => {
  const disposableDomains = [
    '10minutemail.com',
    'guerrillamail.com',
    'mailinator.com',
    'temp-mail.org',
    'throwaway.email',
    'yopmail.com',
    'maildrop.cc',
    'getnada.com',
    'tempail.com',
    'dispostable.com'
  ]

  const domain = email.split('@')[1]?.toLowerCase()
  return disposableDomains.includes(domain)
}

// Función para sanitizar texto (remover caracteres peligrosos)
export const sanitizeText = (text: string): string => {
  return text
    .replace(/[<>]/g, '') // Remover tags HTML básicos
    .trim()
    .substring(0, 500) // Limitar longitud
}

// Esquema mejorado para validación del cliente
export const clientFormSchema = z.object({
  name: z.string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "El nombre solo puede contener letras y espacios")
    .transform(sanitizeText)
    .refine(name => validateNameSecurity(name).valid, {
      message: "Nombre no válido"
    }),

  email: z.string()
    .email("Ingresa un correo válido")
    .max(100, "El correo no puede exceder 100 caracteres")
    .refine(validateEmail, "Ingresa un correo válido")
    .refine(email => !isDisposableEmail(email), "No se permiten correos temporales")
    .refine(email => validateEmailSecurity(email).valid, {
      message: "Email no permitido"
    }),

  phone: z.string()
    .regex(/^[0-9]{10}$/, "Ingresa un teléfono válido de 10 dígitos"),

  needs: z.array(z.string())
    .min(1, "Debe seleccionar al menos un servicio")
    .max(10, "No puede seleccionar más de 10 servicios"),

  // Campo honeypot para detectar bots (debe estar vacío)
  website: z.string().max(0, "Campo inválido").optional(),

  // Timestamp para validar tiempo de envío
  timestamp: z.number()
    .refine(ts => validateFormTiming(ts).valid, {
      message: "Tiempo de envío inválido"
    })
})

export type ClientFormData = z.infer<typeof clientFormSchema>