-- personal_calendar_travel table (Personal / Calendar & Travel)
CREATE TABLE IF NOT EXISTS personal_calendar_travel (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE personal_calendar_travel ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "personal_calendar_travel_read_own" ON personal_calendar_travel
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own data
CREATE POLICY "personal_calendar_travel_insert_own" ON personal_calendar_travel
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own data
CREATE POLICY "personal_calendar_travel_update_own" ON personal_calendar_travel
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own data
CREATE POLICY "personal_calendar_travel_delete_own" ON personal_calendar_travel
  FOR DELETE USING (auth.uid() = user_id);
