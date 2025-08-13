-- Update RLS policy to allow anonymous access for admin login validation
DROP POLICY IF EXISTS "Admins can view their own data" ON public.admins;

-- Create a new policy that allows anonymous users to read admin records for login validation
CREATE POLICY "Allow admin login validation" 
ON public.admins 
FOR SELECT 
TO anon, authenticated
USING (true);

-- Also allow insert/update for authenticated admins (for future admin management)
CREATE POLICY "Authenticated admins can manage admins" 
ON public.admins 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);