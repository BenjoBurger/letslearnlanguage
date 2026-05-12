-- Create lessons table so users can add question/answer entries

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.lessons (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	question text NOT NULL,
	answer text NOT NULL,
	created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lessons are readable by everyone"
ON public.lessons
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Users can insert their own lessons"
ON public.lessons
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own lessons"
ON public.lessons
FOR UPDATE
TO authenticated
USING (auth.uid() = created_by)
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete their own lessons"
ON public.lessons
FOR DELETE
TO authenticated
USING (auth.uid() = created_by);

GRANT SELECT ON public.lessons TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.lessons TO authenticated;

CREATE OR REPLACE FUNCTION public.set_lessons_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET SEARCH_PATH = ''
AS $$
BEGIN
	NEW.updated_at = now();
	RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_lessons_updated_at ON public.lessons;
CREATE TRIGGER set_lessons_updated_at
BEFORE UPDATE ON public.lessons
FOR EACH ROW
EXECUTE FUNCTION public.set_lessons_updated_at();
