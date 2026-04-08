-- Migration to allow independent service reviews
-- This removes the foreign key constraint and makes booking_id nullable

-- Step 1: Make booking_id nullable
ALTER TABLE feedback_responses 
ALTER COLUMN booking_id DROP NOT NULL;

-- Step 2: Drop the foreign key constraint
ALTER TABLE feedback_responses 
DROP CONSTRAINT IF EXISTS feedback_responses_booking_id_fkey;

-- Step 3: Add new columns for independent reviews (optional but recommended)
ALTER TABLE feedback_responses 
ADD COLUMN IF NOT EXISTS business_id TEXT,
ADD COLUMN IF NOT EXISTS business_name TEXT,
ADD COLUMN IF NOT EXISTS service_quality INTEGER,
ADD COLUMN IF NOT EXISTS cleanliness INTEGER,
ADD COLUMN IF NOT NULL value_for_money INTEGER;

-- Step 4: Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_feedback_business_id ON feedback_responses(business_id);
CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON feedback_responses(user_id);

-- Note: After running this migration, clients can leave reviews without bookings
-- The booking_id can be NULL for independent reviews
