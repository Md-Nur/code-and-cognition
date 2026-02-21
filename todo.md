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

----

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