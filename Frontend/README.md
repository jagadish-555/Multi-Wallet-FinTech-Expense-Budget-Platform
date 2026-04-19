# Multi-Wallet FinTech Frontend

Production frontend for the Multi-Wallet FinTech Expense and Budget platform.

## Stack

- React + TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- Axios
- React Hook Form + Zod
- Zustand
- Recharts

## Features

- JWT auth flows with token refresh in Axios interceptor
- Protected routes with persisted auth session
- Dashboard with monthly summary and charts
- Expense management with filters, pagination, and CSV export
- Categories management (system vs custom)
- Budget management with usage visualization
- Recurring expense management (create, pause, resume, delete)
- Analytics page with date-range category breakdown
- Settings page (profile, preferences, password)
- Notification bell with unread count and mark-as-read actions

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment:

```bash
cp .env.example .env.local
```

3. Set API URL in `.env.local`:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

4. Start development server:

```bash
npm run dev
```

## Scripts

- `npm run dev` - Start local dev server
- `npm run build` - Type-check and build production bundle
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment

Vercel deployment is configured through `vercel.json`.

- Build command: `npm run build`
- Output directory: `dist`
- SPA rewrites enabled to route all paths to `index.html`

## Project Structure

```text
src/
  api/
  components/
    ui/
    layout/
    charts/
    expenses/
    categories/
    budgets/
    notifications/
    recurring/
  hooks/
  lib/
  pages/
    auth/
  store/
  types/
```
