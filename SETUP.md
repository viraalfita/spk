# SPK Creator - Complete Setup Guide

Full documentation for setting up and running the SPK Creator application.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Features Overview](#features-overview)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

- **Node.js**: Version 18 or higher
- **npm**: Comes with Node.js
- **Supabase Account**: Free tier is sufficient
- **(Optional) n8n Instance**: For webhook notifications

---

## Installation

### Option 1: Automated Setup

```bash
cd /Users/viraalfita/spk
./setup.sh
```

The script will:
- Create `.env.local` from template
- Install all dependencies
- Display next steps

### Option 2: Manual Setup

```bash
# 1. Copy environment template
cp .env.local.example .env.local

# 2. Install dependencies
npm install

# If you encounter issues:
npm install --legacy-peer-deps
```

---

## Database Setup

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details
4. Wait for project to be ready

### Step 2: Run Migration

1. Open your Supabase project
2. Navigate to **SQL Editor**
3. Click "New Query"
4. Open `database/schema.sql` from this project
5. Copy all contents and paste into SQL Editor
6. Click "Run" to execute

This creates:
- `spk` table with 17 columns
- `payment` table with 10 columns  
- `vendor` table with 6 columns
- All indexes and RLS policies
- 3 sample SPKs for testing

### Step 3: Verify Tables

1. Go to **Table Editor** in Supabase
2. You should see 3 tables: `spk`, `payment`, `vendor`
3. Click on `spk` table - you should see 3 sample records

---

## Environment Configuration

### Get Supabase Credentials

1. In your Supabase project, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

> [!WARNING]
> **Never commit `.env.local`** - it contains sensitive keys

### Edit .env.local

```env
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# n8n Webhook (OPTIONAL)
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/spk-notifications

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Running the Application

### Development Mode

```bash
npm run dev
```

The app will start at: **http://localhost:3000**

### Production Build

```bash
npm run build
npm start
```

---

## Features Overview

### 1. Landing Page (`/`)

- Navigation to Admin Dashboard
- Vendor Portal information
- Clean, modern design

### 2. Admin Dashboard (`/dashboard`)

**Features:**
- View all SPKs with statistics
- Filter by status (draft/published)
- Create new SPK
- Quick access to details

**Test it:**
1. Visit http://localhost:3000/dashboard
2. You should see 3 sample SPKs
3. Click "Create SPK" to add new work order

### 3. Create SPK (`/dashboard/create`)

**Features:**
- Vendor information form
- Project details with dates
- Contract value input
- Payment breakdown (auto-calculated)
- Real-time validation

**Test it:**
1. Click "Create SPK" from dashboard
2. Fill in form:
   - Vendor: "PT Test Vendor"
   - Project: "Test Project"
   - Contract Value: 50000000
   - DP: 30%, Progress: 40%, Final: 30%
3. Click "Create SPK"
4. SPK appears in dashboard as "draft"

### 4. SPK Detail (`/dashboard/[id]`)

**Features:**
- Complete SPK information
- Payment tracking table
- Update payment status
- Publish SPK
- Download PDF

**Test it:**
1. Click any SPK from dashboard
2. View complete details
3. Click "Update" on any payment
4. Change status to "Paid", add date
5. Click "Publish SPK" if draft

### 5. Vendor Portal (`/vendor/[vendorId]`)

**Features:**
- Read-only SPK view
- Payment breakdown
- PDF download
- No edit capabilities

**Test it:**
1. Visit: http://localhost:3000/vendor/pt-vendor-jaya
2. See SPKs for "PT Vendor Jaya"
3. Click "Download PDF"

### 6. PDF Generation (`/api/pdf/[id]`)

**Features:**
- Professional layout
- Indonesian formatting
- Print-ready
- All SPK details

**Test it:**
1. From any SPK detail page, click "Download PDF"
2. PDF opens in new tab
3. Use browser print (Cmd+P / Ctrl+P) to save

---

## Troubleshooting

### Issue: npm install fails with ENOSPC

**Solution:**
```bash
# Free up disk space, then:
npm cache clean --force
rm -rf node_modules
npm install --legacy-peer-deps
```

### Issue: Supabase connection error

**Checklist:**
- [ ] `.env.local` exists and has correct values
- [ ] Supabase project is active
- [ ] API keys are correct (check for trailing spaces)
- [ ] Database migration ran successfully

**Verify:**
```bash
# Check environment variables are loaded
node -e "console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)"
```

### Issue: "No SPKs" in dashboard

**Solution:**
1. Verify database migration ran successfully
2. Check Supabase Table Editor shows 3 sample SPKs
3. Check browser console for errors
4. Verify RLS policies are configured

### Issue: PDF won't generate

**Checklist:**
- [ ] SPK ID is valid
- [ ] Route `/api/pdf/[id]` exists
- [ ] No console errors
- [ ] Supabase can retrieve SPK data

**Debug:**
```bash
# Check if API route responds
curl http://localhost:3000/api/pdf/[replace-with-real-id]
```

### Issue: Webhooks not triggering

**Checklist:**
- [ ] `N8N_WEBHOOK_URL` is set in `.env.local`
- [ ] n8n instance is running and accessible
- [ ] Webhook endpoint is configured in n8n
- [ ] SPK is published (webhooks only fire on publish/update)

---

## n8n Webhook Setup

### Webhook Events

**1. SPK Published**
```json
POST $N8N_WEBHOOK_URL
{
  "event": "spk.published",
  "spk": {
    "id": "uuid",
    "spk_number": "SPK-2026-001",
    "vendor_name": "PT Vendor Jaya",
    "vendor_email": "vendor@example.com",
    "project_name": "Office Renovation",
    "contract_value": 100000000,
    ...
  },
  "pdfUrl": "http://localhost:3000/api/pdf/uuid"
}
```

**2. Payment Updated**
```json
POST $N8N_WEBHOOK_URL
{
  "event": "payment.updated",
  "spk": { ...spk details },
  "payment": {
    "id": "uuid",
    "term": "dp",
    "status": "paid",
    "amount": 30000000,
    "paid_date": "2026-01-21",
    "payment_reference": "TRX-001"
  }
}
```

### n8n Workflow Example

1. Create webhook node in n8n
2. Configure trigger URL
3. Add Slack/Email nodes
4. Example message:
   ```
   🎉 New SPK Published!
   
   SPK: {{ $json.spk.spk_number }}
   Vendor: {{ $json.spk.vendor_name }}
   Project: {{ $json.spk.project_name }}
   Value: Rp {{ $json.spk.contract_value }}
   
   PDF: {{ $json.pdfUrl }}
   ```

---

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Settings → Environment Variables
```

### Other Platforms

1. Build: `npm run build`
2. Set environment variables
3. Start: `npm start`

---

## Tech Stack Summary

| Component | Technology |
|-----------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | Supabase PostgreSQL |
| Styling | Tailwind CSS |
| Forms | React Hook Form |
| Validation | Zod |
| PDF | HTML + Browser Print |

---

## Project Structure

```
spk/
├── app/                    # Next.js app directory
│   ├── actions/           # Server actions
│   ├── api/               # API routes
│   ├── dashboard/         # Admin pages
│   └── vendor/            # Vendor portal
├── components/            # React components
├── lib/                   # Utilities & config
│   ├── supabase/         # Database clients
│   └── validations/      # Zod schemas
├── database/              # SQL migrations
└── docs/                  # Documentation
```

---

## Support

- **Email**: admin@company.com
- **Documentation**: See `/docs/PRD.md`
- **GitHub Issues**: (if applicable)

---

## License

Internal use only - Proprietary
