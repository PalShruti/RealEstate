-- Update RLS policies for units table to allow admin operations
-- Since admins use custom authentication, we need to adjust the policies

-- Drop existing policies first
DROP POLICY IF EXISTS "Anyone can view units" ON public.units;
DROP POLICY IF EXISTS "Authenticated users can insert units" ON public.units;
DROP POLICY IF EXISTS "Authenticated users can update units" ON public.units;
DROP POLICY IF EXISTS "Authenticated users can delete units" ON public.units;

-- Create new policies that are more appropriate for the current authentication system
-- Allow anyone to view units (for public inventory display)
CREATE POLICY "Anyone can view units" 
ON public.units 
FOR SELECT 
TO public, anon, authenticated
USING (true);

-- Allow anonymous and authenticated users to insert units
-- This enables admin operations since admins don't use Supabase auth
CREATE POLICY "Allow insert units" 
ON public.units 
FOR INSERT 
TO public, anon, authenticated
WITH CHECK (true);

-- Allow anonymous and authenticated users to update units
CREATE POLICY "Allow update units" 
ON public.units 
FOR UPDATE 
TO public, anon, authenticated
USING (true)
WITH CHECK (true);

-- Allow anonymous and authenticated users to delete units
CREATE POLICY "Allow delete units" 
ON public.units 
FOR DELETE 
TO public, anon, authenticated
USING (true);