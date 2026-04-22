# idea

## Project Scope

ExpenseTrack is a full-stack personal finance dashboard built for young professionals who want to understand their spending patterns — not just log receipts. The app covers the complete money-tracking lifecycle: adding expenses with categories, setting budgets with automated overspend alerts, scheduling recurring payments, and visualising monthly trends through charts. It is designed as a portfolio-grade internship project that demonstrates layered backend architecture, classic design patterns (Repository, Observer, Strategy), and a production-quality React frontend — all deployed live with a public URL.

---

## Key Features

- **JWT authentication** with access token (15 min) + refresh token (7 days) rotation, silent token refresh via Axios interceptor, and bcrypt password hashing
- **Expense CRUD** with category filtering, date range filtering, pagination, and soft delete (status = DELETED instead of hard removal)
- **Budget tracking** with three period strategies (Monthly reset, Rolling 30-day, Paycheck-based) — implemented using the Strategy design pattern so period logic is fully swappable at runtime
- **Observer-pattern notifications** — `ExpenseService` emits `expense.added` events; `BudgetAlertListener` subscribes independently and creates DB notifications when budgets cross 80% or 100%, with zero coupling between the two services
- **Recurring expense scheduler** — a node-cron job runs at midnight daily, finds all active schedules where `nextDueDate <= today`, creates expense rows with `recurringId` linkage, and advances `nextDueDate` forward
- **Analytics dashboard** — summary cards (this month vs last month with % change), spending pie chart by category, monthly bar chart for 6-month trends, and a category breakdown table
- **Responsive frontend** — dark-first React dashboard with sidebar navigation, Recharts visualisations, TanStack Query for all server state, skeleton loaders, toast notifications, and full mobile layout

---

## Tech Stack

- **Backend:** Node.js, Express, TypeScript — layered architecture (Routes → Controllers → Services → Repositories), Zod request validation, custom `ApiError` class, global error middleware, `asyncHandler` wrapper eliminating try/catch boilerplate, rate limiting on auth endpoints, helmet security headers
- **Database:** MySQL with Prisma ORM — 6-table schema with composite indexes on high-frequency query columns, soft deletes, and `prisma.$transaction()` for multi-step atomic writes
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, TanStack Query (server state + cache invalidation), Zustand (auth store + UI store persisted to localStorage), React Hook Form + Zod (all forms), Recharts (PieChart, BarChart), Axios with request/response interceptors, date-fns, Lucide React icons — deployed on Vercel
