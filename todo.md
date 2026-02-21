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

---

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
- Left: as it is
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

Generate:
- Complete Navbar component
- Dropdown component
- MobileNav component
- Reusable NavLink component

---

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

Generate only schema and migration plan first.
Wait for confirmation before UI code.

---

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

-

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

---

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

---

