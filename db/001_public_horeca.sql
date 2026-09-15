CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE SEQUENCE IF NOT EXISTS horeca_request_seq START 1;

CREATE TABLE IF NOT EXISTS horeca_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  public_code text UNIQUE NOT NULL DEFAULT (
    'SOL-' || to_char(CURRENT_DATE, 'YYYY') || '-' || lpad(nextval('horeca_request_seq')::text, 5, '0')
  ),
  name text NOT NULL,
  company text NOT NULL,
  rut text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  commune text NOT NULL,
  product_format text NOT NULL CHECK (product_format IN ('fresco','congelado','ambos')),
  delivery_mode text NOT NULL CHECK (delivery_mode IN ('retiro','despacho')),
  requested_date date NOT NULL,
  time_slot text NOT NULL,
  message text NOT NULL DEFAULT '',
  total_units integer NOT NULL CHECK (total_units BETWEEN 36 AND 96),
  shipping_amount integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'new',
  accepted_terms_at timestamptz NOT NULL,
  accepted_terms_ip inet,
  terms_version text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS horeca_request_items (
  id bigserial PRIMARY KEY,
  request_id uuid NOT NULL REFERENCES horeca_requests(id) ON DELETE CASCADE,
  product_key text NOT NULL,
  product_name text NOT NULL,
  quantity integer NOT NULL CHECK (quantity >= 6 AND quantity % 6 = 0)
);

CREATE INDEX IF NOT EXISTS horeca_requests_created_at_idx ON horeca_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS horeca_requests_status_idx ON horeca_requests(status);
CREATE INDEX IF NOT EXISTS horeca_requests_requested_date_idx ON horeca_requests(requested_date);
