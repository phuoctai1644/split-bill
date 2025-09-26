# Split Bill
Local-first group bill splitting (React + Vite + TS). PWA, offline-ready, no accounts.

**Demo:** [https:/split-bill-omega-taupe.vercel.app](https://split-bill-omega-taupe.vercel.app/)

## Features (MVP)
- Groups & Members CRUD
- Expenses: Equal / Weights / Exact (integer minor units, largest remainder)
- Summary: balances; Settlement (greedy, minimal transfers)
- Share (readonly) via URL hash snapshot; Export JSON/CSV
- PWA installable, offline fallback

## Tech
React 18, Vite, TypeScript, Tailwind, Zustand, RHF + Zod, Dexie (IndexedDB), React Query, vite-plugin-pwa, Jest + RTL.

## Architecture
- local-first repos (Dexie)
- stores: zustand
- utils: money/split/settle (TBD)
- PWA via vite-plugin-pwa
