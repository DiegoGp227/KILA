CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE invoice_validations (
    id SERIAL PRIMARY KEY,
    invoice_id VARCHAR(100) NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    validation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    passed BOOLEAN NOT NULL,
    errors JSONB DEFAULT '[]'::jsonb,
    warnings JSONB DEFAULT '[]'::jsonb,
    invoice_data JSONB NOT NULL,
    
    CONSTRAINT invoice_validations_pkey PRIMARY KEY (id)
);

CREATE INDEX idx_invoice_id ON invoice_validations(invoice_id);
CREATE INDEX idx_validation_date ON invoice_validations(validation_date DESC);
CREATE INDEX idx_user_id ON invoice_validations(user_id);
CREATE INDEX idx_passed ON invoice_validations(passed);
CREATE INDEX idx_errors_gin ON invoice_validations USING GIN (errors);
CREATE INDEX idx_warnings_gin ON invoice_validations USING GIN (warnings);
CREATE INDEX idx_invoice_data_gin ON invoice_validations USING GIN (invoice_data);