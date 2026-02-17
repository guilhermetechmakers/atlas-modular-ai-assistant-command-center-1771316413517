-- content_pipeline table
CREATE TABLE IF NOT EXISTS content_pipeline (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE content_pipeline ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "content_pipeline_read_own" ON content_pipeline
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own data
CREATE POLICY "content_pipeline_insert_own" ON content_pipeline
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own data
CREATE POLICY "content_pipeline_update_own" ON content_pipeline
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own data
CREATE POLICY "content_pipeline_delete_own" ON content_pipeline
  FOR DELETE USING (auth.uid() = user_id);
