# Database Migration Required

## Problem
The `feedback_responses` table has a foreign key constraint on `booking_id` that prevents clients from leaving independent reviews for services.

## Solution
Run the SQL migration to:
1. Make `booking_id` nullable
2. Remove foreign key constraint
3. Add optional business reference columns

## Steps to Apply

### Option 1: Using Supabase Dashboard
1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left menu
3. Copy and paste the contents of `database/migrations/allow_independent_reviews.sql`
4. Click **Run** to execute the migration

### Option 2: Using Supabase CLI
```bash
# If you have Supabase CLI installed
supabase db push
````

### Option 3: Manual SQL Execution
Connect to your PostgreSQL database and run:
```sql
ALTER TABLE feedback_responses ALTER COLUMN booking_id DROP NOT NULL;
ALTER TABLE feedback_responses DROP CONSTRAINT IF EXISTS feedback_responses_booking_id_fkey;
```

## After Migration
Once the migration is complete:
- ✅ Clients can add reviews to any service
- ✅ Reviews can be independent of bookings
- ✅ Reviews will appear on business detail pages
- ✅ Reviews will appear in user profile

## Testing
1. Submit a review through the feedback form
2. Check `/profile/reviews` - review should appear
3. Check business detail page → отзывы tab - review should appear
