import React, { useState, useCallback } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, WifiOff, CreditCard } from 'lucide-react';

interface AISetupBannerProps {
  compact?: boolean;
}

type ErrorState = {
  type: 'setup' | 'credits' | 'not_deployed' | 'generic';
  message: string;
} | null;

/**
 * Reactive-only banner: no on-mount test call.
 * Components call `showError(...)` when a real AI call fails.
 * Use the ref via AISetupBannerContext or pass the setter down.
 */
export const AISetupBannerContext = React.createContext<{
  showError: (err: { type: 'setup' | 'credits' | 'not_deployed' | 'generic'; message: string }) => void;
  clearError: () => void;
}>({ showError: () => {}, clearError: () => {} });

export const AISetupBannerProvider: React.FC<{ children: React.ReactNode; compact?: boolean }> = ({ children, compact = false }) => {
  const [error, setError] = useState<ErrorState>(null);

  const showError = useCallback((err: NonNullable<ErrorState>) => setError(err), []);
  const clearError = useCallback(() => setError(null), []);

  return (
    <AISetupBannerContext.Provider value={{ showError, clearError }}>
      {error && <AISetupBannerInner error={error} onDismiss={clearError} compact={compact} />}
      {children}
    </AISetupBannerContext.Provider>
  );
};

function AISetupBannerInner({ error, onDismiss, compact }: { error: NonNullable<ErrorState>; onDismiss: () => void; compact: boolean }) {
  if (error.type === 'credits') {
    return (
      <Alert className="border-amber-500/50 bg-amber-50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200">
        <CreditCard className="h-4 w-4 text-amber-600" />
        <AlertTitle>AI Credits Exhausted</AlertTitle>
        <AlertDescription className="text-sm mt-1">
          {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (error.type === 'setup' || error.type === 'not_deployed') {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>AI Features Not Configured</AlertTitle>
        <AlertDescription className="mt-2 space-y-2">
          <p className="text-sm">{error.message}</p>
          {!compact && (
            <div className="text-sm space-y-1">
              <p className="font-medium">To fix this, your administrator should:</p>
              <ol className="list-decimal list-inside space-y-1 opacity-80">
                {error.type === 'setup' && (
                  <li>
                    Add <code className="bg-destructive/20 px-1 rounded text-xs">LOVABLE_API_KEY</code> in
                    Supabase Dashboard → Edge Functions → Secrets.
                  </li>
                )}
                {error.type === 'not_deployed' && (
                  <li>Deploy the AI edge functions from the Supabase Dashboard.</li>
                )}
                <li>Retry the action after completing the above.</li>
              </ol>
            </div>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant="destructive">
      <WifiOff className="h-4 w-4" />
      <AlertTitle>AI Error</AlertTitle>
      <AlertDescription className="text-sm mt-1">{error.message}</AlertDescription>
    </Alert>
  );
}

/** Standalone banner for Settings page — shows nothing until an error is pushed */
export const AISetupBanner: React.FC<AISetupBannerProps> = ({ compact = false }) => {
  // On Settings, we just render the provider wrapper with no children content.
  // The actual errors are shown via context from AI components.
  // For a standalone display, we show a static "all good" or nothing.
  return null;
};
