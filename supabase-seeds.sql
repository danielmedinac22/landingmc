-- Datos iniciales para Landing MC
-- Ejecutar después del esquema

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