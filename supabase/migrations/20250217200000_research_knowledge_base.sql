-- research_knowledge_base table (Research & Knowledge Base)
-- Note: spec referenced "research_&_knowledge_base"; use research_knowledge_base for valid identifier.
CREATE TABLE IF NOT EXISTS research_knowledge_base (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE research_knowledge_base ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "research_knowledge_base_read_own" ON research_knowledge_base
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own data
CREATE POLICY "research_knowledge_base_insert_own" ON research_knowledge_base
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own data
CREATE POLICY "research_knowledge_base_update_own" ON research_knowledge_base
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own data
CREATE POLICY "research_knowledge_base_delete_own" ON research_knowledge_base
  FOR DELETE USING (auth.uid() = user_id);
