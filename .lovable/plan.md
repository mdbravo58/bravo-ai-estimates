

## Fix: AI Analytics JSON Truncation Bug

**Problem**: The `ai-analytics` edge function requests `max_tokens: 1500`, but the structured JSON response (with KPIs, insights, recommendations, alerts) consistently exceeds that limit, causing truncated JSON that fails to parse.

**Solution**: Two changes in `supabase/functions/ai-analytics/index.ts`:

1. **Increase `max_tokens` from 1500 to 4000** (line ~197) to accommodate the full structured response
2. **Simplify the system prompt** to ask for fewer items (max 3-4 per category) so responses stay within budget, reducing the chance of future truncation

### File: `supabase/functions/ai-analytics/index.ts`
- Line ~197: Change `max_tokens: 1500` → `max_tokens: 4000`
- In the system prompt (~line 109-170): Add instruction "Limit to 3 KPIs, 3 insights, 3 recommendations, and 2 alerts maximum" to keep responses concise
- Keep the existing truncation-repair fallback as a safety net

No other files need changes. The edge function will auto-deploy.

