-- SETUP COMPLETO DE SUPABASE PARA LANDING MC
-- Ejecutar en el SQL Editor de Supabase (https://app.supabase.com)

-- ==========================================
-- PASO 1: CREAR EL ESQUEMA DE LA BASE DE DATOS
-- ==========================================

-- Tabla de servicios disponibles
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL, -- 'main', 'related'
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de contadores
CREATE TABLE accountants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  specialty TEXT, -- especialidad principal
  experience_years INTEGER,
  rating DECIMAL(3,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de consultas de clientes
CREATE TABLE clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'contacted', 'qualified', 'converted'
  source TEXT DEFAULT 'website', -- 'website', 'referral', etc.
  notes TEXT,
  contacted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Índices para búsquedas rápidas
  CONSTRAINT check_status CHECK (status IN ('pending', 'contacted', 'qualified', 'converted')),
  CONSTRAINT check_source CHECK (source IN ('website', 'referral', 'social', 'other'))
);

-- Tabla de relación cliente-servicio (muchos a muchos)
CREATE TABLE client_services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(client_id, service_id)
);

-- Tabla de relación contador-servicio (muchos a muchos)
CREATE TABLE accountant_services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  accountant_id UUID NOT NULL REFERENCES accountants(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(accountant_id, service_id)
);

-- Tabla de recomendaciones (cuando se asigna un contador a un cliente)
CREATE TABLE recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  accountant_id UUID NOT NULL REFERENCES accountants(id) ON DELETE CASCADE,
  match_score DECIMAL(5,2), -- puntaje de coincidencia (0-100)
  status TEXT DEFAULT 'recommended', -- 'recommended', 'accepted', 'declined'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(client_id, accountant_id),
  CONSTRAINT check_recommendation_status CHECK (status IN ('recommended', 'accepted', 'declined'))
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_created_at ON clients(created_at DESC);
CREATE INDEX idx_accountants_active ON accountants(is_active) WHERE is_active = true;
CREATE INDEX idx_client_services_client_id ON client_services(client_id);
CREATE INDEX idx_client_services_service_id ON client_services(service_id);
CREATE INDEX idx_accountant_services_accountant_id ON accountant_services(accountant_id);
CREATE INDEX idx_accountant_services_service_id ON accountant_services(service_id);
CREATE INDEX idx_recommendations_client_id ON recommendations(client_id);
CREATE INDEX idx_recommendations_accountant_id ON recommendations(accountant_id);

-- Políticas RLS (Row Level Security) para seguridad
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

-- Políticas para clients (permitir operaciones públicas completas)
CREATE POLICY "Allow all operations on clients" ON clients
  FOR ALL USING (true) WITH CHECK (true);

-- Políticas para client_services
CREATE POLICY "Allow all operations on client_services" ON client_services
  FOR ALL USING (true) WITH CHECK (true);

-- Políticas para recommendations
CREATE POLICY "Allow all operations on recommendations" ON recommendations
  FOR ALL USING (true) WITH CHECK (true);

-- Función para calcular el match score entre cliente y contador
CREATE OR REPLACE FUNCTION calculate_match_score(client_uuid UUID, accountant_uuid UUID)
RETURNS DECIMAL(5,2) AS $$
DECLARE
  client_service_count INTEGER;
  matching_services INTEGER;
  match_percentage DECIMAL(5,2);
BEGIN
  -- Contar servicios del cliente
  SELECT COUNT(*) INTO client_service_count
  FROM client_services
  WHERE client_id = client_uuid;

  -- Contar servicios coincidentes
  SELECT COUNT(*) INTO matching_services
  FROM client_services cs
  JOIN accountant_services accs ON cs.service_id = accs.service_id
  WHERE cs.client_id = client_uuid AND accs.accountant_id = accountant_uuid;

  -- Calcular porcentaje de coincidencia
  IF client_service_count > 0 THEN
    match_percentage := (matching_services::DECIMAL / client_service_count::DECIMAL) * 100;
  ELSE
    match_percentage := 0;
  END IF;

  RETURN match_percentage;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar match_score en recomendaciones
