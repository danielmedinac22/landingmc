import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rate limiting básico en memoria (para producción usar Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const WINDOW_MS = 15 * 60 * 1000 // 15 minutos
const MAX_REQUESTS = 5 // máximo 5 envíos de formulario por IP en 15 minutos

export function middleware(request: NextRequest) {
  // Solo aplicar rate limiting a la API de envío de formularios
  if (request.nextUrl.pathname === '/api/clients' && request.method === 'POST') {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    const now = Date.now()
    const windowStart = now - WINDOW_MS

    // Limpiar entradas expiradas
    for (const [key, value] of rateLimitMap.entries()) {
      if (value.resetTime < windowStart) {
        rateLimitMap.delete(key)
      }
    }

    // Verificar rate limit
    const userLimit = rateLimitMap.get(ip)
    if (userLimit && userLimit.count >= MAX_REQUESTS) {
      return NextResponse.json(
        {
          error: 'Demasiadas solicitudes. Por favor, intenta más tarde.',
          retryAfter: Math.ceil((userLimit.resetTime - now) / 1000)
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((userLimit.resetTime - now) / 1000).toString()
          }
        }
      )
    }

    // Actualizar contador
    if (userLimit) {
      userLimit.count++
    } else {
      rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}