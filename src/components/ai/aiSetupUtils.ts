export function detectAISetupError(error: any, data: any): { type: 'setup' | 'credits' | 'not_deployed'; message: string } | null {
  const msg = [
    error?.message,
    error?.context?.body?.message,
    data?.error,
    typeof error === 'string' ? error : '',
  ]
    .filter(Boolean)
    .join(' ');

  if (/api key not configured|api_key.*not|missing.*api.*key|lovable_api_key/i.test(msg)) {
    return { type: 'setup', message: 'The LOVABLE_API_KEY is not configured in your Supabase Edge Function secrets.' };
  }
  if (/credits exhausted|quota exceeded|rate limit/i.test(msg)) {
    return { type: 'credits', message: 'AI credits have been exhausted or rate-limited. Please check your billing plan or wait and try again.' };
  }
  if (/function not found|no such function|404/i.test(msg)) {
    return { type: 'not_deployed', message: 'The AI edge function is not deployed. Please deploy it from the Supabase Dashboard.' };
  }
  return null;
}

export function markAISetupOk() {
  try {
    sessionStorage.setItem('ai_setup_ok', 'true');
  } catch {}
}

export function clearAISetupCache() {
  try {
    sessionStorage.removeItem('ai_setup_ok');
  } catch {}
}
