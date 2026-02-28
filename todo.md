Create Expense Error: TypeError: Cannot read properties of undefined (reading 'id')
    at <unknown> (app\api\admin\expenses\route.ts:47:44)
  45 |                 note,
  46 |                 status: "PENDING",
> 47 |                 proposedById: session.user.id
     |                                            ^
  48 |             }
  49 |         });
  50 |
 