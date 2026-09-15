CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  totp_secret text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  token_hash text UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS admin_sessions_token_idx ON admin_sessions(token_hash);

CREATE TABLE IF NOT EXISTS admin_password_resets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  token_hash text UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES product_categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  short_description text NOT NULL DEFAULT '',
  ingredients text NOT NULL DEFAULT '',
  allergens text NOT NULL DEFAULT '',
  price_unit integer,
  availability_status text NOT NULL DEFAULT 'available' CHECK (availability_status IN ('available','on_request','unavailable')),
  availability_note text NOT NULL DEFAULT '',
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_price_history (
  id bigserial PRIMARY KEY,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  price_unit integer NOT NULL,
  valid_from timestamptz NOT NULL DEFAULT now(),
  changed_by uuid REFERENCES admin_users(id) ON DELETE SET NULL
);

CREATE SEQUENCE IF NOT EXISTS quote_seq START 1;
CREATE TABLE IF NOT EXISTS quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid REFERENCES horeca_requests(id) ON DELETE SET NULL,
  quote_number text UNIQUE NOT NULL DEFAULT ('COT-' || to_char(CURRENT_DATE,'YYYY') || '-' || lpad(nextval('quote_seq')::text,4,'0')),
  client_name text NOT NULL,
  company text NOT NULL,
  rut text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  billing_business_name text,
  billing_rut text,
  billing_activity text,
  billing_address text,
  billing_commune text,
  delivery_mode text NOT NULL CHECK (delivery_mode IN ('retiro','despacho')),
  delivery_date date NOT NULL,
  time_slot text NOT NULL,
  shipping_amount integer NOT NULL DEFAULT 0,
  subtotal_net integer NOT NULL DEFAULT 0,
  vat_amount integer NOT NULL DEFAULT 0,
  total_gross integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'draft',
  valid_until date NOT NULL,
  accepted_at timestamptz,
  rejected_at timestamptz,
  rejection_reason text,
  acceptance_ip inet,
  public_token_hash text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS quote_items (
  id bigserial PRIMARY KEY,
  quote_id uuid NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  quantity integer NOT NULL,
  unit_price_gross integer NOT NULL,
  line_total_gross integer NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS order_seq START 1;
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id uuid UNIQUE REFERENCES quotes(id) ON DELETE SET NULL,
  order_number text UNIQUE NOT NULL DEFAULT ('PED-' || to_char(CURRENT_DATE,'YYYY') || '-' || lpad(nextval('order_seq')::text,4,'0')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','in_production','ready','dispatched','picked_up','completed','cancelled')),
  delivery_mode text NOT NULL CHECK (delivery_mode IN ('retiro','despacho')),
  delivery_date date NOT NULL,
  time_slot text NOT NULL,
  total_units integer NOT NULL,
  total_gross integer NOT NULL DEFAULT 0,
  tracking_token_hash text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS orders_delivery_date_idx ON orders(delivery_date);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status);

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  payment_stage text NOT NULL CHECK (payment_stage IN ('deposit','balance','refund')),
  amount integer NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','proof_received','confirmed','rejected','refunded')),
  proof_url text,
  rejection_reason text,
  confirmed_by uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  confirmed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  document_type text NOT NULL CHECK (document_type IN ('quote_pdf','order_pdf','invoice_pdf','invoice_xml','credit_note_pdf','credit_note_xml','debit_note_pdf','debit_note_xml')),
  document_number text,
  file_url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS blocked_dates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blocked_date date NOT NULL,
  block_type text NOT NULL DEFAULT 'all' CHECK (block_type IN ('all','pickup','delivery')),
  reason text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(blocked_date, block_type)
);

CREATE TABLE IF NOT EXISTS site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS content_entries (
  key text PRIMARY KEY,
  published_content jsonb,
  draft_content jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz
);

CREATE TABLE IF NOT EXISTS content_versions (
  id bigserial PRIMARY KEY,
  content_key text NOT NULL,
  content jsonb NOT NULL,
  version_type text NOT NULL CHECK (version_type IN ('draft','published','restored')),
  created_by uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  attachment_url text,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','reviewing','replied','archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO product_categories(name, slug, sort_order)
VALUES ('Croissants','croissants',10),('Rollos de hojaldre','rollos-hojaldre',20)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO site_settings(key, value) VALUES
  ('daily_capacity', '150'::jsonb),
  ('shipping_fee', '2500'::jsonb),
  ('minimum_order_units', '36'::jsonb),
  ('maximum_order_units', '96'::jsonb),
  ('order_multiple', '6'::jsonb),
  ('minimum_notice_hours', '72'::jsonb),
  ('quote_validity_days', '10'::jsonb),
  ('deposit_percentage', '50'::jsonb),
  ('deposit_payment_window_hours', '24'::jsonb)
ON CONFLICT (key) DO NOTHING;
