# Backend & Database Documentation

## Overview
The backend is powered by **Supabase**, which provides a PostgreSQL database, Authentication, Realtime subscriptions, and File Storage.

## Database Schema (Key Tables)

### Authentication & Users
-   **`auth.users`**: Managed by Supabase Auth (not directly accessible via SQL usually).
-   **`public.user_roles`**: Maps users to roles (`admin`, `moderator`, `user`).
    -   *Dependencies*: `auth.users`
    -   *Security*: Only Admins can manage roles.

### Promotions Engine
-   **`public.promotions`**: Specific marketing offers created by businesses/admins.
    -   `service_name`, `original_price`, `slots_available`
    -   `is_active`, `starts_at`, `ends_at`
-   **`public.promotion_bookings`**: Records of users claiming a promotion.
    -   `status`: `pending`, `confirmed`, `completed`, `cancelled`.
    -   *Trigger*: Inserting a record here updates `slots_used` in `promotions`.

### Feedback System
-   **`public.feedback_questions`**: customizable questions (Uzbek/Russian).
-   **`public.feedback_responses`**: The main review entry.
    -   Links to `promotion_bookings` (verified stay).
-   **`public.feedback_answers`**: Specific answers to the questions.
-   **`public.feedback_photos`**: User uploaded photos for the review.

## Security (Row Level Security - RLS)
RLS is enabled on all tables to ensure data privacy.

| Table | Select Policy | Insert/Update Policy |
| :--- | :--- | :--- |
| `user_roles` | Users view own; Admins view all | Admins only |
| `promotions` | Public (if `is_active`); Admins view all | Admins only |
| `promotion_bookings` | User views own; Admins view all | User inserts own |
| `feedback_responses` | Public (aggregated); User views own | User inserts own |

## Storage
-   **Bucket**: `feedback-photos`
-   **Policies**: Authenticated users can upload; Public can view.

## Database Migrations
Migrations are stored in `supabase/migrations`.
To apply migrations:
1.  Use Supabase CLI: `supabase db push`
2.  Or copy SQL from migration files into the Supabase Dashboard SQL Editor.
