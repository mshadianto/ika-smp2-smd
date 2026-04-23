# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**IKA SMPN 2 Samarinda Portal v4** — React 18 + Vite + Supabase alumni portal. UI copy is in Indonesian; preserve that tone and language when editing user-facing strings, toasts, and form labels.

## Commands

```bash
npm install
npm run dev       # Vite dev server on :5173
npm run build     # production build to dist/
npm run preview
```

No test runner and no real linter (`npm run lint` is a stub). Don't claim tests pass — there aren't any. When a change needs verification, run `npm run build` and (for UI) exercise it in the browser.

## Architecture

Service-layer abstraction with a **Supabase-or-localStorage graceful fallback**. The fallback is load-bearing — it's how demos/dev work without a backend, and how the app survives Supabase outages. Do not remove it when refactoring.

- **`src/config/supabase.js`** — exports `supabase` client and a `USE_SUPABASE` flag derived from `VITE_SUPABASE_ANON_KEY`. When the key is empty, `supabase` is `null` and every service silently falls back to `localStorage`. The **full Postgres schema + RLS policies live in a comment block at the bottom of this file** and must be pasted into the Supabase SQL Editor on first setup — there is no migration tool. When you add a table or change a column, update both the `TABLES` constant and that SQL block.
- **`src/services/BaseService.js`** — generic CRUD wrapper. Every method tries Supabase first, catches the error, and falls through to a `localStorage` path keyed by `storageKey`. `mapFromDb`/`mapToDb` translate between snake_case DB rows and camelCase app shapes. Follow this same "try Supabase, catch, fall through, cache" shape for any new service.
- **`src/services/entities.js`** — one `BaseService` instance per simple entity (alumni, market, umkm, event). `galleryService` and `forumService` are **hand-written composites** (albums+photos, threads+replies) because they need joined selects; don't force them into `BaseService`.
- **`src/hooks/useCollection.js`** — wraps any service into reactive `{ data, loading, error, create, update, remove, refresh }`. `App.jsx` instantiates one per entity and passes `data` + callbacks down; pages should never import services directly for mutations, except for forum/gallery composite methods (`addReply`, `likeThread`, etc.) which aren't on the `useCollection` surface — those call through `forumService`/`galleryService` and then `forum.refresh()`.
- **`src/config/auth.js`** — `ADMIN_EMAILS` is a hardcoded whitelist (two entries: `sopian.hadianto@gmail.com`, `firman20@yahoo.com`). `CAPABILITIES` is the single source of truth for permission strings; UI gates check `can(CAPABILITIES.X)` via `useAuth`. Any new admin action must get a capability entry here rather than an inline email or `isAdmin` check.
- **Defense in depth**: `can()` only hides UI. Real enforcement is the Postgres `is_admin()` SQL function + RLS policies in the schema comment. When you add a mutating action, add the matching RLS policy — do not rely on the client check alone.
- **Auth** (`src/services/authService.js`): Supabase passwordless magic-link (`signInWithOtp`). In local-fallback mode, admin login is simulated client-side (whitelist check only) — acceptable for demo, never for prod. Session state flows through `useAuth` → `App.jsx` → pages as `isAdmin` / `can` props.

## Adding a new entity

Idiomatic flow (don't skip the RLS step):

1. Add the table + RLS policies to the SQL comment in `src/config/supabase.js` and run it in the Supabase SQL Editor.
2. Add a `TABLES.FOO` constant in the same file.
3. Declare `fooService = new BaseService({...})` in `src/services/entities.js` with `mapFromDb`/`mapToDb`.
4. If admins get special powers, add a capability to `CAPABILITIES` in `src/config/auth.js`.
5. Build the page under `src/pages/`.
6. Wire `useCollection(fooService)` + a nav item in `src/App.jsx`.

Components should not import `supabase` directly — go through a service.

## Env

Copy `.env.example` → `.env` and set `VITE_SUPABASE_ANON_KEY`. The project URL is **hardcoded** in `src/config/supabase.js` (`fjodyrcbpwhdkbcbctdt.supabase.co`); to change projects, edit that constant, not `.env`.
