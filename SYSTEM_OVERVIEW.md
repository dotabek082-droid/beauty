# System Overview

## Introduction
**Uzb Beauty Find** is a comprehensive platform connecting beauty salons and masters with clients. It offers a dual-sided marketplace with features for booking services, participating in promotions (sales, lotteries), and managing beauty businesses.

## High-Level Architecture
The system follows a modern **Single Page Application (SPA)** architecture interacting with a **Backend-as-a-Service (BaaS)** provider.

```mermaid
graph TD
    Client[Client Browser]
    Admin[Admin Browser]
    Business[Business Owner Browser]

    subgraph Frontend [React SPA (Vite)]
        Router[React Router]
        AuthCtx[Auth Context]
        Components[UI Components]
        Queries[React Query]
    end

    subgraph Backend [Supabase]
        Auth[Authentication]
        DB[(PostgreSQL Database)]
        Storage[File Storage]
        Edge[Edge Functions]
    end

    Client -->|HTTPS| Frontend
    Admin -->|HTTPS| Frontend
    Business -->|HTTPS| Frontend

    Frontend -->|REST / Realtime| Backend
    Queries -->|Data Fetching| DB
    AuthCtx -->|Session Mgmt| Auth
```

## Technology Stack

### Frontend
-   **Framework**: [React 18](https://react.dev/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Library**: [shadcn/ui](https://ui.shadcn.com/) (based on Radix UI)
-   **State Management**: 
    -   Server State: `@tanstack/react-query`
    -   Global UI State: React Context (`AuthContext`, `LanguageContext`)
-   **Routing**: `react-router-dom`
-   **Forms**: `react-hook-form` + `zod` schema validation
-   **Maps**: `react-leaflet` / `leaflet`

### Backend (Supabase)
-   **Database**: PostgreSQL
-   **Authentication**: Supabase Auth (Email/Password, OAuth)
-   **Storage**: Supabase Storage (Images, Avatars)
-   **Security**: Row Level Security (RLS) policies
-   **Client**: `@supabase/supabase-js`

## Core Modules

### 1. User Types & Authentication
The system supports three distinct user roles managed via `public.user_roles`:
-   **Client**: Default role. Can search salons, book appointments, participate in promotions.
-   **Business Owner**: Can manage salon details, services, masters, and view bookings.
-   **Admin**: Full system access, managing users, verifying businesses, creating global promotions.

### 2. Booking System
-   **Service Booking**: Direct booking of salon services with time slot selection.
-   **Promotion Booking**: Booking specific promotional offers (discounts/lotteries).
-   **Logic**: Handled via `promotion_bookings` table with status tracking (`pending`, `confirmed`, `completed`).

### 3. Promotions Engine
A flexible system for marketing campaigns:
-   **Types**: Discount, Lottery, Free Service, Last Minute.
-   **Mechanics**: Slot tracking (limited availability), expiration dates.
-   **Participation**: Clients "book" a promotion slot.

### 4. Review & Trust System
-   Detailed feedback forms with specific questions (Service, Cleanliness, Politeness).
-   Photo uploads for reviews.
-   **Trust Score**: A calculated metric for user reliability (likely based on kept appointments vs. cancellations).

### 5. Financial System (Coins)
-   Internal currency ("Coins") for transactions.
-   Used for purchasing premium features or booking specific types of offers.
-   Transaction history tracking.
