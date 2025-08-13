
-- Create units table for inventory management
CREATE TABLE public.units (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  floor INTEGER NOT NULL,
  unit_number TEXT NOT NULL,
  bhk_type TEXT NOT NULL,
  size_sqft INTEGER NOT NULL,
  price NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'Available' CHECK (status IN ('Available', 'Booked', 'Sold')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(floor, unit_number)
);

-- Enable RLS for units table
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view units (for public inventory display)
CREATE POLICY "Anyone can view units" 
ON public.units 
FOR SELECT 
TO public, anon, authenticated
USING (true);

-- Allow authenticated users to insert units (for admin)
CREATE POLICY "Authenticated users can insert units" 
ON public.units 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update units (for admin)
CREATE POLICY "Authenticated users can update units" 
ON public.units 
FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete units (for admin)
CREATE POLICY "Authenticated users can delete units" 
ON public.units 
FOR DELETE 
TO authenticated
USING (true);

-- Insert some sample data
INSERT INTO public.units (floor, unit_number, bhk_type, size_sqft, price, status) VALUES
(1, '101', '1 BHK', 650, 4500000, 'Available'),
(1, '102', '1 BHK', 650, 4500000, 'Booked'),
(1, '103', '2 BHK', 950, 6800000, 'Available'),
(2, '201', '1 BHK', 650, 4600000, 'Available'),
(2, '202', '2 BHK', 950, 6900000, 'Sold'),
(2, '203', '2 BHK', 950, 6900000, 'Available'),
(3, '301', '2 BHK', 950, 7000000, 'Available'),
(3, '302', '3 BHK', 1250, 9200000, 'Available'),
(3, '303', '3 BHK', 1250, 9200000, 'Booked'),
(4, '401', '2 BHK', 950, 7100000, 'Available'),
(4, '402', '3 BHK', 1250, 9300000, 'Available'),
(4, '403', '3 BHK', 1250, 9300000, 'Available');
