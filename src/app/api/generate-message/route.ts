import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null

export async function POST(request: NextRequest) {
  try {
    const { needs } = await request.json()

    if (!needs || !Array.isArray(needs) || needs.length === 0) {
      return NextResponse.json(
        { error: 'Las necesidades son requeridas' },
        { status: 400 }
      )
    }

    // Si no hay API key configurada, usar mensaje fallback
    if (!openai) {
      const fallbackMessage = `Hola, estoy interesado en servicios contables. Necesito ayuda con: ${needs.join(', ')}. ¿Podríamos conversar sobre cómo pueden apoyarme en estos temas? Gracias.`
      return NextResponse.json({
        message: fallbackMessage,
        needs: needs,
        fallback: true
      })
    }

    const prompt = `Eres un asistente de IA que ayuda a las personas a escribir mensajes naturales y personales a sus contadores. El usuario acaba de seleccionar sus necesidades específicas y quiere que generes un mensaje que parezca escrito por él mismo.

INSTRUCCIONES IMPORTANTES:
1. El mensaje debe sonar completamente natural, como si la persona lo hubiera escrito personalmente
2. Comenzar con un saludo cordial y natural (no "Estimado contador" o formal)
3. Explicar las necesidades de manera conversacional, mencionando específicamente los servicios requeridos
4. Usar lenguaje cotidiano, amigable pero profesional
5. Terminar de manera natural, invitando al contador a conversar
6. Mantener el mensaje conciso (máximo 150 palabras)
7. Escribir completamente en español

Necesidades específicas seleccionadas por el usuario: ${needs.join(', ')}

Ejemplo de tono deseado:
"Hola, me gustaría conversar con ustedes sobre mis necesidades contables. Estoy empezando con mi tienda en línea en Shopify y necesito ayuda con la contabilidad mensual, además de registrar mi empresa en la Cámara de Comercio. ¿Sería posible que me orienten sobre estos servicios?"

Genera el mensaje personalizado que el usuario enviará a su contador:`

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Eres un experto en generar mensajes naturales y personales que suenen como si el usuario los hubiera escrito personalmente. Tu objetivo es hacer que los mensajes sean conversacionales, amigables y completamente naturales, nunca formales o robóticos.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 200,
      temperature: 0.7,
    })

    const generatedMessage = completion.choices[0]?.message?.content?.trim()

    if (!generatedMessage) {
      throw new Error('No se pudo generar el mensaje')
    }

    return NextResponse.json({
      message: generatedMessage,
      needs: needs
    })

  } catch (error) {
    console.error('Error generando mensaje:', error)

    // Mensaje fallback en caso de error
    const fallbackMessage = `Hola, estoy buscando ayuda con mis asuntos contables. Necesito asesoría sobre: ${needs.join(', ')}. ¿Podríamos hablar al respecto? Gracias.`

    return NextResponse.json({
      message: fallbackMessage,
      fallback: true
    })
  }
}
