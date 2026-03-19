-- Create characters table
CREATE TABLE IF NOT EXISTS public.characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Basic info
  name TEXT NOT NULL,
  level INTEGER DEFAULT 1,
  alignment TEXT,
  race TEXT,
  subrace TEXT,
  class TEXT,
  subclass TEXT,
  background TEXT,
  experience_points INTEGER DEFAULT 0,

  -- Abilities (stored as JSON)
  base_abilities JSONB,
  race_bonuses JSONB,
  class_ability_bonuses JSONB,

  -- Character details
  extra_languages JSONB,
  selected_traits JSONB,
  proficiencies JSONB,

  -- Combat stats
  hp TEXT,
  ac INTEGER,
  init INTEGER,
  img TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Grant table permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.characters TO authenticated;

-- Enable RLS
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;

-- Users can only see their own characters
CREATE POLICY "Users can view own characters"
  ON public.characters FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own characters
CREATE POLICY "Users can create own characters"
  ON public.characters FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own characters
CREATE POLICY "Users can update own characters"
  ON public.characters FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own characters
CREATE POLICY "Users can delete own characters"
  ON public.characters FOR DELETE
  USING (auth.uid() = user_id);

-- Index for faster user queries
CREATE INDEX idx_characters_user_id ON public.characters(user_id);
