-- Skema database Supabase untuk Sistem Manajemen Stok
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'staff')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  sku text NOT NULL,
  category text NOT NULL,
  stock integer NOT NULL DEFAULT 0,
  unit text NOT NULL,
  location text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.settings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  telegram_bot_token text,
  telegram_chat_id text,
  notifications_enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Dummy data user (admin & staff)
INSERT INTO public.users (id, email, role, created_at) VALUES
  ('11111111-1111-1111-1111-111111111111', 'admin@stok.local', 'admin', now()),
  ('22222222-2222-2222-2222-222222222222', 'staff@stok.local', 'staff', now())
ON CONFLICT (id) DO NOTHING;

-- Dummy data barang
INSERT INTO public.items (id, name, sku, category, stock, unit, location, created_at, updated_at) VALUES
  (uuid_generate_v4(), 'Kertas A4 80gsm', 'PRD-001', 'ATK', 120, 'rim', 'Gudang Utama', now(), now()),
  (uuid_generate_v4(), 'Tinta Printer Hitam', 'PRD-002', 'ATK', 8, 'botol', 'Gudang Utama', now(), now()),
  (uuid_generate_v4(), 'Mouse Wireless', 'PRD-003', 'Elektronik', 15, 'pcs', 'Rak 2A', now(), now()),
  (uuid_generate_v4(), 'Keyboard Mekanik', 'PRD-004', 'Elektronik', 4, 'pcs', 'Rak 2B', now(), now()),
  (uuid_generate_v4(), 'Harddisk Eksternal 1TB', 'PRD-005', 'Elektronik', 12, 'pcs', 'Rak 3C', now(), now()),
  (uuid_generate_v4(), 'Bolpoin Gel Hitam', 'PRD-006', 'ATK', 200, 'pcs', 'Gudang Cabang', now(), now()),
  (uuid_generate_v4(), 'Amplop Cokelat F4', 'PRD-007', 'ATK', 30, 'pcs', 'Gudang Cabang', now(), now()),
  (uuid_generate_v4(), 'Laptop 14"', 'PRD-008', 'Elektronik', 6, 'unit', 'Rak 4A', now(), now()),
  (uuid_generate_v4(), 'Scanner Dokumen', 'PRD-009', 'Elektronik', 3, 'unit', 'Rak 4B', now(), now()),
  (uuid_generate_v4(), 'Label Thermal', 'PRD-010', 'Operasional', 50, 'roll', 'Gudang Utama', now(), now())
ON CONFLICT (id) DO NOTHING;

-- Dummy settings
INSERT INTO public.settings (id, telegram_bot_token, telegram_chat_id, notifications_enabled, created_at, updated_at)
VALUES (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '123456:TEST_TOKEN',
  '-1001234567890',
  true,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.category_thresholds (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  category text UNIQUE NOT NULL,
  min_stock integer NOT NULL DEFAULT 5,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Dummy data thresholds
INSERT INTO public.category_thresholds (category, min_stock) VALUES
  ('ATK', 10),
  ('Elektronik', 5),
  ('Operasional', 5)
ON CONFLICT (category) DO UPDATE SET min_stock = EXCLUDED.min_stock;
