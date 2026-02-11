# Next.js Food Tracker App

Food tracking app built with Next.js App Router + Supabase.

## Features

- Log foods by meal type (Breakfast/Lunch/Dinner/Snack)
- Quick-add common meals
- Add custom foods with calories, protein, carbs, and fat
- See daily macro and calorie totals
- Remove individual entries or clear the day
- Data is stored in Supabase (dynamic, shared across sessions/devices)

## Supabase Setup

1. Create a Supabase project.
2. Run the SQL in `supabase/schema.sql` (Supabase SQL Editor).
3. Add environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
```

Notes:
- `SUPABASE_SERVICE_ROLE_KEY` is optional for local dev if anon policies allow access.
- In production, keep `SUPABASE_SERVICE_ROLE_KEY` server-only (never expose in browser code).

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Start dev server:

```bash
npm run dev
```

3. Open `http://localhost:3000`

## Vercel

Add the same environment variables in Vercel Project Settings before deploying.
