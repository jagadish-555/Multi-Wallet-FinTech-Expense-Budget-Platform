# Expense-Track

*A comprehensive full-stack application to track your personal expenses, manage budgets, and gain financial insights.*

## 1. Problem Statement and Solution Overview

**Problem:** Tracking expenses manually is tedious and error-prone. Without a clear overview, it's difficult to stick to a budget, identify spending patterns, and achieve financial goals.

**Solution:** Expense-Track provides an intuitive interface to log expenses dynamically across categories, set budget limits, receive real-time alerts, and analyze spending habits over time. It automates recurring expenses and gives users a centralized hub for their financial data.

## 2. Architecture Diagram

The architecture is split into a React-based frontend and a Node.js/Express RESTful API backed by a relational database via Prisma ORM.

*(Please refer to the diagram markdown files in the root directory: [classDiagram.md](classDiagram.md), [ErDiagram.md](ErDiagram.md), [sequenceDiagram.md](sequenceDiagram.md), and [useCaseDiagram.md](useCaseDiagram.md) for detailed architecture and flows.)*

## 3. Tech Stack and Decisions

- **Frontend:** React, TypeScript, Vite, Tailwind CSS (Vercel deployment configurations included).
- **Backend:** Node.js, Express.js, TypeScript.
- **Database:** Relational Database (via Prisma ORM), MySQL.
- **Authentication:** JWT (JSON Web Tokens).

## 4. Features List

- [x] **User Authentication:** Secure JWT-based login and registration.
- [x] **Expense Logging:** Track transactions with custom categories.
- [x] **Budget Management:** Set and track specific budget limits.
- [x] **Recurring Expenses:** Automate weekly/monthly transactions.
- [x] **Real-time Analytics:** Visual insights and dashboards for spending patterns.
- [x] **Notifications & Alerts:** Get notified when approaching budget limits.


## 5. Getting Started

### Prerequisites
- Node.js (v18+)
- npm, yarn, or pnpm
- MySQL (or any Prisma-supported database)

### Setup and Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd Expense-Track
   ```

2. **Environment Variables:**
   Both the `Frontend` and `Backend` directories require their own environment variables. 
   Copy the `.env.example` to `.env` in both folders and configure:

   **Backend `.env` (example):**
   ```env
   PORT=5000
   DATABASE_URL="mysql://user:password@localhost:3306/expense_db"
   JWT_SECRET="your_jwt_secret"
   ```

   **Frontend `.env` (example):**
   ```env
   VITE_API_URL="http://localhost:5000/api"
   ```

3. **Backend Setup:**
   ```bash
   cd Backend
   npm install
   npx prisma generate
   npx prisma migrate dev  # Creates DB tables based on Prisma schema
   ```

4. **Frontend Setup:**
   ```bash
   cd Frontend
   npm install
   ```

### Run Scripts

**Development:**
- Open terminal 1 (Backend): `cd Backend && npm run dev`
- Open terminal 2 (Frontend): `cd Frontend && npm run dev`

**Production Build:**
- Backend: `npm run build && npm start`
- Frontend: `npm run build && npm run preview`

## 6. Deployment

- **Frontend:** Includes `vercel.json` for seamless deployment to Vercel. Connect your repository to Vercel, set the root directory to `Frontend/`, and it will auto-deploy.
- **Backend:** Can be deployed to platforms like Render, Railway, or Heroku. Ensure you provide the appropriate `DATABASE_URL` and environment variables in the host service.

## 7. Project Structure

```text
Expense-Track/
├── Backend/                 # Express.js REST API
│   ├── prisma/              # Database schema and migrations
│   ├── src/                 # Application source code
│   │   ├── controllers/     # Route handlers
│   │   ├── events/          # Event listeners (e.g., budget alerts)
│   │   ├── jobs/            # Scheduled tasks (e.g., recurring expenses)
│   │   ├── middlewares/     # Auth, error, validation functions
│   │   ├── repositories/    # Data access layer
│   │   ├── routes/          # API endpoints
│   │   └── services/        # Business logic
├── Frontend/                # React App (Vite)
│   ├── public/              # Static assets
│   ├── src/                 # UI components, pages, hooks, state
│   └── vercel.json          # Vercel deployment config
├── classDiagram.md          # Class architecture documentation
├── ErDiagram.md             # Entity Relationship diagram
├── sequenceDiagram.md       # Sequence flow diagram
├── useCaseDiagram.md        # Use-case documentation
└── idea.md                  # High-level architecture and scope idea
```

## 8. Roadmap and Contribution Guide

**Roadmap:**
- Implement data export functionality (CSV/PDF)
- Add multi-currency and localization support
- Improve analytical charts with robust interactive data

**Contributing:**
We welcome contributions! Please follow these steps:
1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 9. License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.
