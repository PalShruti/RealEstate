-- Add additional admin users for testing
INSERT INTO public.admins (email, password, name) VALUES 
('jyotikhuperkar05@gmail.com', 'jyoti05', 'Jyoti Khuperkar'),
('kishoritipugade18@gmail.com', 'kishori18', 'Kishori Tipugade'),
('snehalaurel@gmail.com', 'sneha18', 'Sneha Sarnaik')

ON CONFLICT (email) DO NOTHING;