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

Add or Edit Description of subservice should have an editor like the service description which shown in the subservice page
