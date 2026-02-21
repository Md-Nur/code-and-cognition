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



Act as a senior frontend architect and SaaS UX designer.

I am building a **premium AI-driven digital agency website** using:

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Integration with existing ERP (dynamic Services and Core Pillars from database)

Objective: Generate a **landing page** suitable for high-ticket international clients. It should convey professionalism, trust, and enterprise-level operational sophistication.

---

# REQUIREMENTS:

## 1️⃣ Hero Section:
- Headline: Focus on outcomes, not tech. Example: "Structured Digital Execution for Growth-Focused Companies"
- Subheadline: One sentence about delivering measurable business results.
- CTA: "Schedule Strategic Consultation" (primary) + optional secondary: "Explore Our Work"
- Visual: Clean hero illustration or abstract AI/tech visual
- Full width, responsive, sticky header

## 2️⃣ Core Pillars Section:
- Dynamically fetch **Service Categories** from Prisma (Digital Platforms, Intelligent Automation, Growth Systems)
- Show icon + short value-focused description for each pillar
- Optional “Learn More” link for internal sub-pages

## 3️⃣ How We Work Section:
- Horizontal or vertical timeline: Discovery → Strategy → Development → Testing → Deployment → Optimization
- Each step: icon + 1-2 sentence description
- Optional animation for milestones

## 4️⃣ Case Studies / Portfolio:
- Display cards with title, result metrics, image
- Hover: show tech used (Next.js, AI models, Prisma)
- CTA: "See Full Case Study" or "Request Similar Solution"

## 5️⃣ Testimonials / Social Proof:
- Logos or quotes (real clients or internal proof like Saif Academy, IEEE RUSB)
- Minimal, clean layout

## 6️⃣ Knowledge / Insights Section (Optional):
- Snippets of thought leadership
- Link to full blog posts internally

## 7️⃣ Footer:
- Minimal, clean
- Contact info (Email, LinkedIn)
- Quick links to Core Pillars
- Legal disclaimers

---

# DESIGN & UX PRINCIPLES:
- Minimalist, whitespace-heavy, enterprise feel
- Color palette: subtle neutrals + one accent color (e.g., deep blue)
- Typography: clean sans-serif
- Hover effects: subtle, smooth
- Responsive: mobile-first
- CTA repeated above fold + mid-page + bottom
- Above-the-fold clarity: who we are → why different → trust → CTA

---

# TECH REQUIREMENTS:
- Functional components only
- Tailwind CSS, no external UI libraries unless absolutely necessary
- Dynamic fetching for Service Categories from Prisma DB
- Responsive design (mobile, tablet, desktop)
- Accessible (aria labels, keyboard navigable)
- Smooth animations for dropdowns, timeline, cards
- Reusable components (Hero, Card, TimelineStep, CTAButton)

---

Generate **full Next.js page** code with:

- HeroSection.tsx  
- CorePillars.tsx (dynamic from Prisma)  
- HowWeWork.tsx (timeline component)  
- CaseStudies.tsx  
- Testimonials.tsx  
- Optional KnowledgeSection.tsx  
- Footer.tsx  
- LandingPage.tsx importing all components

Focus on **clean structure, reusability, and enterprise positioning**.