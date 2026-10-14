
# Stock Portfolio

A stock portfolio project built with React, TypeScript and Next.js using fictional stock data.

## Setup

Requires Node.js 20.9+ and npm.

Install dependencies:

```bash
npm ci
```

Create a `.env.local` file in the project root:

```env
STOCK_API_KEY=practice-key
```

Start the app:

```bash
npm run dev
```

Open http://localhost:3000/portfolio

Check the project:

```bash
npm run typecheck
npm run build
```

## Features

- Search stocks using the provided mock API.
- Add, edit and remove USD holdings.
- Validate quantity and purchase price using Zod.
- View total holdings, shares and cost.
- Filter and sort holdings.
- Save holdings in localStorage between refreshes.
- View stock details with server-side data loading and a Refresh button.

## How It Works

`Portfolio` is the main component. It manages search, edit, filter and sort state, and passes data and callbacks to smaller components.

- **TanStack Query:** Handles stock searches, loading, errors and caching.
- **useHoldings:** Manages holdings and localStorage, including validation when restoring saved data.
- **Forms:** Keep draft values in local state until Save is clicked. Cancel discards changes.
- **Summary:** Calculates totals directly from saved holdings, so unsaved edits don't affect them.
- **Stock details:** Uses a Next.js Server Component to load quotes, with loading and error pages.

## Mistake and Fix

One mistake I learned about was updating React arrays directly using `push()`. React state should be updated without mutating the existing array.

Instead, I used:

```tsx
setHoldings((current) => [...current, newHolding]);
```

I also learned to calculate portfolio totals from holdings rather than keeping separate total values in state.
