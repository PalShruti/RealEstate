-- Update RLS policies for units table to restrict UPDATE and DELETE to admin only
-- Allow public viewing and anonymous inserts, but restrict modifications

-- Drop the current permissive policies
DROP POLICY IF EXISTS "Allow insert units" ON public.units;
DROP POLICY IF EXISTS "Allow update units" ON public.units;
DROP POLICY IF EXISTS "Allow delete units" ON public.units;

-- Create more restrictive policies
-- Allow anonymous users to insert units (for admin panel without Supabase auth)
CREATE POLICY "Allow insert units" 
ON public.units 
FOR INSERT 
TO public, anon, authenticated
WITH CHECK (true);

-- Restrict UPDATE to authenticated users only (admin verification in app layer)
CREATE POLICY "Authenticated users can update units" 
ON public.units 
FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (true);

-- Restrict DELETE to authenticated users only (admin verification in app layer)
CREATE POLICY "Authenticated users can delete units" 
ON public.units 
FOR DELETE 
TO authenticated
USING (true);