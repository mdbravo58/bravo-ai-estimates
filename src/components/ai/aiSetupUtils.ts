export function detectAISetupError(error: any, data: any): string | null {
  const msg = [
    error?.message,
    error?.context?.body?.message,
    data?.error,
    typeof error === 'string' ? error : '',
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  if (/api key not configured|api_key.*not|missing.*api.*key|lovable_api_key/i.test(msg)) {
    return 'The LOVABLE_API_KEY is not configured in your Supabase Edge Function secrets.';
  }
  if (/credits exhausted|quota exceeded|rate limit/i.test(msg)) {
    return 'AI credits have been exhausted or rate-limited. Please check your plan.';
  }
  if (/function not found|no such function|404/i.test(msg)) {
    return 'The AI edge function is not deployed. Please deploy it from the Supabase Dashboard.';
  }
  return null;
}

export function markAISetupOk() {
  try {
    sessionStorage.setItem('ai_setup_ok', 'true');
  } catch {}
}

export function isAISetupCached(): boolean {
  try {
    return sessionStorage.getItem('ai_setup_ok') === 'true';
  } catch {
    return false;
  }
}
