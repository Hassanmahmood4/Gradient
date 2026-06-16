# Gradient

Interactive machine learning learning platform built with Next.js 16, Clerk, and Supabase.

## Deploy

### 1. Environment variables

Copy `.env.local.example` to `.env.local` locally, or set these in your hosting provider (e.g. Vercel → Project Settings → Environment Variables):

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) |

### 2. Database

Run `supabase/schema.sql` in the Supabase SQL editor before going live.

### 3. Build & run

```bash
npm install
npm run build
npm run start
```

**Vercel:** Import the repo, add the four env vars above, and deploy. Next.js is detected automatically; no extra config required.

**Node:** 20+

### Local development

```bash
cp .env.local.example .env.local
# fill in keys, run schema.sql in Supabase
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
