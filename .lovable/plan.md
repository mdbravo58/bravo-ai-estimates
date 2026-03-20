## Rebrand "GHL / GoHighLevel" → "Bravo AI Systems" across UI

This changes all user-facing text that says "GHL", "GoHighLevel", or "GoHigh Level" to "Bravo AI Systems" or BAS for short . Internal code (database column names, edge function names, env vars) stays unchanged since renaming those would break the integration.

### Files to change

1. `**src/components/layout/Sidebar.tsx**` (~line 76)
  - `"GoHighLevel"` → `"Bravo AI Systems"`
2. `**src/pages/GHL.tsx**` (lines 9-11)
  - Title: `"GoHighLevel Integration"` → `"Bravo AI Systems Integration"`
  - Description: replace "GoHighLevel's marketing automation and CRM" → "Bravo AI Systems' marketing automation and CRM"
3. `**src/components/ghl/GHLIntegration.tsx**`
  - All user-facing strings: card titles, descriptions, toast messages, labels referencing "GHL" or "GoHighLevel" → "Bravo AI Systems"
4. `**src/pages/Settings.tsx**` (lines 245-248, 546-552)
  - Sidebar menu label: `"GoHighLevel Integration"` → `"Bravo AI Systems Integration"`
  - Integrations card: `"GoHighLevel"` → `"Bravo AI Systems"`
5. `**src/components/onboarding/OnboardingFlow.tsx**` (lines 43, 394)
  - Step description and integration card: `"GoHighLevel"` → `"Bravo AI Systems"`
6. `**src/components/ai/AIEstimateGenerator.tsx**` (lines 264, 269, 570)
  - Toast messages and button text: `"GHL"` / `"GoHighLevel"` → `"Bravo AI Systems"`
7. `**src/components/quickbooks/QuickBooksIntegration.tsx**` (line 329)
  - `"GHL handles the invoicing"` → `"Bravo AI Systems handles the invoicing"`
8. `**src/pages/Privacy.tsx**` (line 73)
  - `"GoHighLevel"` → `"Bravo AI Systems"`
9. `**src/components/scheduling/CreateAppointmentDialog.tsx**`
  - Any user-facing "GHL" references in labels/messages

### What stays unchanged

- Edge function names (`ghl-*`) — renaming would break deployments
- Database columns (`ghl_contact_id`, `ghl_location_id`, etc.) — renaming would require migrations
- Environment variables (`GHL_API_KEY`, `GHL_WEBHOOK_TOKEN`)
- Internal variable names and type definitions
- Route path `/ghl` (functional, not user-visible in a meaningful way — but can rename if desired)