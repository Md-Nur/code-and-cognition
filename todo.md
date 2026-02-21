Act as a senior SaaS architect.

I have a Next.js (App Router) + Prisma + PostgreSQL ERP system for a digital agency.

I want to implement a Change Request (CR) module inside an existing Project system.

Requirements:

1. Prisma Schema:
- Create ChangeRequest model
- Fields:
  - id (cuid)
  - projectId (relation)
  - requestedBy (User relation)
  - title
  - description
  - estimatedTimeImpact (in hours)
  - estimatedBudgetImpact (in project currency)
  - status (PENDING | APPROVED | REJECTED)
  - clientApprovalAt (DateTime nullable)
  - createdAt

2. Business Logic:
- Only Clients can approve/reject
- Only Founders/Contractors can create CR
- If approved, log event in ProjectActivity table

3. UI:
- Add “Request Change” button in Project Dashboard
- Show CR table with status badges
- Add modal form for CR creation
- Add approve/reject buttons for client role

4. Security:
- Enforce RBAC middleware

Generate:
- Prisma schema
- Server actions
- API route (if needed)
- Basic UI components using Tailwind
- Status badge component

Do NOT break existing project structure.


-----


Upgrade my Project model to support percentage completion tracking.

Requirements:

1. Add computed progress:
- Based on completed milestones / total milestones

2. Prisma:
- Ensure Milestone has:
  - status (PENDING | IN_PROGRESS | COMPLETED)

3. Add:
- Progress bar UI (horizontal)
- Percentage number
- Color changes:
   - 0-40% red
   - 40-80% yellow
   - 80-100% green

4. Display on:
- Client Portal
- Admin Project View

Use Tailwind only.


-----



Implement automatic Project Brief PDF generation in my ERP.

Stack: Next.js App Router.

Requirements:

1. Create:
- /api/project/[id]/generate-brief route

2. Use:
- @react-pdf/renderer

3. Include in PDF:
- Client Name
- Project Scope
- Timeline
- Milestones
- Budget
- Risk Notes

4. Add:
- "Download Brief" button in Admin and Client view

Ensure:
- Only project-related users can access
- Styled professionally (minimal black & white)


------


Refactor my existing RBAC system.

Roles:
- FOUNDER
- CONTRACTOR
- CLIENT

Rules:
- Founders: Full access
- Contractors: Only assigned projects
- Clients: Only own project & invoices

Implement:
- Centralized middleware (proxy)
- Reusable role guard function
- Prevent direct API bypass

Use Next.js middleware (proxy) + server validation.


----


Implement a "Next Action Required" logic for projects.

Logic Examples:
- If milestone awaiting client approval → show "Waiting for Client Approval"
- If payment pending → show "Payment Due"
- If change request pending → show "Change Request Review Needed"

Add:
- nextAction field (computed, not stored)
- Display prominently in project dashboard
- Role-based message variation

Use clean highlighted card UI.


------



Act as a senior product designer and frontend architect.

I am building a premium AI-driven digital agency platform using:

- Next.js (App Router)
- TypeScript
- Tailwind CSS

Redesign my Navbar to look like a high-end global agency (similar level positioning as enterprise consulting firms).

OBJECTIVES:
- Clean
- Minimal
- Premium
- Confident
- Not startup-ish
- Not crowded

REQUIREMENTS:

1. Layout:
- Left: Logo & text "Code & Cognition"
- Center: Main navigation links
- Right: CTA Button + optional Login/Profile

2. Navigation Structure (Public Site):
- Services (dropdown mega menu)
- Process
- Case Studies
- About
- Insights (Blog)
- Contact

3. Dropdown:
Services should open a modern dropdown panel (not small hover menu).
Group services into:
- Digital Platforms
- Intelligent Automation
- Growth Systems

4. CTA:
Right side button:
"Book Consultation"
- Rounded-lg
- Subtle shadow
- Slight hover animation
- Professional, not flashy

5. Sticky Behavior:
- Sticky top
- On scroll:
   - Slight backdrop blur
   - Soft shadow
   - Background becomes slightly opaque

