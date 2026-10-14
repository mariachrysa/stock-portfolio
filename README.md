# Stock Portfolio Application

A React and Next.js application for searching stocks, managing a portfolio, persisting holdings in localStorage, and viewing stock details.

## Run

Requirements:

- Node.js 20.9+
- Bun 1.3+

Install dependencies:

```bash
bun install --frozen-lockfile
```

Create a `.env.local` file:

```env
STOCK_API_KEY=practice-key
```

Start the development server:

```bash
bun run dev
```

Open:

```text
http://localhost:3000/portfolio
```

Run verification checks:

```bash
bun run typecheck
bun run build
```

---

## Project Structure

### Main Pages

- `src/app/portfolio/page.tsx` - Portfolio page.
- `src/app/stocks/[symbol]/page.tsx` - Stock details page.
- `src/app/stocks/[symbol]/loading.tsx` - Loading UI for stock details.
- `src/app/stocks/[symbol]/error.tsx` - Error UI and retry support.

### Portfolio Components

- `src/components/portfolio.tsx` - Main portfolio container.
- `src/components/portfolio/search-area.tsx` - Search input and validation.
- `src/components/portfolio/search-results.tsx` - Search results and add form.
- `src/components/portfolio/portfolio-summary.tsx` - Portfolio totals.
- `src/components/portfolio/holdings-table.tsx` - Holdings table.
- `src/components/portfolio/holding-row.tsx` - Individual holding row and edit form.
- `src/components/portfolio/holding-validation.ts` - Validation and price conversion helpers.

### Shared Components

- `src/components/providers.tsx` - TanStack Query provider.
- `src/components/refresh-button.tsx` - Refresh button for stock details.
- `src/components/ui/` - Shared UI components.

### Data and Hooks

- `src/hooks/use-holdings.ts` - Portfolio state and localStorage persistence.
- `src/lib/stock-api.ts` - Fetch helpers.
- `src/lib/sample-data.ts` - Shared types and mock data.
- `src/lib/server/stock-data.ts` - Server-side stock and quote data.

### API Routes

- `src/app/api/stocks/search/route.ts`
- `src/app/api/stocks/quote/route.ts`

---

## State Ownership and Component Communication

The `Portfolio` component owns the portfolio state.

Holdings, editing state, searching, filtering, and sorting are managed at the portfolio level. Child components receive data through props and communicate changes back through callbacks such as:

- `onAdd`
- `onSave`
- `onRemove`
- `onEdit`
- `onCancel`

This keeps holdings as the single source of truth throughout the application.

---

## TanStack Query and Custom Hook

### TanStack Query

TanStack Query is used for stock searches.

It manages:

- Loading state
- Error state
- Search result caching
- Request lifecycle

Searches only run after a valid submission and use the submitted search term as part of the query key.

### useHoldings Hook

The custom `useHoldings` hook manages:

- Portfolio holdings
- Add/Edit/Remove operations
- localStorage persistence
- Storage restoration
- Recovery from invalid saved data

---

## Drafts, Totals, and Storage Restoration

### Draft Forms

Add and Edit forms use local draft state.

Changes are only saved when the user presses **Save**. Pressing **Cancel** discards unsaved changes and restores the previous values.

### Portfolio Totals

Portfolio totals are derived directly from the saved holdings:

- Number of holdings
- Total shares
- Total cost

Totals are not stored separately in state, which avoids stale values after edits.

### Storage Restoration

Holdings are restored from localStorage during application startup.

Data is validated before use. Invalid or corrupted data is reset safely and a message is shown to the user.

A loading state is displayed while restoration is in progress to prevent saved data from being overwritten by an initial empty state.

---

## Mistake and Fix

One mistake during development was treating React state as a mutable collection.

Updating arrays directly can prevent React from detecting changes correctly.

The fix was to use immutable updates by creating new arrays and objects when updating state:

```tsx
setHoldings((current) => [
  ...current,
  newHolding,
]);
```