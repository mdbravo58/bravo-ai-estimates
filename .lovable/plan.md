

## Remove hardcoded plan footer from Sidebar

**File:** `src/components/layout/Sidebar.tsx`

Remove the footer `<div>` block (lines ~220-226) that displays "Professional Plan / 2 users • 150 estimates/month". This is hardcoded and misleading — it doesn't reflect the user's actual plan.

