Client Access Restrictions
Client can only:
View own projects
View milestones
View deliverables
Use project messaging
Client cannot:
Access admin routes
See other projects
Modify revenue
Modify milestones
Add strict route protection.

Session Handling
After magic login:
Issue JWT with role CLIENT
Session expires in reasonable time (e.g., 7 days)
Allow logout
Do not allow manual password login for CLIENT role

6️⃣ Admin & Founder Workflow
When creating a new project:
If client email does not exist:
→ Auto-create CLIENT user with password = null
Send onboarding magic link email
Include project overview link

7️⃣ Optional Advanced Security
Add device fingerprint logging
Add IP logging
Add suspicious login detection
Add magic link resend cooldown (60 seconds)

Clients only access via project-specific secure link (no login page at all)