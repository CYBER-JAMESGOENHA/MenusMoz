# MenusMoz - Project Context

This is a comprehensive guide to help AI assistants understand and work effectively with this codebase.

## Project Overview

**MenusMoz** is a modern web application that helps users discover and explore restaurants in Mozambique. It serves as a directory platform for restaurants, displaying menus, reviews, locations, and contact information.

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS (using @tailwindcss v4 with @theme custom properties)
- **Routing**: React Router v6
- **Animations**: GSAP (GreenSock Animation Platform)
- **Backend**: Supabase (PostgreSQL database + authentication)
- **Icons**: Lucide React
- **SEO**: React Helmet Async

## Key Features

1. **Restaurant Discovery** - Browse restaurants by category, location, and ratings
2. **Restaurant Detail Pages** - View menus, reviews, hours, and contact info
3. **Menu System** - Hierarchical menu categories with item details
4. **User Authentication** - Login/signup via Supabase Auth (Google, email)
5. **Favorites** - Save favorite restaurants
6. **Dark/Light Mode** - Theme toggle with CSS variables
7. **Multi-language** - Portuguese (pt) and English (en)
8. **Mobile-first Design** - Responsive with bottom navigation

## Project Structure

```
src/
├── components/
│   ├── home/          # Home page components (Hero, CategoryFilter, etc.)
│   ├── layout/        # Navbar, Footer, MobileBottomNav, UserPanel
│   ├── restaurant/   # Restaurant-specific components (MenuCategories, etc.)
│   └── ui/            # Reusable UI components (Button, Card, Modal)
├── context/           # React contexts (AuthContext)
├── pages/             # Route pages (Home, RestaurantDetail, Blog, etc.)
├── services/          # API services (Supabase queries)
├── translations/     # i18n translations
└── utils/             # Helper functions
```

## CSS System

The project uses Tailwind CSS v4 with custom theme variables defined in `src/index.css`:

- **Colors**: `--color-primary` (red), `--color-moz-green`, `--color-moz-yellow`, `--color-moz-red`
- **Dynamic theming**: CSS variables for `bg-color`, `surface-color`, `text-color`, `text-dim-color`, `border-color`
- **Dark mode**: `.dark` class toggles all color variables

## Important Conventions

1. **Component patterns**: Use functional components with TypeScript interfaces
2. **Styling**: Tailwind classes preferred; custom CSS only when needed
3. **State**: Use `useState`, `useContext`, or Supabase for data
4. **Icons**: Import from `lucide-react`
5. **Routing**: Use `react-router-dom` with `/path` convention

## Common Tasks

- **Adding a new page**: Create in `src/pages/`, add route in `App.tsx`
- **Adding a component**: Create in appropriate `src/components/` subfolder
- **Database changes**: Modify Supabase tables, update service in `src/services/`
- **Styling**: Use existing Tailwind classes or add to `@theme` in index.css

## Testing Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # Run linter (if configured)
```

## Current Issues / Notes

- The project uses Supabase for backend - you'll need valid Supabase credentials in environment variables
- Mobile bottom navigation appears on small screens
- User panel slides in from right with backdrop overlay