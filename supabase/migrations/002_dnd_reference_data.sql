-- Create D&D 5e reference data tables

CREATE TABLE IF NOT EXISTS public.dnd_races (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  index TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT[],
  ability_bonuses JSONB,
  traits JSONB
);

CREATE TABLE IF NOT EXISTS public.dnd_subraces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  index TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  race_index TEXT NOT NULL REFERENCES public.dnd_races(index) ON DELETE CASCADE,
  ability_bonuses JSONB,
  traits JSONB
);

CREATE TABLE IF NOT EXISTS public.dnd_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  index TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  hit_die INTEGER,
  subclass_level INTEGER,
  proficiency_choices JSONB
);

CREATE TABLE IF NOT EXISTS public.dnd_class_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_index TEXT NOT NULL REFERENCES public.dnd_classes(index) ON DELETE CASCADE,
  level INTEGER NOT NULL,
  features JSONB,
  UNIQUE(class_index, level)
);

CREATE TABLE IF NOT EXISTS public.dnd_subclasses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  index TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  class_index TEXT NOT NULL REFERENCES public.dnd_classes(index) ON DELETE CASCADE,
  description TEXT[],
  subclass_flavor TEXT
);

CREATE TABLE IF NOT EXISTS public.dnd_subclass_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subclass_index TEXT NOT NULL REFERENCES public.dnd_subclasses(index) ON DELETE CASCADE,
  level INTEGER NOT NULL,
  features JSONB,
  UNIQUE(subclass_index, level)
);

CREATE TABLE IF NOT EXISTS public.dnd_backgrounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  index TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  feature JSONB,
  personality_traits JSONB,
  ideals JSONB,
  bonds JSONB,
  flaws JSONB
);

CREATE TABLE IF NOT EXISTS public.dnd_languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  index TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  type TEXT
);

-- Indexes for foreign keys
CREATE INDEX IF NOT EXISTS idx_dnd_subraces_race_index ON public.dnd_subraces(race_index);
CREATE INDEX IF NOT EXISTS idx_dnd_class_levels_class_index ON public.dnd_class_levels(class_index);
CREATE INDEX IF NOT EXISTS idx_dnd_subclasses_class_index ON public.dnd_subclasses(class_index);
CREATE INDEX IF NOT EXISTS idx_dnd_subclass_levels_subclass_index ON public.dnd_subclass_levels(subclass_index);

-- Grant full access to service_role (for seeding scripts)
GRANT ALL ON public.dnd_races TO service_role;
GRANT ALL ON public.dnd_subraces TO service_role;
GRANT ALL ON public.dnd_classes TO service_role;
GRANT ALL ON public.dnd_class_levels TO service_role;
GRANT ALL ON public.dnd_subclasses TO service_role;
GRANT ALL ON public.dnd_subclass_levels TO service_role;
GRANT ALL ON public.dnd_backgrounds TO service_role;
GRANT ALL ON public.dnd_languages TO service_role;

-- Grant read access to authenticated and anon roles
GRANT SELECT ON public.dnd_races TO authenticated, anon;
GRANT SELECT ON public.dnd_subraces TO authenticated, anon;
GRANT SELECT ON public.dnd_classes TO authenticated, anon;
GRANT SELECT ON public.dnd_class_levels TO authenticated, anon;
GRANT SELECT ON public.dnd_subclasses TO authenticated, anon;
GRANT SELECT ON public.dnd_subclass_levels TO authenticated, anon;
GRANT SELECT ON public.dnd_backgrounds TO authenticated, anon;
GRANT SELECT ON public.dnd_languages TO authenticated, anon;

-- Enable RLS
ALTER TABLE public.dnd_races ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dnd_subraces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dnd_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dnd_class_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dnd_subclasses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dnd_subclass_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dnd_backgrounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dnd_languages ENABLE ROW LEVEL SECURITY;

-- Read-only policies for authenticated users
CREATE POLICY "Authenticated users can read dnd_races"
  ON public.dnd_races
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read dnd_subraces"
  ON public.dnd_subraces
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read dnd_classes"
  ON public.dnd_classes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read dnd_class_levels"
  ON public.dnd_class_levels
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read dnd_subclasses"
  ON public.dnd_subclasses
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read dnd_subclass_levels"
  ON public.dnd_subclass_levels
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read dnd_backgrounds"
  ON public.dnd_backgrounds
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read dnd_languages"
  ON public.dnd_languages
  FOR SELECT
  TO authenticated
  USING (true);
