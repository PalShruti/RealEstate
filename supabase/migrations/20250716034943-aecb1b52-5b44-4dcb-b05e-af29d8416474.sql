
-- Drop all existing policies on bookings table to start fresh
DROP POLICY IF EXISTS "Public can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Authenticated users can view all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Authenticated users can update booking status" ON public.bookings;
DROP POLICY IF EXISTS "Admins can update bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can delete bookings" ON public.bookings;

-- Create policy to allow anyone (including anonymous users) to insert bookings
CREATE POLICY "Anyone can create bookings" 
ON public.bookings 
FOR INSERT 
TO public, anon, authenticated
WITH CHECK (true);

-- Create policy to allow anyone to view bookings (needed for admin dashboard)
CREATE POLICY "Anyone can view bookings" 
ON public.bookings 
FOR SELECT 
TO public, anon, authenticated
USING (true);

-- Create policy to allow anyone to update bookings (for admin status updates)
CREATE POLICY "Anyone can update bookings" 
ON public.bookings 
FOR UPDATE 
TO public, anon, authenticated
USING (true)
WITH CHECK (true);

-- Create policy to allow anyone to delete bookings (for admin cleanup)
CREATE POLICY "Anyone can delete bookings" 
ON public.bookings 
FOR DELETE 
TO public, anon, authenticated
USING (true);

-- Ensure status column has proper constraints
ALTER TABLE public.bookings 
DROP CONSTRAINT IF EXISTS bookings_status_check;

ALTER TABLE public.bookings 
ADD CONSTRAINT bookings_status_check 
CHECK (status IN ('pending', 'confirmed', 'cancelled'));

-- Ensure default status is set
ALTER TABLE public.bookings 
ALTER COLUMN status SET DEFAULT 'pending';
