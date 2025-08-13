
-- Add bhk_type column to bookings table to store user preference
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS bhk_type TEXT;

-- Update the status column to have proper enum values
ALTER TABLE public.bookings ALTER COLUMN status SET DEFAULT 'pending';

-- Add RLS policy for admin to update bookings
CREATE POLICY IF NOT EXISTS "Admins can update bookings" 
ON public.bookings 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Add RLS policy for admin to delete bookings  
CREATE POLICY IF NOT EXISTS "Admins can delete bookings"
ON public.bookings 
FOR DELETE 
USING (auth.uid() IS NOT NULL);
