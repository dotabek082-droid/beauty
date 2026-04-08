# Contributing to Uzb Beauty Find

## Getting Started
1.  Read the **[Frontend Documentation](./FRONTEND_DOCS.md)** to understand the project structure.
2.  Ensure you have `Node.js` installed.

## Workflow
1.  **Branching**: Create a feature branch for your changes (`feature/new-booking-flow`).
2.  **Commits**: Use conventional commits (e.g., `feat: add new calendar view`, `fix: resolve login bug`).
3.  **Linting**: Run `npm run lint` before committing to ensure code quality.

## Code Style
-   We use **TypeScript** strictly. Avoid `any` types where possible.
-   Use **Tailwind CSS** for all styling. Avoid custom CSS files unless absolutely necessary.
-   Components should be small and reusable. Place them in `src/components/ui` if generic, or specific folders if feature-bound.

## Database Changes
If you need to change the database schema:
1.  Create a migration file in `supabase/migrations`.
2.  Document the change in **[Backend Documentation](./BACKEND_DOCS.md)**.
3.  Notify the team so the changes can be applied to the production instance.

## Testing
-   Currently, we rely on manual testing. Please verify your changes on both Desktop and Mobile view (Chrome DevTools Device Toolbar).
