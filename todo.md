Create dashboard route:

/dashboard/case-studies

Features:

1. Case Studies Table View:
- Title
- Industry
- Status (Draft / Published / Archived)
- Published Date
- Edit Button
- Delete Button
- Preview Button

2. Create / Edit Form:
Fields:
- Title
- Slug (auto generate)
- Industry
- Client Name (optional)
- Summary
- Challenge (Rich text)
- Approach (Rich text)
- Solution (Rich text)
- Results (Rich text)
- Highlight Metric
- Tech Stack (multi select tags)
- Cover Image upload
- Architecture Image upload
- Status selector
- Publish date

Add:
- Draft saving
- Publish scheduling
- Validation
- Confirmation before delete

----------------------------------------

BACKEND LOGIC

- Use Prisma schema for CaseStudy
- Slug must be unique
- Only show Published case studies on public site
- Protect dashboard with authentication
- Add server actions for create/update/delete
- Add optimistic UI update

----------------------------------------

UI DESIGN LANGUAGE

- Minimal
- Professional
- No excessive gradients
- Large whitespace
- Subtle borders
- Soft shadows
- Rounded corners (lg)
- Smooth hover transitions
- Enterprise SaaS feeling

----------------------------------------

BONUS FEATURES

- SEO metadata per case study
- OpenGraph image
- Structured data (JSON-LD)
- Analytics hook
- Featured case study toggle