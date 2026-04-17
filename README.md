# MenusMoz — Locais de Moz

> Restaurant menu discovery platform for Mozambique.  
> Stack: **React 19 + Vite + TypeScript + Supabase + Vercel**

---

## Quick Start (Local Development)

### 1. Clone & Install

```bash
git clone <repo-url>
cd MenusMoz
npm install
```

### 2. Configure Supabase

Copy the example environment file and fill in your Supabase keys:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your project's keys (find them in **Supabase Dashboard → Project Settings → API**):

```env
VITE_SUPABASE_URL=https://your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

> **⚠️ Without these keys the app runs entirely on mock data.** A loud console warning will remind you.

### 3. Run Database Migrations

Apply the SQL migrations in order via the Supabase Dashboard SQL Editor or CLI:

| # | File | Purpose |
|---|------|---------|
| 1 | `001_initial_schema.sql` | Core tables: profiles, restaurants, menu_categories, menu_items, favorites, reviews |
| 2 | `002_enable_rls_and_policies.sql` | Row Level Security policies for all tables |
| 3 | `003_menu_subcategories_and_enhancements.sql` | Subcategories layer, extra fields, performance indexes |
| 4 | `004_hero_slides_and_blog_posts.sql` | Hero slides & blog posts tables with bilingual fields |
| 5 | `005_active_restaurants_view.sql` | `active_restaurants_view` used by the frontend |
| 6 | `006_profile_trigger.sql` | Auto-creates a `profiles` row on user signup |
| 7 | `007_restaurant_extra_columns_and_price_value.sql` | Extra restaurant columns + `price_value` NUMERIC on menu_items |
| 8 | `008_restaurant_media_storage.sql` | Restaurant media columns + `restaurant-media` Supabase Storage bucket |

> **All migrations are additive** and use `IF NOT EXISTS` / `IF NOT EXISTS` column checks for safety.

### 4. Start the Dev Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Deploy to Vercel

### 1. Push to GitHub

Ensure your repo is pushed to GitHub (or GitLab/Bitbucket).

### 2. Import on Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo.
2. Framework Preset: **Vite**
3. Build Command: `npm run build`
4. Output Directory: `dist`

### 3. Set Environment Variables

In **Vercel → Your Project → Settings → Environment Variables**, add:

| Variable | Value |
|----------|-------|
| `VITE_SUPABASE_URL` | `https://your-project-url.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `your-anon-key-here` |

> **Important:** These must be set for the **Production** environment (and Preview/Development if you want those to work too).

### 4. Redeploy

After adding the environment variables, trigger a redeployment for them to take effect.

---

## Project Structure

```
MenusMoz/
├── public/               # Static assets
├── src/
│   ├── components/       # UI components (layout, home, restaurant, ui)
│   ├── context/          # AuthContext (Supabase Auth)
│   ├── data/             # mockData.js (fallback data)
│   ├── hooks/            # useFavorites, useContent, useDarkMode
│   ├── lib/              # supabase.ts (client init)
│   ├── pages/            # Route pages (Home, RestaurantDetail, Profile, etc.)
│   ├── services/         # restaurantService.ts (Supabase queries)
│   ├── utils/            # timeUtils
│   ├── translations.ts   # i18n (pt/en)
│   ├── App.tsx            # Root component + routes
│   └── main.tsx           # Entry point
├── supabase/
│   └── migrations/       # SQL migration files (001–007)
├── .env.local.example    # Template for environment variables
├── vercel.json           # Vercel rewrite rules
└── tsconfig.json         # TypeScript config (strict: true)
```

## Data Entry

There is no admin dashboard. Restaurant data is managed directly via the **Supabase Table Editor** in the Supabase Dashboard. Simply open your project, navigate to the Table Editor, and add/edit rows in the `restaurants`, `menu_categories`, `subcategories`, `menu_items`, `hero_slides`, and `blog_posts` tables.

For real restaurant images, use **Supabase Storage** and store the resulting public URLs in `restaurants.cover_url`, `restaurants.hero_image_url`, `restaurants.logo_url`, and `restaurants.gallery`. A step-by-step example for the first restaurant is available in [docs/IYPSLON_SETUP.md](docs/IYPSLON_SETUP.md).

## Key Architecture Notes

- **Mock Data Fallback**: When `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` are not set, the app falls back to `src/data/mockData.js`. A console warning is always printed.
- **RLS**: Row Level Security is enabled on all tables. Public reads are allowed for restaurants, menu data, reviews, hero slides, and blog posts. User-specific data (profiles, favorites) is scoped to the authenticated user.
- **Auth**: Supabase Auth handles signup, login, OAuth (Google, GitHub), and password reset. A database trigger auto-creates a `profiles` row on signup.
- **Password Reset**: The reset email redirects to `/perfil?reset=true`, which renders a "set new password" form.
- **Bilingual**: All user-facing text supports Portuguese (default) and English via `translations.ts`.
- **Price Fields**: `menu_items` supports both `price TEXT` (formatted, e.g. "650 MT") and `price_value NUMERIC` (for calculations). The frontend prefers `price_value` when available.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests (Vitest) |
