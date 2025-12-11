-- Esquema de base de datos para Landing MC - Sistema de Contadores
-- Ejecutar en Supabase SQL Editor

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

-- Políticas para clients (solo admin puede leer todos, pero podemos crear una vista pública)
CREATE POLICY "Allow public to insert clients" ON clients
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated to read clients" ON clients
  FOR SELECT USING (auth.role() = 'authenticated');

-- Políticas para client_services
CREATE POLICY "Allow public to insert client_services" ON client_services
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated to read client_services" ON client_services
  FOR SELECT USING (auth.role() = 'authenticated');

-- Políticas para recommendations
CREATE POLICY "Allow authenticated to manage recommendations" ON recommendations
  FOR ALL USING (auth.role() = 'authenticated');

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