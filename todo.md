One thing, that is, here is the option to edit and delete payments. Yes, for now, I would see if the revenue minus is shown on the dashboard.

Big agencies like Accenture, TCS, or even high-end boutique agencies use Client Portals to bridge the gap between "working on a project" and "making the client feel secure. I also make my website like them (Professional Client Experience (CX))

### 1. Implementing the 20/10/70 Logic

In your schema, the `Payment` model is the trigger. When a payment is recorded, you need a function in your backend to create the `LedgerEntry` records.

**The Algorithm:**

1. **Company Fund (20%):** Create a `LedgerEntry` with `type: COMPANY_FUND`. Leave `userId` as `null` (since this belongs to the business, not an individual).
2. **Finder’s Fee (10%):** Fetch the `finderId` from the `Project`. Create a `LedgerEntry` for that `userId` with `type: FINDER_FEE`.
3. **Execution Pool (70%):** Fetch all `ProjectMember` records for that project.
* Calculate the total execution pool: .
* For each member, calculate their individual cut: .
* Create a `LedgerEntry` for each member with `type: EXECUTION`.



**Database Update:** After creating the entries, you must increment the `totalBDT` or `totalUSD` in the `LedgerBalance` table for each involved `userId` so their dashboards reflect their new earnings.

---

### 2. How Clients See Progress (What Pros Do)

Currently, your schema has a `ProjectStatus` (Active/Completed), but that is too "binary" for a client. They want to see the **journey**.

To make this professional, you should add a **Milestone** model to your Prisma schema. Big agencies use milestones to show transparency and prevent "ghosting" anxiety.

**Add this to your Prisma Schema:**

```prisma
model Milestone {
  id          String    @id @default(cuid())
  projectId   String
  title       String
  description String?
  order       Int       @default(0)
  status      MilestoneStatus @default(PENDING)
  completedAt DateTime?
  project     Project   @relation(fields: [projectId], references: [id])
}

enum MilestoneStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
}

```

**How the client accesses it:**
Big companies usually do one of two things:

1. **The Magic Link (Low Friction):** Add a `viewToken` field (a unique UUID) to the `Project` model. You send the client a link like `codencognition.com/portal/project/[viewToken]`. They don't need a password; they just see their project's progress.
<!-- 2. **Client Login:** You create a `User` for them with a `Role.CLIENT` and restrict their view so they only see their own project milestones. -->

---

### 3. Suggested Professional Features to Add

To make **Code & Cognition** look like a top-tier global agency, I suggest adding these two specific features to your schema:

#### A. The "Activity Log" (Transparency)

Clients love seeing that work is happening daily.

* **Feature:** Create an `ActivityLog` model that records whenever a developer moves a task or completes a milestone.
* **Client View:** The client sees a feed like: *"Feb 19: Md. Nur E Alam updated the ML model architecture."*

#### B. The "Project Health" Indicator

This is a standard feature in enterprise project management (like Jira or Asana).

* **Feature:** Add a `health` field to the `Project` model (Enum: GREEN, YELLOW, RED).
* **Value:** It tells the client instantly if the project is on track.
* **Green:** Everything is perfect.
* **Yellow:** Slight delay, but we are handling it.
* **Red:** We have a blocker and need a meeting.



---

### 4. Handling Dual Currency in Ledgers

Since you have `amountBDT` and `amountUSD` as optional fields in `LedgerEntry`, make sure your logic checks the `currency` type from the `Payment` first.
----

commented the prisma schema file so that it can be understand what is do in the frontedn side by reading the file