6. Mobile:
- Clean hamburger
- Smooth slide-in menu from right
- Full-screen mobile nav
- CTA visible

7. Style:
- Subtle hover transitions
- No bright gradients
- Enterprise feel

8. Code Requirements:
- Use functional components
- Responsive
- Accessible (aria labels)
- Use Headless UI pattern if necessary

9. Bonus:
- Add subtle animated underline on hover for nav links
- Add smooth dropdown animation (opacity + translate)

Generate:
- Complete Navbar component
- Dropdown component
- MobileNav component
- Reusable NavLink component


-----


Act as a senior SaaS architect.

I currently have this structure:

Service
SubService
Plan (Basic | Plus | Pro)
Fixed pricing

I want to refactor my system to look like a premium B2B agency.

New Structure:

1. ServiceCategory
   - id
   - name (e.g., Digital Platforms)
   - description

2. Service
   - id
   - categoryId (relation)
   - name
   - overview
   - positioningText (high-level business value)

3. EngagementModel
   - id
   - serviceId (relation)
   - name (Strategy | Implementation | Optimization | Retainer)
   - description
   - pricingType (FIXED | CUSTOM | RETAINER)
   - basePrice (nullable)

4. Proposal
   - id
   - projectId
   - scopeSummary
   - budget
   - approved (boolean)

Tasks:

1. Rewrite Prisma schema models.
2. Provide migration strategy from old Plan system.
3. Update relations properly.
4. Do not break existing Project model.
5. Ensure flexibility for custom pricing.


------


Act as a UX strategist.

Refactor my public Services page.

Currently:
- Shows Basic / Plus / Pro pricing cards.

I want to:

- Remove fixed pricing display.
- Replace with solution-based sections.
- Add “Request Proposal” CTA instead of “Buy Now”.

Structure:

Section 1:
Headline: “Structured Digital Execution for Growth-Focused Companies”

Section 2:
Three Core Pillars:
- Digital Platforms
- Intelligent Automation
- Growth Systems

Section 3:
Engagement Approach (Strategy → Build → Scale)

Section 4:
CTA:
“Schedule Strategic Consultation”

Generate:
- New page layout
- Tailwind-based components
- No pricing grid
- Enterprise minimal style

Generate only schema and migration plan first.
Wait for confirmation before UI code.
------


Act as a UX strategist.

Refactor my public Services page.

Currently:
- Shows Basic / Plus / Pro pricing cards.

I want to:

- Remove fixed pricing display.
- Replace with solution-based sections.
- Add “Request Proposal” CTA instead of “Buy Now”.

Structure:

Section 1:
Headline: “Structured Digital Execution for Growth-Focused Companies”

Section 2:
Three Core Pillars:
- Digital Platforms
- Intelligent Automation
- Growth Systems

Section 3:
Engagement Approach (Strategy → Build → Scale)

Section 4:
CTA:
“Schedule Strategic Consultation”

Generate:
- New page layout
- Tailwind-based components
- No pricing grid
- Enterprise minimal style


-----


Act as a backend product architect.

Remove direct Plan selection from booking flow.

New Booking Flow:

1. Client selects Service
2. Client fills structured discovery form
3. Founder reviews request
4. Founder generates Proposal:
   - scope
   - milestones
   - budget
5. Client approves proposal
6. Project is created

Implement:

- Remove planId from Booking model
- Add proposalId relation
- Add proposal status:
   - DRAFT
   - SENT
   - APPROVED
   - REJECTED

Generate:
- Prisma schema updates
- Server actions
- Updated booking logic


------


Act as a branding strategist.

Rewrite my services positioning.

I currently list:
- Web Development
- ML Integration
- Video Editing
- Marketing

Transform into:

1. Digital Platforms
2. Intelligent Automation
3. Performance Growth Systems

For each:
- Write enterprise-level description
- Focus on business outcomes
- Avoid technical jargon
- Avoid low-tier service tone

Make it suitable for international clients.