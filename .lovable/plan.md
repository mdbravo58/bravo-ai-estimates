# Rename to "Prime Plumbing Company"

You're right — the rebrand used "Prime Company" but it should be **"Prime Plumbing Company"** everywhere. I'll do a clean global replace across the whole app.

## What changes

Every occurrence of `Prime Company` → `Prime Plumbing Company` in:

**Browser/SEO**
- `index.html` (title, author, og:title)

**Global override (most important — forces the name everywhere a logged-in user sees it)**
- `src/hooks/useOrganization.tsx` — `DISPLAY_ORGANIZATION_NAME`
- `src/pages/EstimatePortal.tsx` — `DISPLAY_ORGANIZATION_NAME`
- `src/components/layout/Header.tsx` — `displayOrganizationName`

**Public pages**
- `src/pages/Cover.tsx` (blue sales page — header, hero alt text, copy, CTA)
- `src/pages/LandingPage.tsx` (header, footer, copy)
- `src/pages/Pricing.tsx`, `Privacy.tsx`, `Terms.tsx` (headers, body, copyright)
- `src/pages/Auth.tsx` (sign-in card title)

**In-app**
- `src/pages/Settings.tsx` (default company name fallback)
- `src/pages/Payroll.tsx`, `src/pages/AI.tsx` (body copy)
- `src/components/onboarding/OnboardingFlow.tsx` (welcome + completion screens)
- `src/components/demo/DemoSetup.tsx` (demo titles)
- `src/components/portal/CustomerPortal.tsx` (customer-facing portal header)
- `src/components/estimates/EstimateBuilder.tsx` (PDF header text)
- `src/components/quickbooks/QuickBooksIntegration.tsx` (description copy)
- `src/components/ai/CustomerChatWidget.tsx` (assistant intro)

**Database migration**
- New migration to update any `organizations.name` currently set to `'Prime Company'` → `'Prime Plumbing Company'` (so existing rows from the previous cleanup migration get the corrected name).

## Memory update
- Update the white-label memory rule so future work uses "Prime Plumbing Company" as the display name.

No new files, no logic changes — purely a string rename + one small SQL migration.
