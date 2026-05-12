CREATE OR REPLACE FUNCTION public.set_profiles_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET SEARCH_PATH = ''
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

-- trigger (keep as-is)
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;

CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.set_profiles_updated_at();