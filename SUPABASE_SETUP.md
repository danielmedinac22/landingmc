# Configuración de Supabase para Landing MC

Este documento explica cómo configurar Supabase para el backend de la landing page de contadores.

## 1. Crear proyecto en Supabase

1. Ve a [https://app.supabase.com](https://app.supabase.com)
2. Crea una cuenta o inicia sesión
3. Haz clic en "New project"
4. Completa la información:
   - **Name**: `landing-mc` (o el nombre que prefieras)
   - **Database Password**: Crea una contraseña segura
   - **Region**: Elige la región más cercana (para Colombia, recomendamos `West US (North California)` o `East US (North Virginia)`)

## 2. Configurar la base de datos

### Ejecutar el esquema

1. En tu proyecto de Supabase, ve a **SQL Editor**
2. Copia y pega el contenido del archivo `supabase-schema.sql`
3. Haz clic en **Run** para crear todas las tablas, índices y políticas de seguridad

### Poblar con datos iniciales

1. En una nueva consulta SQL, copia y pega el contenido del archivo `supabase-seeds.sql`
2. Haz clic en **Run** para insertar los servicios y contadores de ejemplo

## 3. Configurar variables de entorno

### Obtener las claves API

1. Ve a **Settings > API** en tu proyecto de Supabase
2. Copia los siguientes valores:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: La clave pública anónima
   - **service_role secret key**: La clave de servicio (manténla segura)

### Crear archivo .env.local

Crea un archivo `.env.local` en la raíz de tu proyecto Next.js:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio_aqui
```

⚠️ **Importante**: Nunca subas el archivo `.env.local` a git. Ya está incluido en `.gitignore`.

## 4. Verificar la configuración

### Probar la conexión

Ejecuta el proyecto:

```bash
npm run dev
```

Si todo está configurado correctamente, deberías poder:
- Enviar formularios (se guardarán en la tabla `clients`)
- Ver recomendaciones de contadores
- Acceder a las APIs desde el navegador

### Verificar datos en Supabase

Ve a **Table Editor** en Supabase para verificar que las tablas se crearon correctamente:

- `services`: 26 servicios (8 principales + 18 relacionados)
- `accountants`: 6 contadores de ejemplo
- `clients`: Se llenará cuando los usuarios envíen el formulario
- `accountant_services`: Relaciones entre contadores y servicios

## 5. Próximos pasos

Una vez configurado Supabase:

1. **Instalar dependencias**: `npm install @supabase/supabase-js`
2. **Implementar APIs**: Las rutas API en `/app/api/` usarán el cliente de Supabase
3. **Configurar autenticación**: Si necesitas login para contadores/admin
4. **Deploy**: Configurar las variables de entorno en Vercel/Netlify

## Estructura de la base de datos

### Tablas principales

- **`clients`**: Consultas de usuarios potenciales
- **`accountants`**: Contadores disponibles
- **`services`**: Servicios contables disponibles
- **`client_services`**: Relación cliente-servicio
- **`accountant_services`**: Relación contador-servicio
- **`recommendations`**: Recomendaciones automáticas

### Funcionalidades clave

- **Matching automático**: Algoritmo que recomienda contadores basado en servicios solicitados
- **Sistema de calificación**: Los contadores tienen ratings
- **Seguimiento de estado**: Cada consulta puede ser rastreada desde "pending" hasta "converted"
- **Seguridad RLS**: Políticas de seguridad a nivel de fila

## Solución de problemas

### Error de conexión
- Verifica que las variables de entorno estén correctas
- Asegúrate de que la URL termine con `.supabase.co`

### Políticas RLS bloqueando consultas
- Para desarrollo, puedes deshabilitar RLS temporalmente: `ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;`
- En producción, configura autenticación adecuada

### Datos no aparecen
- Verifica que los inserts se ejecutaron correctamente en SQL Editor
- Revisa los logs de Supabase en **Reports > Logs**

## Documentación adicional

- [Documentación oficial de Supabase](https://supabase.com/docs)
- [Guía de Next.js con Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Referencia de la API de Supabase](https://supabase.com/docs/reference/javascript)