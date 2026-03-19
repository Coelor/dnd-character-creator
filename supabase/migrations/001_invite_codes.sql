-- Create invite_codes table
CREATE TABLE IF NOT EXISTS public.invite_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  max_uses INTEGER DEFAULT 1,
  current_uses INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT true
);

-- Create index for faster code lookups
CREATE INDEX idx_invite_codes_code ON public.invite_codes(code);
CREATE INDEX idx_invite_codes_active ON public.invite_codes(is_active) WHERE is_active = true;

-- Create invite_code_uses tracking table
CREATE TABLE IF NOT EXISTS public.invite_code_uses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invite_code_id UUID REFERENCES public.invite_codes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  used_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(invite_code_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.invite_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invite_code_uses ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can read active, non-expired invite codes (needed for validation)
CREATE POLICY "Anyone can validate invite codes"
  ON public.invite_codes
  FOR SELECT
  USING (
    is_active = true
    AND (expires_at IS NULL OR expires_at > NOW())
    AND current_uses < max_uses
  );

-- RLS Policy: Only authenticated users can view their own usage
CREATE POLICY "Users can view their own invite code usage"
  ON public.invite_code_uses
  FOR SELECT
  USING (auth.uid() = user_id);

-- Function to validate and use an invite code
CREATE OR REPLACE FUNCTION public.use_invite_code(
  invite_code TEXT,
  user_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  code_record RECORD;
  result JSONB;
BEGIN
  -- Lock the row for update
  SELECT * INTO code_record
  FROM public.invite_codes
  WHERE code = invite_code
  FOR UPDATE;

  -- Check if code exists
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid invite code');
  END IF;

  -- Check if code is active
  IF code_record.is_active = false THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invite code is no longer active');
  END IF;

  -- Check if code has expired
  IF code_record.expires_at IS NOT NULL AND code_record.expires_at < NOW() THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invite code has expired');
  END IF;

  -- Check if code has uses remaining
  IF code_record.current_uses >= code_record.max_uses THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invite code has been fully used');
  END IF;

  -- Check if this user already used this code
  IF EXISTS (
    SELECT 1 FROM public.invite_code_uses
    WHERE invite_code_id = code_record.id AND user_id = use_invite_code.user_id
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'You have already used this invite code');
  END IF;

  -- Record the usage
  INSERT INTO public.invite_code_uses (invite_code_id, user_id)
  VALUES (code_record.id, user_id);

  -- Increment usage counter
  UPDATE public.invite_codes
  SET current_uses = current_uses + 1
  WHERE id = code_record.id;

  RETURN jsonb_build_object('success', true, 'message', 'Invite code successfully used');
END;
$$;

-- Function to check if invite code is valid (without using it)
CREATE OR REPLACE FUNCTION public.validate_invite_code(invite_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  code_record RECORD;
BEGIN
  SELECT * INTO code_record
  FROM public.invite_codes
  WHERE code = invite_code;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Invalid invite code');
  END IF;

  IF code_record.is_active = false THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Invite code is no longer active');
  END IF;

  IF code_record.expires_at IS NOT NULL AND code_record.expires_at < NOW() THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Invite code has expired');
  END IF;

  IF code_record.current_uses >= code_record.max_uses THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Invite code has been fully used');
  END IF;

  RETURN jsonb_build_object('valid', true, 'message', 'Invite code is valid');
END;
$$;

-- Insert a default invite code for initial setup (you should change this!)
INSERT INTO public.invite_codes (code, max_uses, is_active)
VALUES ('WELCOME2024', 10, true)
ON CONFLICT (code) DO NOTHING;
