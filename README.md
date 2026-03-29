# Akintunde Contractor Portfolio

Static website (HTML + Tailwind + JavaScript) with Supabase-powered admin dashboard.

## Stack

- HTML/CSS/JS (no custom backend)
- Tailwind via CDN
- Supabase Auth, Postgres, and Storage
- GitHub Actions keep-alive job for Supabase free tier
- Vercel static hosting

## Pages

- `index.html`: Homepage, profile, featured projects
- `projects.html`: Full project gallery with category filters + YouTube embeds
- `references.html`: Reference letters page (preview + download)
- `services.html`: Services offered
- `case-studies.html`: Visa-friendly project case study evidence
- `cv.html`: CV download page
- `contact.html`: Contact channels and WhatsApp
- `admin/login.html`: Admin login
- `admin/dashboard.html`: Admin CRUD for projects and references

### Bulk Project Media

- Each project still has one `hero_image_url`.
- You can now attach multiple extra images and multiple extra video links per project.
- Extra media is stored in `public.project_media` with `project_id`, `media_type`, and `media_url`.

## 1) Supabase Setup

1. Create a Supabase project.
2. In SQL Editor, run `supabase/schema.sql`.
3. In Authentication, create one admin user (email/password).
4. In API settings, copy:
   - Project URL (example: `https://vlhvqdgokvetrjbjomyh.supabase.co`)
   - Anon public key (JWT-like string, usually starts with `eyJ...`)
5. Update `assets/js/config.js`:
   - `supabaseUrl`
   - `supabaseAnonKey` (anon key only)
   - `allowedAdminEmails` with your admin email

After running the SQL, the admin project form supports:

- Single hero image upload
- Bulk gallery image upload (multiple files)
- Multiple video links (one URL per line)

### Admin Signup / Login Flow

- This template uses a single-admin allow-list model.
- Add your admin email in `assets/js/config.js` under `allowedAdminEmails`.
- Create that same email/password in Supabase Auth:
  - Supabase Dashboard -> Authentication -> Users -> Add user
  - Set email + password (confirm email if prompted)
- Then login at `/admin/` (now redirects to `/admin/login.html`).

If you prefer self-signup from the website later, you can add a `signUp` form in admin UI, but for visa portfolio evidence this locked admin model is safer.

Important:

- Do not paste your PostgreSQL connection string in frontend files.
- Do not expose service role key in frontend files.
- PostgreSQL URI is for server tools/SQL clients only.

## 2) GitHub Secrets for Keep Alive

Add these repository secrets:

- `SUPABASE_URL` = `https://YOUR_PROJECT.supabase.co`
- `SUPABASE_ANON_KEY` = your anon key

Workflow file: `.github/workflows/supabase-keepalive.yml`

- Runs every 6 days and updates `keep_alive` table.

## 3) Deploy to Vercel

1. Push repository to GitHub.
2. Import project in Vercel.
3. Deploy as static site (no build command needed).
4. Add custom domain if needed.

## 4) Media Strategy Used

- Videos: YouTube links only (embedded in projects page)
- Images/PDF letters: Supabase Storage bucket (`portfolio-media`)

## 5) Notes

- `assets/js/config.js` holds public values. This is expected for anon key.
- Write access is controlled by Supabase Auth + RLS.
- If you want stronger admin controls later, add role checks using a profile table and policy filters.

## 6) Supabase CLI (npx)

Use these commands in this repo:

```bash
npx supabase login
npx supabase link --project-ref vlhvqdgokvetrjbjomyh
npx supabase migration new new-migration
npx supabase db push
```

Notes:

- `supabase link` requires CLI login or `SUPABASE_ACCESS_TOKEN`.
- This repo already has migration file `supabase/migrations/20260328165913_new-migration.sql` populated from `supabase/schema.sql`.