CREATE OR REPLACE FUNCTION update_match_score()
RETURNS TRIGGER AS $$
BEGIN
  NEW.match_score := calculate_match_score(NEW.client_id, NEW.accountant_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar match_score automáticamente
CREATE TRIGGER trigger_update_match_score
  BEFORE INSERT OR UPDATE ON recommendations
  FOR EACH ROW EXECUTE FUNCTION update_match_score();

-- ==========================================
-- PASO 2: INSERTAR DATOS INICIALES
-- ==========================================

-- Insertar servicios principales
INSERT INTO services (name, category, description) VALUES
('Registro en Cámara de Comercio de Medellín', 'main', 'Registro mercantil y trámites ante la Cámara de Comercio'),
('Trámites ante la DIAN', 'main', 'Registro RUT, declaraciones y consultas tributarias'),
('Contabilidad para e-commerce', 'main', 'Contabilidad especializada para tiendas online'),
('Asesoría para urgencias', 'main', 'Atención inmediata para situaciones contables urgentes'),
('Declaraciones atrasadas', 'main', 'Regularización de declaraciones tributarias vencidas'),
('Acompañamiento mensual', 'main', 'Servicio de contabilidad mensual completo'),
('Conciliación de pasarelas', 'main', 'Conciliación bancaria de pagos electrónicos'),
('Constitución de empresa', 'main', 'Creación y registro de nuevas empresas');

-- Insertar servicios relacionados
INSERT INTO services (name, category, description) VALUES
('Registro Mercantil', 'related', 'Registro de empresa en Cámara de Comercio'),
('Actualización RUT', 'related', 'Actualización de datos en el RUT de la DIAN'),
('Certificaciones', 'related', 'Expedición de certificados comerciales'),
('Renovación Matrícula', 'related', 'Renovación de matrícula mercantil'),
('Certificado de Existencia', 'related', 'Certificado tributario de existencia'),
('Consultas Tributarias', 'related', 'Consultas y asesorías tributarias'),
('Shopify', 'related', 'Contabilidad especializada para Shopify'),
('WooCommerce', 'related', 'Contabilidad especializada para WooCommerce'),
('Mercado Libre', 'related', 'Contabilidad especializada para Mercado Libre'),
('Amazon', 'related', 'Contabilidad especializada para Amazon'),
('Stripe', 'related', 'Conciliación de pagos con Stripe'),
('PayPal', 'related', 'Conciliación de pagos con PayPal'),
('Wompi', 'related', 'Conciliación de pagos con Wompi'),
('PayU', 'related', 'Conciliación de pagos con PayU'),
('S.A.S.', 'related', 'Constitución de Sociedad por Acciones Simplificada'),
('Ltda.', 'related', 'Constitución de Limitada'),
('Persona Natural', 'related', 'Registro como contribuyente persona natural'),
('Contabilidad', 'related', 'Servicios generales de contabilidad'),
('Impuestos', 'related', 'Asesoría y gestión tributaria'),
('Nómina', 'related', 'Administración de nómina y pagos'),
('Reportes', 'related', 'Elaboración de reportes financieros');

-- Insertar contadores de ejemplo
INSERT INTO accountants (name, email, phone, specialty, experience_years, rating, bio) VALUES
('María González', 'maria.gonzalez@contadoresmc.com', '3001234567', 'E-commerce & Pasarelas', 8, 4.9, 'Especialista en contabilidad digital y conciliación de pasarelas de pago. Más de 8 años ayudando a emprendedores online.'),
('Carlos Ramírez', 'carlos.ramirez@contadoresmc.com', '3002345678', 'Constitución & Asesoría', 12, 4.8, 'Experto en constitución de empresas y asesoría tributaria. 12 años de experiencia en el sector empresarial.'),
('Ana Martínez', 'ana.martinez@contadoresmc.com', '3003456789', 'Contabilidad Mensual', 10, 4.9, 'Contadora especializada en servicios mensuales para pymes. 10 años optimizando procesos contables.'),
('Pedro López', 'pedro.lopez@contadoresmc.com', '3004567890', 'DIAN & Tributario', 15, 4.7, 'Especialista en trámites ante la DIAN y planificación tributaria. Más de 15 años en el sector.'),
('Laura Torres', 'laura.torres@contadoresmc.com', '3005678901', 'Cámara de Comercio', 9, 4.8, 'Experta en registros mercantiles y renovaciones. 9 años facilitando trámites comerciales.'),
('Juan Pérez', 'juan.perez@contadoresmc.com', '3006789012', 'Urgencias Contables', 11, 4.6, 'Disponible para situaciones de urgencia y declaraciones atrasadas. 11 años de experiencia.');

-- Asignar servicios a contadores (ejemplos)
INSERT INTO accountant_services (accountant_id, service_id) VALUES
-- María González - E-commerce & Pasarelas
((SELECT id FROM accountants WHERE name = 'María González'), (SELECT id FROM services WHERE name = 'Contabilidad para e-commerce')),
((SELECT id FROM accountants WHERE name = 'María González'), (SELECT id FROM services WHERE name = 'Conciliación de pasarelas')),
((SELECT id FROM accountants WHERE name = 'María González'), (SELECT id FROM services WHERE name = 'Shopify')),
((SELECT id FROM accountants WHERE name = 'María González'), (SELECT id FROM services WHERE name = 'WooCommerce')),
((SELECT id FROM accountants WHERE name = 'María González'), (SELECT id FROM services WHERE name = 'Stripe')),
((SELECT id FROM accountants WHERE name = 'María González'), (SELECT id FROM services WHERE name = 'PayPal')),

-- Carlos Ramírez - Constitución & Asesoría
((SELECT id FROM accountants WHERE name = 'Carlos Ramírez'), (SELECT id FROM services WHERE name = 'Constitución de empresa')),
((SELECT id FROM accountants WHERE name = 'Carlos Ramírez'), (SELECT id FROM services WHERE name = 'Registro en Cámara de Comercio de Medellín')),
((SELECT id FROM accountants WHERE name = 'Carlos Ramírez'), (SELECT id FROM services WHERE name = 'Trámites ante la DIAN')),
((SELECT id FROM accountants WHERE name = 'Carlos Ramírez'), (SELECT id FROM services WHERE name = 'S.A.S.')),
((SELECT id FROM accountants WHERE name = 'Carlos Ramírez'), (SELECT id FROM services WHERE name = 'Ltda.')),

-- Ana Martínez - Contabilidad Mensual
((SELECT id FROM accountants WHERE name = 'Ana Martínez'), (SELECT id FROM services WHERE name = 'Acompañamiento mensual')),
((SELECT id FROM accountants WHERE name = 'Ana Martínez'), (SELECT id FROM services WHERE name = 'Contabilidad')),
((SELECT id FROM accountants WHERE name = 'Ana Martínez'), (SELECT id FROM services WHERE name = 'Impuestos')),
((SELECT id FROM accountants WHERE name = 'Ana Martínez'), (SELECT id FROM services WHERE name = 'Nómina')),
((SELECT id FROM accountants WHERE name = 'Ana Martínez'), (SELECT id FROM services WHERE name = 'Reportes')),

-- Pedro López - DIAN & Tributario
((SELECT id FROM accountants WHERE name = 'Pedro López'), (SELECT id FROM services WHERE name = 'Trámites ante la DIAN')),
((SELECT id FROM accountants WHERE name = 'Pedro López'), (SELECT id FROM services WHERE name = 'Actualización RUT')),
((SELECT id FROM accountants WHERE name = 'Pedro López'), (SELECT id FROM services WHERE name = 'Certificado de Existencia')),
((SELECT id FROM accountants WHERE name = 'Pedro López'), (SELECT id FROM services WHERE name = 'Consultas Tributarias')),
((SELECT id FROM accountants WHERE name = 'Pedro López'), (SELECT id FROM services WHERE name = 'Declaraciones atrasadas')),

-- Laura Torres - Cámara de Comercio
((SELECT id FROM accountants WHERE name = 'Laura Torres'), (SELECT id FROM services WHERE name = 'Registro en Cámara de Comercio de Medellín')),
((SELECT id FROM accountants WHERE name = 'Laura Torres'), (SELECT id FROM services WHERE name = 'Registro Mercantil')),
((SELECT id FROM accountants WHERE name = 'Laura Torres'), (SELECT id FROM services WHERE name = 'Certificaciones')),
((SELECT id FROM accountants WHERE name = 'Laura Torres'), (SELECT id FROM services WHERE name = 'Renovación Matrícula')),

-- Juan Pérez - Urgencias
((SELECT id FROM accountants WHERE name = 'Juan Pérez'), (SELECT id FROM services WHERE name = 'Asesoría para urgencias')),
((SELECT id FROM accountants WHERE name = 'Juan Pérez'), (SELECT id FROM services WHERE name = 'Declaraciones atrasadas')),
((SELECT id FROM accountants WHERE name = 'Juan Pérez'), (SELECT id FROM services WHERE name = 'Trámites ante la DIAN')),
((SELECT id FROM accountants WHERE name = 'Juan Pérez'), (SELECT id FROM services WHERE name = 'Registro en Cámara de Comercio de Medellín'));

-- ==========================================
-- SETUP COMPLETADO
-- ==========================================

-- Verificar que todo se creó correctamente
SELECT 'Services created:' as info, COUNT(*) as count FROM services
UNION ALL
SELECT 'Accountants created:', COUNT(*) FROM accountants
UNION ALL
SELECT 'Accountant services:', COUNT(*) FROM accountant_services;