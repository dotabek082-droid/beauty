-- Add responsible_person_phone column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS responsible_person_phone TEXT;
