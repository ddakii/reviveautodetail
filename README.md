# Revive Auto Detail — Premium Automotive Detailing Platform

A complete full-stack SaaS platform for a premium automotive detailing business.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL via Prisma v7
- **Auth**: NextAuth.js v4
- **UI**: Tailwind CSS v4 + Radix UI
- **Charts**: Recharts
- **PDF**: jsPDF + html2canvas

## Setup

### 1. Install PostgreSQL

Make sure PostgreSQL is running locally or use a cloud provider.

### 2. Configure Environment

Edit `.env`:

```
DATABASE_URL="postgresql://postgres:password@localhost:5432/revive_auto_detail?schema=public"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Push Database Schema

```bash
npx prisma db push
```

### 4. Seed Demo Data

```bash
npm run db:seed
```

### 5. Run Dev Server

```bash
npm run dev
```

### Default Admin Credentials

- **Email**: admin@revive.com
- **Password**: Revive2026!

## Routes

### Public Website
- `/` — Homepage
- `/services` — Service catalog
- `/booking` — Book a service
- `/about` — About page
- `/gallery` — Photo gallery
- `/faq` — FAQs
- `/contact` — Contact form

### Admin Dashboard
- `/auth/login` — Admin login
- `/dashboard` — Overview & analytics
- `/dashboard/customers` — Customer CRM
- `/dashboard/vehicles` — Vehicle management
- `/dashboard/appointments` — Appointment scheduling
- `/dashboard/services` — Service management
- `/dashboard/quotes` — Quote management
- `/dashboard/invoices` — Invoice management
- `/dashboard/payments` — Payment tracking
- `/dashboard/reports` — Business analytics
- `/dashboard/team` — Team management
- `/dashboard/bookings` — Online booking requests
- `/dashboard/settings` — Business settings
