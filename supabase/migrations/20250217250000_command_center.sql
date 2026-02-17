-- command_center table (dashboard / command center scope)
CREATE TABLE IF NOT EXISTS command_center (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE command_center ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "command_center_read_own" ON command_center
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own data
CREATE POLICY "command_center_insert_own" ON command_center
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own data
CREATE POLICY "command_center_update_own" ON command_center
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own data
CREATE POLICY "command_center_delete_own" ON command_center
  FOR DELETE USING (auth.uid() = user_id);
