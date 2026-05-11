This folder contains SQL migrations for creating database tables used by the app.

Usage

1. Open the Supabase project dashboard for your project.
2. Go to "SQL Editor" and paste the contents of the migration SQL file(s) from `db/migrations/`.
3. Run the SQL to create the tables (you need appropriate privileges).

Files

- `db/migrations/001_create_profiles.sql` — creates the `profiles` table with a unique, case-insensitive index on `username`.

Notes

- The migrations are provided as SQL files so you can run them directly in the Supabase SQL editor or via `psql`.
- If you prefer to run migrations programmatically, you'll need a service-role key. Do not commit the service-role key to your repo; keep it secret.
- After creating the `profiles` table, the app will enforce uniqueness when users set their display name.
