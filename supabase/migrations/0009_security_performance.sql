-- 0009_security_performance.sql
-- Security: fix RLS per-row re-evaluation, add WITH CHECK, set search_path on match_chunks
-- Performance: add missing indexes on user_id FKs, composite indexes, GIN index on metadata

-- =============================================================================
-- 1. Fix RLS policies: (select auth.uid()) + WITH CHECK
-- =============================================================================

-- notebooks
DROP POLICY IF EXISTS "user_notebooks" ON notebooks;
CREATE POLICY "user_notebooks" ON notebooks FOR ALL
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- chunks
DROP POLICY IF EXISTS "user_chunks" ON chunks;
CREATE POLICY "user_chunks" ON chunks FOR ALL
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- messages
DROP POLICY IF EXISTS "user_messages" ON messages;
CREATE POLICY "user_messages" ON messages FOR ALL
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- notebook_files
DROP POLICY IF EXISTS "user_notebook_files" ON notebook_files;
CREATE POLICY "user_notebook_files" ON notebook_files FOR ALL
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- notes
DROP POLICY IF EXISTS "user_notes" ON notes;
CREATE POLICY "user_notes" ON notes FOR ALL
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- studio_generations
DROP POLICY IF EXISTS "user_generations" ON studio_generations;
CREATE POLICY "user_generations" ON studio_generations FOR ALL
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- =============================================================================
-- 2. Fix match_chunks: add SET search_path = public
-- =============================================================================

DROP FUNCTION IF EXISTS match_chunks(vector, uuid, uuid, int, float);

CREATE OR REPLACE FUNCTION match_chunks(
  query_embedding vector(768),
  match_notebook_id uuid,
  match_user_id uuid,
  match_count int DEFAULT 5,
  match_threshold float DEFAULT 0.5
)
RETURNS TABLE (id uuid, content text, similarity float, metadata jsonb)
LANGUAGE sql STABLE
SET search_path = public
AS $$
  SELECT chunks.id, chunks.content,
    1 - (chunks.embedding <=> query_embedding) AS similarity,
    chunks.metadata
  FROM chunks
  WHERE chunks.notebook_id = match_notebook_id
    AND chunks.user_id = match_user_id
    AND 1 - (chunks.embedding <=> query_embedding) > match_threshold
  ORDER BY chunks.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- =============================================================================
-- 3. Missing indexes on user_id foreign keys
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_notebooks_user_id ON notebooks (user_id);
CREATE INDEX IF NOT EXISTS idx_chunks_user_id ON chunks (user_id);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages (user_id);
CREATE INDEX IF NOT EXISTS idx_notebook_files_user_id ON notebook_files (user_id);
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes (user_id);
CREATE INDEX IF NOT EXISTS idx_studio_generations_user_id ON studio_generations (user_id);

-- =============================================================================
-- 4. Composite indexes for common query patterns
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_chunks_notebook_user ON chunks (notebook_id, user_id);
CREATE INDEX IF NOT EXISTS idx_messages_notebook_user ON messages (notebook_id, user_id);
CREATE INDEX IF NOT EXISTS idx_notebook_files_notebook_user ON notebook_files (notebook_id, user_id);
CREATE INDEX IF NOT EXISTS idx_notes_notebook_user ON notes (notebook_id, user_id);

-- =============================================================================
-- 5. GIN index on chunks.metadata for JSONB queries
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_chunks_metadata_gin ON chunks USING GIN (metadata);

-- =============================================================================
-- 6. Storage bucket RLS policy (enforces user_id/ path prefix)
-- =============================================================================
-- NOTE: This requires the "pdf-uploads" bucket to already exist.
-- If it fails, create the bucket first via Supabase dashboard.

CREATE POLICY "Users access own PDFs" ON storage.objects
  FOR ALL
  USING (
    bucket_id = 'pdf-uploads'
    AND (storage.foldername(name))[1] = (select auth.uid())::text
  )
  WITH CHECK (
    bucket_id = 'pdf-uploads'
    AND (storage.foldername(name))[1] = (select auth.uid())::text
  );
