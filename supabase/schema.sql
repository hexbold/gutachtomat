-- Gutachtomat Database Schema
-- Run this SQL in your Supabase SQL Editor to set up the database

-- Enable UUID extension (usually already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Custom type for gutachten status
CREATE TYPE gutachten_status AS ENUM ('draft', 'completed');

-- Main table for Gutachten
-- Note: All sensitive data is client-side encrypted (stored as base64 strings)
CREATE TABLE gutachten (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,  -- Clerk user ID (string format)

  -- Queryable metadata (plaintext) - non-sensitive
  status gutachten_status NOT NULL DEFAULT 'draft',
  wizard_step INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  save_version INTEGER NOT NULL DEFAULT 1,
  schema_version INTEGER NOT NULL DEFAULT 1,

  -- Encrypted patient identifier (for dashboard list display)
  -- Stored separately for faster list loading (don't need to decrypt full data)
  encrypted_chiffre TEXT,         -- Base64 encrypted patient chiffre
  encrypted_chiffre_iv TEXT,      -- IV for chiffre decryption

  -- Encrypted form data and generated text
  -- Contains: form JSON, generated markdown, wizard state
  encrypted_data TEXT,            -- Base64 encrypted data blob
  encrypted_data_iv TEXT          -- IV for data decryption
);

-- Row Level Security: Users can only access their own rows
ALTER TABLE gutachten ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only SELECT their own gutachten
CREATE POLICY "Users can view own gutachten"
  ON gutachten FOR SELECT
  USING (user_id = (auth.jwt()->>'sub')::text);

-- RLS Policy: Users can only INSERT their own gutachten
CREATE POLICY "Users can insert own gutachten"
  ON gutachten FOR INSERT
  WITH CHECK (user_id = (auth.jwt()->>'sub')::text);

-- RLS Policy: Users can only UPDATE their own gutachten
CREATE POLICY "Users can update own gutachten"
  ON gutachten FOR UPDATE
  USING (user_id = (auth.jwt()->>'sub')::text);

-- RLS Policy: Users can only DELETE their own gutachten
CREATE POLICY "Users can delete own gutachten"
  ON gutachten FOR DELETE
  USING (user_id = (auth.jwt()->>'sub')::text);

-- Indexes for common queries
CREATE INDEX idx_gutachten_user_id ON gutachten(user_id);
CREATE INDEX idx_gutachten_user_status ON gutachten(user_id, status);
CREATE INDEX idx_gutachten_user_updated ON gutachten(user_id, updated_at DESC);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update updated_at on row update
CREATE TRIGGER update_gutachten_updated_at
    BEFORE UPDATE ON gutachten
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions (Supabase handles this automatically, but explicit for clarity)
-- The anon and authenticated roles need SELECT, INSERT, UPDATE, DELETE
-- RLS policies will filter the actual access
GRANT SELECT, INSERT, UPDATE, DELETE ON gutachten TO anon, authenticated;


-- =============================================================================
-- COPY-PASTE FRIENDLY VERSION (no comments - avoids encoding issues)
-- =============================================================================
/*
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE gutachten_status AS ENUM ('draft', 'completed');

CREATE TABLE gutachten (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  status gutachten_status NOT NULL DEFAULT 'draft',
  wizard_step INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  save_version INTEGER NOT NULL DEFAULT 1,
  schema_version INTEGER NOT NULL DEFAULT 1,
  encrypted_chiffre TEXT,
  encrypted_chiffre_iv TEXT,
  encrypted_data TEXT,
  encrypted_data_iv TEXT
);

ALTER TABLE gutachten ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own gutachten"
  ON gutachten FOR SELECT
  USING (user_id = (auth.jwt()->>'sub')::text);

CREATE POLICY "Users can insert own gutachten"
  ON gutachten FOR INSERT
  WITH CHECK (user_id = (auth.jwt()->>'sub')::text);

CREATE POLICY "Users can update own gutachten"
  ON gutachten FOR UPDATE
  USING (user_id = (auth.jwt()->>'sub')::text);

CREATE POLICY "Users can delete own gutachten"
  ON gutachten FOR DELETE
  USING (user_id = (auth.jwt()->>'sub')::text);

CREATE INDEX idx_gutachten_user_id ON gutachten(user_id);
CREATE INDEX idx_gutachten_user_status ON gutachten(user_id, status);
CREATE INDEX idx_gutachten_user_updated ON gutachten(user_id, updated_at DESC);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_gutachten_updated_at
    BEFORE UPDATE ON gutachten
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

GRANT SELECT, INSERT, UPDATE, DELETE ON gutachten TO anon, authenticated;
*/
