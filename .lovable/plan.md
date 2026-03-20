

## Plan: AI Setup Error Handling and Setup Guide UI

### What we're building
1. A shared `AISetupBanner` component that shows a setup checklist when AI features aren't configured
2. Improved error handling in all 4 AI components to detect "API key not configured" errors and show specific guidance instead of generic failure toasts
3. The banner on `/ai` page and `/settings` page, auto-dismissing on success

### Files to create
- **`src/components/ai/AISetupBanner.tsx`** — Reusable alert banner with:
  - State tracking: `aiStatus` = `'checking' | 'error' | 'ok'`
  - On mount, makes a lightweight test call to `ai-customer-chat` (or checks localStorage for cached success)
  - If error response contains "API key" or "not configured", shows setup checklist
  - Checklist items: (1) Set `LOVABLE_API_KEY` in Supabase Dashboard → Edge Functions → Secrets, (2) Confirm edge functions are deployed
  - Link to `https://supabase.com/dashboard/project/kgwruguzjidernenftyb/settings/functions`
  - Stores success in sessionStorage so banner hides after first successful call

### Files to modify

- **`src/components/ai/AIEstimateGenerator.tsx`** (lines ~108-114) — In catch block, detect if `error.message` or `data?.error` contains "API key" / "not configured" / "credits exhausted" and show a specific toast with setup instructions instead of generic "Failed to generate estimate"

- **`src/components/ai/CustomerChatWidget.tsx`** (lines ~115-121) — Same pattern: detect API key error, show specific message in chat UI ("AI is not configured yet. Please ask your admin to set up the LOVABLE_API_KEY in Supabase secrets.")

- **`src/components/ai/VoiceAssistant.tsx`** (lines ~122-128) — Same error detection pattern in processAudio catch block

- **`src/components/ai/AIAnalyticsDashboard.tsx`** (lines ~90-96) — Same pattern in generateAnalytics catch block; also set a local `setupError` state that renders inline setup instructions

- **`src/pages/AI.tsx`** — Import and render `<AISetupBanner />` between the header and Tabs

- **`src/pages/Settings.tsx`** — Add an "AI Features" card in the integrations section that renders `<AISetupBanner />`

### Error detection logic (shared helper)
```typescript
function isAISetupError(error: any, data: any): string | null {
  const msg = error?.message || data?.error || '';
  if (/api key not configured/i.test(msg)) return 'LOVABLE_API_KEY is not set';
  if (/credits exhausted/i.test(msg)) return 'AI credits exhausted';
  return null;
}
```

### Technical details
- No backend changes — frontend only
- Banner uses `Alert` component from shadcn with `variant="destructive"` for errors
- Test call uses a minimal payload to `ai-customer-chat` to check if the key is configured
- sessionStorage key `ai_setup_ok` caches successful state per session so repeated checks aren't needed

