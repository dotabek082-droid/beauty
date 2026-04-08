# Frontend Developer Documentation

## Overview
The frontend is a **React 18** application built with **Vite**. It uses **TypeScript** for type safety and **Tailwind CSS** for styling. The UI component library is **shadcn/ui**.

## Directory Structure
```
src/
├── components/         # React Components
│   ├── business/       # Business-specific components (Dashboard, Forms)
│   ├── client/         # Client-facing components
│   ├── layout/         # Layout wrappers (AdminLayout, etc.)
│   ├── ui/             # Reusable UI primitives (Button, Input, Dialog) - shadcn
│   └── ...             # Feature-specific components
├── contexts/           # React Context Providers
│   ├── AuthContext.tsx # Authentication state & logic
│   └── ...
├── data/               # Static/Mock data
├── hooks/              # Custom React Hooks (use-toast, etc.)
├── integrations/       # External service configurations (Supabase)
├── pages/              # Page components (Mapped to Routes)
├── lib/                # Utility libraries (utils, formatting)
└── App.tsx             # Main Application Entry & Routing
```

## Key Modules

### 1. Routing
Routing is handled by `react-router-dom` in `App.tsx`.
-   **Public Routes**: `/`, `/search`, `/salon/:id`
-   **Protected Routes**:
    -   `/admin/*` (Requires `admin` role)
    -   `/business/*` (Requires business owner access)
    -   `/profile/*` (Requires authenticated user)

### 2. State Management
-   **Server State**: We use `@tanstack/react-query` for fetching data. This handles caching, loading states, and invalidation.
-   **Local/Global State**: React `Context` is used for global app data like User Session (`AuthContext`) and UI Theme.

### 3. Styling
-   **Tailwind CSS**: Used for all styling.
-   **shadcn/ui**: We use shadcn components which are installed into `src/components/ui`. You can customize them directly.
-   **Responsive Design**: The app is designed to look like a native mobile app on small screens. `containerClass` in `App.tsx` enforces a max-width on desktop for non-admin views to maintain the mobile-app feel.

### 4. Data Fetching (Supabase)
We use the Supabase client initialized in `src/integrations/supabase/client.ts`.
Example usage with React Query:

```typescript
const { data, isLoading } = useQuery({
  queryKey: ['salons'],
  queryFn: async () => {
    const { data, error } = await supabase.from('salons').select('*');
    if (error) throw error;
    return data;
  }
});
```

## Setup & Development

1.  **Install Dependencies**:
    ```bash
    npm install
    # or
    bun install
    ```

2.  **Start Dev Server**:
    ```bash
    npm run dev
    ```

3.  **Linting**:
    ```bash
    npm run lint
    ```
