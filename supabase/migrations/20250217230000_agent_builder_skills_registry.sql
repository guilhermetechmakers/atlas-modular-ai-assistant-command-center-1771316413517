-- agent_builder_skills_registry table (Agent Builder / Skills Registry)
-- Valid table name: agent_builder_skills_registry (slash in spec name not valid in SQL)
CREATE TABLE IF NOT EXISTS agent_builder_skills_registry (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE agent_builder_skills_registry ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "agent_builder_skills_registry_read_own" ON agent_builder_skills_registry
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own data
CREATE POLICY "agent_builder_skills_registry_insert_own" ON agent_builder_skills_registry
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own data
CREATE POLICY "agent_builder_skills_registry_update_own" ON agent_builder_skills_registry
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own data
CREATE POLICY "agent_builder_skills_registry_delete_own" ON agent_builder_skills_registry
  FOR DELETE USING (auth.uid() = user_id);
