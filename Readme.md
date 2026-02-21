# Code & Cognition - Management System

A comprehensive project management and service delivery platform built for agencies to manage clients, projects, payments, and contractor collaborations.

## 🚀 Tech Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [DaisyUI](https://daisyui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation

### Backend & Database
- **Runtime**: [Node.js](https://nodejs.org/) / [Bun](https://bun.sh/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: Custom JWT-based authentication with `jose` and `bcryptjs`
- **File Storage**: [ImgBB API](https://api.imgbb.com/) for image uploads

---

## 🏗️ Database Design

The system uses a PostgreSQL database with Prisma ORM. Key entities include:

- **Users & Roles**: Supports `FOUNDER` (Admin) and `CONTRACTOR` roles.
- **Service Catalog**: `Service` and `SubCategory` models define offerings and pricing tiers (Base, Medium, Pro) in both BDT and USD.
- **Project Management**: `Booking` leads are converted into `Project` entities with `Milestone` tracking and `ActivityLog` audit trails.
- **Financial Engine**: `Payment` records trigger automatic `LedgerEntry` splits.
- **Ledger System**: Tracks internal balances for the `COMPANY_FUND`, `FINDER_FEE`, and contractor `EXECUTION` shares.

---

## 🧠 Backend & Business Logic

### Automatic Payment Splits
When a project payment is recorded, the **Split Engine** (`lib/splitEngine.ts`) automatically calculates and creates ledger entries:
1. **Company Fund (20%)**: Retained by the agency.
2. **Finder Fee (10%)**: Allocated to the user who brought in the project.
3. **Execution (70%)**: Distributed among project members based on their defined percentage shares.

### Notifications & Communication
- **System Notifications**: Automated alerts for new bookings, status changes, and payments.
- **Internal Messaging**: A simple messaging system for founders and contractors to communicate within the platform.

### Client Access
Projects can be shared with clients via a unique **Magic Link** (`viewToken`), allowing them to view project progress and milestones without requiring an account.

---

## 📂 Codebase Structure

### File Structure
```text
├── app/                # Next.js App Router (Pages, API, Components)
│   ├── admin/          # Founder-only dashboard and management
│   ├── api/            # Backend API routes
│   ├── components/     # Reusable UI components (Admin, Public, Shared)
│   ├── contractor/     # Contractor-specific dashboard
│   ├── portal/         # Client-facing project status portal
│   └── services/       # Public service catalog pages
├── lib/                # Shared utilities and core business logic
│   ├── splitEngine.ts  # Logic for calculating payment distributions
│   ├── auth.ts         # JWT and authentication helpers
│   └── prisma.ts       # Prisma client singleton
├── prisma/             # Database schema and migration files
├── public/             # Static assets (images, fonts)
├── types/              # TypeScript interfaces and type definitions
└── scripts/            # Database seeding and maintenance scripts
```

### Frontend Architecture
The frontend is built using a component-based architecture:
- **Admin Components**: Specialized for managing complex data tables and forms.
- **Public Components**: Optimized for SEO and user experience on the landing page.
- **Shared Components**: Common elements like Loaders, Modals, and Status Badges.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js / Bun
- PostgreSQL database

### Installation
1. Clone the repository: `git clone <repo-url>`
2. Install dependencies: `npm install` or `bun install`
3. Configure environment variables in `.env` and `.env.local`:
   ```env
   DATABASE_URL="postgresql://..."
   JWT_SECRET="..."
   IMGBB_API_KEY="..."
   ```
4. Setup database:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```
5. Run development server: `npm run dev` or `bun dev`
