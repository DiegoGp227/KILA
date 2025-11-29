-- Tabla de usuarios (login)
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- NUNCA guardes passwords en texto plano
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de validaciones de facturas
CREATE TABLE validaciones_facturas (
    id SERIAL PRIMARY KEY,
    factura_id VARCHAR(100) NOT NULL, -- el ID que identifica la factura
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    fecha_validacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paso BOOLEAN NOT NULL,
    errores JSONB DEFAULT '[]'::jsonb,
    advertencias JSONB DEFAULT '[]'::jsonb,
    datos_factura JSONB, -- opcional: si quieres guardar snapshot de la factura validada
    
    CONSTRAINT validaciones_facturas_pkey PRIMARY KEY (id)
);

-- Índices
CREATE INDEX idx_validaciones_factura_id ON validaciones_facturas(factura_id);
CREATE INDEX idx_validaciones_fecha ON validaciones_facturas(fecha_validacion DESC);
CREATE INDEX idx_validaciones_usuario ON validaciones_facturas(usuario_id);
CREATE INDEX idx_validaciones_paso ON validaciones_facturas(paso);
CREATE INDEX idx_errores_gin ON validaciones_facturas USING GIN (errores);
CREATE INDEX idx_advertencias_gin ON validaciones_facturas USING GIN (advertencias);