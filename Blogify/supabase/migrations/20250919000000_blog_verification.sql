-- Add verification and image fields to blogs table
ALTER TABLE public.blogs 
ADD COLUMN IF NOT EXISTS verification_requested boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS verified_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS background_image_url text;

-- Add admin role to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role text DEFAULT 'user';

-- Create storage bucket for blog images (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'blog-images'
  ) THEN
    INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true);
  END IF;
END $$;

-- Create storage policies for blog images (idempotent)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE polname = 'Blog images are publicly accessible'
  ) THEN
    CREATE POLICY "Blog images are publicly accessible" 
    ON storage.objects 
    FOR SELECT 
    USING (bucket_id = 'blog-images');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE polname = 'Users can upload blog images'
  ) THEN
    CREATE POLICY "Users can upload blog images" 
    ON storage.objects 
    FOR INSERT 
    WITH CHECK (bucket_id = 'blog-images' AND auth.uid() IS NOT NULL);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE polname = 'Users can update their blog images'
  ) THEN
    CREATE POLICY "Users can update their blog images" 
    ON storage.objects 
    FOR UPDATE 
    USING (bucket_id = 'blog-images' AND auth.uid() IS NOT NULL);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE polname = 'Users can delete their blog images'
  ) THEN
    CREATE POLICY "Users can delete their blog images" 
    ON storage.objects 
    FOR DELETE 
    USING (bucket_id = 'blog-images' AND auth.uid() IS NOT NULL);
  END IF;
END $$;

-- Function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid uuid)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE user_id = user_uuid;
$$;

-- Policies for admins to manage verification (optional; relies on RLS setup)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE polname = 'Admins can view all blogs for verification'
  ) THEN
    CREATE POLICY "Admins can view all blogs for verification" 
    ON public.blogs 
    FOR SELECT 
    USING (public.get_user_role(auth.uid()) = 'admin');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE polname = 'Admins can verify blogs'
  ) THEN
    CREATE POLICY "Admins can verify blogs" 
    ON public.blogs 
    FOR UPDATE 
    USING (public.get_user_role(auth.uid()) = 'admin');
  END IF;
END $$;


