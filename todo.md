

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