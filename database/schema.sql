-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- SPK Table
CREATE TABLE spk (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  spk_number VARCHAR(50) UNIQUE NOT NULL,
  vendor_name VARCHAR(255) NOT NULL,
  vendor_email VARCHAR(255),
  vendor_phone VARCHAR(50),
  project_name VARCHAR(255) NOT NULL,
  project_description TEXT,
  contract_value NUMERIC(15, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'IDR',
  start_date DATE NOT NULL,
  end_date DATE,

  -- Payment breakdown
  dp_percentage NUMERIC(5, 2) NOT NULL,
  dp_amount NUMERIC(15, 2) NOT NULL,
  progress_percentage NUMERIC(5, 2) NOT NULL,
  progress_amount NUMERIC(15, 2) NOT NULL,
  final_percentage NUMERIC(5, 2) NOT NULL,
  final_amount NUMERIC(15, 2) NOT NULL,

  status VARCHAR(20) CHECK(status IN ('draft', 'published')) DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by VARCHAR(255) NOT NULL,
  notes TEXT,
  pdf_url TEXT
);

-- Payment Table
CREATE TABLE payment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  spk_id UUID NOT NULL REFERENCES spk(id) ON DELETE CASCADE,
  term VARCHAR(20) CHECK(term IN ('dp', 'progress', 'final')) NOT NULL,
  amount NUMERIC(15, 2) NOT NULL,
  percentage NUMERIC(5, 2) NOT NULL,
  status VARCHAR(20) CHECK(status IN ('pending', 'paid', 'overdue')) DEFAULT 'pending',
  paid_date DATE,
  payment_reference VARCHAR(255),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by VARCHAR(255) NOT NULL
);

-- Vendor Table (Optional)
CREATE TABLE vendor (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  access_token TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX idx_spk_vendor_name ON spk(vendor_name);
CREATE INDEX idx_spk_status ON spk(status);
CREATE INDEX idx_spk_created_at ON spk(created_at);
CREATE INDEX idx_payment_spk_id ON payment(spk_id);
CREATE INDEX idx_payment_status ON payment(status);
CREATE INDEX idx_vendor_email ON vendor(email);

-- Enable Row Level Security (RLS)
ALTER TABLE spk ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Basic - adjust based on auth strategy)
-- Allow all operations for authenticated users (internal admin)
CREATE POLICY "Allow full access for authenticated users" ON spk
  FOR ALL USING (true);

CREATE POLICY "Allow full access for authenticated users on payment" ON payment
  FOR ALL USING (true);

CREATE POLICY "Allow full access for authenticated users on vendor" ON vendor
  FOR ALL USING (true);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_spk_updated_at BEFORE UPDATE ON spk
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_updated_at BEFORE UPDATE ON payment
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample SPK 1: Office Renovation Project
INSERT INTO spk (
  spk_number, vendor_name, vendor_email, vendor_phone,
  project_name, project_description, contract_value, currency,
  start_date, end_date,
  dp_percentage, dp_amount, progress_percentage, progress_amount,
  final_percentage, final_amount,
  status, created_by, notes
) VALUES (
  'SPK-2026-001',
  'PT Vendor Jaya',
  'vendor@vendorjaya.com',
  '+62-812-3456-7890',
  'Office Renovation Phase 1',
  'Complete renovation of 3rd floor office space including electrical, furniture, and paint',
  100000000,
  'IDR',
  '2026-01-21',
  '2026-03-21',
  30, 30000000,
  40, 40000000,
  30, 30000000,
  'published',
  'admin@company.com',
  'Urgent project - prioritize quality materials'
);

-- Sample SPK 2: Website Development
INSERT INTO spk (
  spk_number, vendor_name, vendor_email, vendor_phone,
  project_name, project_description, contract_value, currency,
  start_date, end_date,
  dp_percentage, dp_amount, progress_percentage, progress_amount,
  final_percentage, final_amount,
  status, created_by, notes
) VALUES (
  'SPK-2026-002',
  'Digital Solutions Indonesia',
  'contact@digitalsolutions.id',
  '+62-821-9876-5432',
  'Corporate Website Redesign',
  'Modern, responsive website with CMS integration and SEO optimization',
  75000000,
  'IDR',
  '2026-01-22',
  '2026-04-22',
  25, 18750000,
  50, 37500000,
  25, 18750000,
  'published',
  'pm@company.com',
  'Requires staging environment for client review'
);

-- Sample SPK 3: Draft Project
INSERT INTO spk (
  spk_number, vendor_name, vendor_email,
  project_name, contract_value, currency,
  start_date,
  dp_percentage, dp_amount, progress_percentage, progress_amount,
  final_percentage, final_amount,
  status, created_by
) VALUES (
  'SPK-2026-003',
  'PT Konstruksi Mandiri',
  'info@konstruksimandiri.com',
  'Parking Lot Expansion',
  150000000,
  'IDR',
  '2026-02-01',
  30, 45000000,
  40, 60000000,
  30, 45000000,
  'draft',
  'admin@company.com'
);

-- Payments for SPK-001 (Office Renovation)
INSERT INTO payment (spk_id, term, amount, percentage, status, paid_date, payment_reference, updated_by)
SELECT
  id, 'dp', 30000000, 30, 'paid', '2026-01-21', 'TRX-20260121-001', 'finance@company.com'
FROM spk WHERE spk_number = 'SPK-2026-001'
UNION ALL
SELECT
  id, 'progress', 40000000, 40, 'pending', NULL, NULL, 'admin@company.com'
FROM spk WHERE spk_number = 'SPK-2026-001'
UNION ALL
SELECT
  id, 'final', 30000000, 30, 'pending', NULL, NULL, 'admin@company.com'
FROM spk WHERE spk_number = 'SPK-2026-001';

-- Payments for SPK-002 (Website Development)
INSERT INTO payment (spk_id, term, amount, percentage, status, paid_date, payment_reference, updated_by)
SELECT
  id, 'dp', 18750000, 25, 'paid', '2026-01-22', 'TRX-20260122-001', 'finance@company.com'
FROM spk WHERE spk_number = 'SPK-2026-002'
UNION ALL
SELECT
  id, 'progress', 37500000, 50, 'pending', NULL, NULL, 'pm@company.com'
FROM spk WHERE spk_number = 'SPK-2026-002'
UNION ALL
SELECT
  id, 'final', 18750000, 25, 'pending', NULL, NULL, 'pm@company.com'
FROM spk WHERE spk_number = 'SPK-2026-002';

-- Payments for SPK-003 (Draft)
INSERT INTO payment (spk_id, term, amount, percentage, status, updated_by)
SELECT
  id, 'dp', 45000000, 30, 'pending', 'admin@company.com'
FROM spk WHERE spk_number = 'SPK-2026-003'
UNION ALL
SELECT
  id, 'progress', 60000000, 40, 'pending', 'admin@company.com'
FROM spk WHERE spk_number = 'SPK-2026-003'
UNION ALL
SELECT
  id, 'final', 45000000, 30, 'pending', 'admin@company.com'
FROM spk WHERE spk_number = 'SPK-2026-003';

-- Sample Vendors
INSERT INTO vendor (name, email, phone, access_token)
VALUES
  ('PT Vendor Jaya', 'vendor@vendorjaya.com', '+62-812-3456-7890', 'token-abc123xyz'),
  ('Digital Solutions Indonesia', 'contact@digitalsolutions.id', '+62-821-9876-5432', 'token-def456uvw'),
  ('PT Konstruksi Mandiri', 'info@konstruksimandiri.com', '+62-811-2233-4455', 'token-ghi789rst');
