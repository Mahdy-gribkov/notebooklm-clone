-- New table for individual files within notebooks
CREATE TABLE notebook_files (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notebook_id  UUID REFERENCES notebooks(id) ON DELETE CASCADE NOT NULL,
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  file_name    TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'processing'
    CHECK (status IN ('processing', 'ready', 'error')),
  page_count   INTEGER,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX ON notebook_files (notebook_id);
ALTER TABLE notebook_files ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_notebook_files" ON notebook_files
  FOR ALL USING (auth.uid() = user_id);

-- Make file_url nullable (empty notebooks won't have one)
ALTER TABLE notebooks ALTER COLUMN file_url DROP NOT NULL;

-- Migrate existing notebooks into notebook_files
INSERT INTO notebook_files (notebook_id, user_id, file_name, storage_path, status, page_count, created_at)
SELECT n.id, n.user_id,
  CASE WHEN n.file_url LIKE '%/%'
    THEN substring(n.file_url from '[^/]+$')
    ELSE n.file_url END,
  n.file_url, n.status, n.page_count, n.created_at
FROM notebooks n WHERE n.file_url IS NOT NULL;
