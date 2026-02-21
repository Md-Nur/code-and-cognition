Act as a senior SaaS architect and Next.js App Router expert.

I am building a premium digital agency platform called "Code & Cognition".

Stack:
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- RBAC (FOUNDER, CONTRACTOR, CLIENT)

I want to generate a clean, scalable page architecture separating:

1. Public Website (Client Acquisition)
2. Authenticated ERP Portal (Operations)

--------------------------------------------------
PUBLIC WEBSITE STRUCTURE
--------------------------------------------------

Pages to generate:

/ (Landing Page)
/services
/services/[slug]
/case-studies
/case-studies/[slug]
/insights
/insights/[slug]
/about
/contact

Requirements:

1. Create a PublicLayout with:
   - Premium Navbar
   - Footer
   - Sticky header
   - Clean enterprise style

2. Landing Page Sections:
   - Hero
   - Core Pillars (dynamic from ServiceCategory)
   - How We Work
   - Case Studies Preview
   - CTA

3. Services Page:
   - Fetch ServiceCategory dynamically
   - No Basic/Pro pricing tables
   - Replace with “Request Proposal” CTA

4. Insights Page:
   - Blog-style layout
   - Filter by category
   - Clean card grid

5. Contact Page:
   - Structured consultation form
   - Submits to Booking model in Prisma
   - Status: PENDING_REVIEW

--------------------------------------------------
ERP PORTAL STRUCTURE
--------------------------------------------------

Authenticated routes under:

/dashboard

Generate:

/dashboard
/dashboard/projects
/dashboard/projects/[id]
/dashboard/bookings
/dashboard/proposals
/dashboard/ledger
/dashboard/users (Founder only)

Requirements:

1. Create PortalLayout:
   - Sidebar navigation
   - Topbar with user info
   - Role-based menu items
   - Clean admin UI

2. Dashboard Home:
   - KPI cards
   - Active projects
   - Pending approvals
   - Company fund balance (Founder only)

3. Project Detail Page:
   - Milestones
   - % Completion
   - Change Requests
   - File Upload section
   - Next Action Required card
   - Status indicator (Green/Yellow/Red)

4. Ledger Page:
   - Dual currency balances
   - Transaction history
   - Execution pool logic

5. RBAC:
   - FOUNDER: Full access
   - CONTRACTOR: Only assigned projects
   - CLIENT: Only their own project

--------------------------------------------------
TECH REQUIREMENTS
--------------------------------------------------

- Use App Router folder structure
- Create layout.tsx files properly
- Use server components where possible
- Use Prisma in server actions
- No external UI libraries
- Tailwind only
- Clean file organization
- Scalable for future SaaS productization

First output:
- Proposed folder structure
- Route tree
- Layout hierarchy
- Component structure

Remove all the unecessary codes, files and folders