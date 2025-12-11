// Configuración de seguridad adicional

export const securityConfig = {
  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    maxRequests: 5, // máximo 5 envíos por IP
  },

  // Validación de tiempo de formulario
  formTiming: {
    minTimeMs: 3000, // mínimo 3 segundos para completar
    maxTimeMs: 3600000, // máximo 1 hora
  },

  // Lista de dominios bloqueados
  blockedDomains: [
    '10minutemail.com',
    'guerrillamail.com',
    'mailinator.com',
    'temp-mail.org',
    'throwaway.email',
    'yopmail.com',
    'maildrop.cc',
    'getnada.com',
    'tempail.com',
    'dispostable.com',
    'mail-temporaire.fr',
    'spamgourmet.com',
    'fakeinbox.com',
  ],

  // Palabras clave sospechosas en nombres
  suspiciousPatterns: [
    /test/i,
    /spam/i,
    /fake/i,
    /dummy/i,
    /bot/i,
    /admin/i,
    /root/i,
    /system/i,
  ],
}

// Función para validar que un email no sea sospechoso
export const validateEmailSecurity = (email: string): { valid: boolean; reason?: string } => {
  const domain = email.split('@')[1]?.toLowerCase()

  if (!domain) {
    return { valid: false, reason: 'Email inválido' }
  }

  if (securityConfig.blockedDomains.includes(domain)) {
    return { valid: false, reason: 'Dominio no permitido' }
  }

  return { valid: true }
}

// Función para validar nombre (no sospechoso)
export const validateNameSecurity = (name: string): { valid: boolean; reason?: string } => {
  const lowerName = name.toLowerCase()

  for (const pattern of securityConfig.suspiciousPatterns) {
    if (pattern.test(lowerName)) {
      return { valid: false, reason: 'Nombre sospechoso' }
    }
  }

  return { valid: true }
}

// Función para validar tiempo de formulario
export const validateFormTiming = (timestamp: number): { valid: boolean; reason?: string } => {
  const now = Date.now()
  const diff = now - timestamp

  if (diff < securityConfig.formTiming.minTimeMs) {
    return { valid: false, reason: 'Formulario completado demasiado rápido' }
  }

  if (diff > securityConfig.formTiming.maxTimeMs) {
    return { valid: false, reason: 'Formulario expirado' }
  }

  return { valid: true }
}