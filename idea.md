# FinTech Ledger Backend

This project is a backend system for tracking personal finances across multiple wallets such as bank accounts, cash, and credit cards.

Instead of directly editing balances, every money movement goes through a transaction engine. This ensures that all financial operations are safe, consistent, and fully recorded.

The backend is designed to handle real-world issues like concurrent requests, partial failures, and duplicate API calls.

---

## Project Scope

The system supports:
- Multiple wallets per user (bank, cash, credit card, savings)
- Adding income and expenses
- Transferring money between wallets
- Monthly budgets by category
- Recurring transactions (subscriptions, rent, etc.)
- Spending analytics and financial summaries

It is built as a REST API that can be consumed by any frontend client.

---

## Key Features

### Multi-wallet system  
Users can create and manage different wallets. Balances only change through transactions, keeping all money movement traceable and immutable.

### Transaction engine  
All financial operations run inside strict SQL transactions:
- Wallet balances update safely.  
- Transaction records are always stored.  
- Partial updates are prevented (if one step fails, the entire operation rolls back).  

### Concurrency control  
Row-level locking (`SELECT ... FOR UPDATE`) is used during transfers to prevent:
- Double spending.  
- Race condition errors when multiple requests hit the server simultaneously.  

### Idempotency handling
The API requires unique idempotency keys for money movements. If a client experiences network lag and retries a payment, the backend catches the duplicate key and prevents the user from being double-charged.

### Transaction lifecycle  
Each transaction moves through defined states to handle asynchronous processing:
- `PENDING`: The intent is locked in the database.
- `COMPLETED`: Funds are successfully verified and moved.
- `FAILED`: Insufficient funds or a system error occurred.

---

## Tech Stack
- **Backend:** Node.js, TypeScript, Express.js (Controller-Service-Repository architecture)
- **Database:** PostgreSQL
- **Frontend:** React.js 