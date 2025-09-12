-- Remove martial arts tables that don't belong in service management app
DROP TABLE IF EXISTS public.belt_tests CASCADE;
DROP TABLE IF EXISTS public.class_enrollments CASCADE;
DROP TABLE IF EXISTS public.classes CASCADE;
DROP TABLE IF EXISTS public.instructors CASCADE;
DROP TABLE IF EXISTS public.students CASCADE;

-- Also remove the get_current_user_role function if it was only used for martial arts
-- (keeping it since it might be used elsewhere in the service app)