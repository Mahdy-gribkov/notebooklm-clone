-- Migration 0007: Chat Privacy and Hashing Anchor

-- 1. Add is_public to messages to separate private notebook chat from global shared chat
ALTER TABLE messages ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;

-- 2. Add source_hash to notebooks to provide a single source of truth for caching
ALTER TABLE notebooks ADD COLUMN IF NOT EXISTS source_hash TEXT;

-- 3. Update existing featured notebooks with their hash if possible (optimization)
-- Note: This will be populated on next ingestion if left null.
