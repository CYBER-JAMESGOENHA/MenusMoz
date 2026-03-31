# Implementation Plan: MenusMoz Codebase Improvements

This document outlines the changes made to resolve technical debt and improve the codebase quality of the MenusMoz project.

## 1. Mixed File Extensions
- **Change**: Converted `useContent.js` and `useDarkMode.js` to `.ts`.
- **Reason**: To maintain consistency and leverage TypeScript's type safety across the entire hooks directory.

## 2. Excessive `any` Types
- **Change**: Defined proper interfaces for `Restaurant`, `HeroSlide`, `BlogPost`, `MenuItem`, `MenuCategory`, and `Review`.
- **Reason**: To eliminate use of `any` and provide better IntelliSense and error checking.

## 3. Redundant Null Checks
- **Change**: Removed redundant `isSupabaseConfigured` and `supabase` checks in `useFavorites.ts`.
- **Reason**: The outer check already ensures these values are present before `syncFavorites` is called.

## 4. Environment Variable Casting
- **Change**: Removed `(import.meta as any).env` casting.
- **Reason**: Provided proper types via a new `vite-env.d.ts` file.

## 5. Security: deleteAccount
- **Change**: Removed the misleading `deleteAccount` function from `AuthContext`.
- **Reason**: It only simulated deletion via sign-out, which is a security concern for users who believe their data is being permanently removed.

## 6. Duplicate Supabase Queries
- **Change**: Extracted the core `SELECT` fields for restaurants into `BASE_RESTAURANT_QUERY`.
- **Reason**: Reduced redundancy and simplified maintenance for the main restaurant query.

## 7. useEffect Dependency Warning
- **Change**: Added `syncFavorites` (wrapped in `useCallback`) to the dependency array.
- **Reason**: Resolved potential issues where side effects might not fire correctly.

## 8 & 9. Git Management
- **Change**: Removed build logs and `.env.local` placeholders from the git cache.
- **Reason**: These files should never be tracked to avoid clutter and accidental secret leaks.

## 10. Error Handling in RestaurantDetail
- **Change**: Added `.catch()` block to the restaurant fetch hook.
- **Reason**: Prevents infinite loading states if a request fails.

## Minor Improvements
- **useMemo** in `Home.tsx`: Memoized restaurant lists for performance.
- **LoadingSpinner**: Extracted to `src/components/ui/LoadingSpinner.tsx`.
- **useTranslation Hook**: Created new `src/hooks/useTranslation.ts`.
