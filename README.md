# FlowLedger — Personal Expense Tracker

FlowLedger is a personal finance tracking application built with Next.js that helps users manage transactions, organize expenses, set budgets, and monitor their financial activity through a dashboard.

## Features

- **Authentication** — Sign in using the configured authentication providers.
- **Transaction Management** — Record and manage income and expenses.
- **Dashboard Analytics** — Review financial activity and transaction summaries.
- **Budget Management** — Create and manage budgets.
- **Categories** — Organize transactions by category.
- **Data Export** — Export financial records using the export functionality.
- **PostgreSQL Database** — Store application data persistently.
- **Responsive Interface** — Access the application across desktop and mobile screens.

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js | Full-stack React framework |
| React | User interface |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| PostgreSQL | Relational database |
| Prisma ORM | Database access and schema management |
| Prisma Neon Adapter | Connect Prisma to Neon PostgreSQL |
| Auth.js / NextAuth | Authentication |
| Bun | Package management and scripts |

## Architecture

FlowLedger follows a full-stack architecture:

1. **Frontend:** Next.js pages and React components provide the dashboard, transaction management, budgets, and categories.
2. **API layer:** Next.js Route Handlers process requests for transactions, budgets, categories, exports, and authentication.
3. **Authentication:** Auth.js / NextAuth manages user authentication and sessions.
4. **Database layer:** Prisma Client accesses PostgreSQL through the Neon adapter.
5. **Persistence:** PostgreSQL stores the application's financial data.

## Project Structure

```text
expense-tracker/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   ├── budgets/
│   │   ├── categories/
│   │   ├── exports/
│   │   ├── register/
│   │   └── transactions/
│   ├── dashboard/
│   └── login/
├── components/
│   └── dashboard/
├── lib/
│   └── prisma.ts
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
├── prisma.config.ts
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js
- Bun
- A PostgreSQL database, such as Neon
- Google OAuth credentials if Google sign-in is enabled

### 1. Clone the repository

```bash
git clone <your-github-repository-url>
cd expense-tracker
```

### 2. Install dependencies

```bash
bun install
```

### 3. Configure environment variables

Create a `.env` file in the project root and configure the variables required by your application.

Example:

```env
DATABASE_URL="your_postgresql_connection_string"
AUTH_SECRET="your_auth_secret"
AUTH_GOOGLE_ID="your_google_client_id"
AUTH_GOOGLE_SECRET="your_google_client_secret"
```

Use the variable names expected by your actual authentication configuration. If your project uses NextAuth v4, it may require `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `GOOGLE_CLIENT_ID`, and `GOOGLE_CLIENT_SECRET` instead.

Never commit `.env` or `.env.local` files containing secrets.

### 4. Generate Prisma Client

```bash
bunx prisma generate
```

### 5. Apply database migrations

```bash
bunx prisma migrate deploy
```

For local development when creating new migrations, use:

```bash
bunx prisma migrate dev
```

### 6. Start the development server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Production Build

Check that the application builds successfully before deployment:

```bash
bun run build
```

Deploy the application using your preferred hosting platform and configure the required environment variables there.

## Security Notes

- Keep OAuth client secrets and database credentials private.
- Use environment variables for sensitive configuration.
- Ensure users can access only their own financial records.
- Use HTTPS in production.
- Never commit secrets or production database credentials to GitHub.

## Future Improvements

Potential enhancements include recurring transactions, advanced financial reports, monthly spending comparisons, and additional budget insights.

## License

Choose a license before allowing others to reuse or distribute this project. If no license is provided, the repository remains under the default copyright terms.
