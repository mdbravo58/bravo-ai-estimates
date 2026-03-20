import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle, CheckCircle2, Loader2, ExternalLink, RefreshCw } from 'lucide-react';
import { isAISetupCached, detectAISetupError, markAISetupOk } from './aiSetupUtils';

type Status = 'checking' | 'ok' | 'error';

interface AISetupBannerProps {
  compact?: boolean;
}

export const AISetupBanner: React.FC<AISetupBannerProps> = ({ compact = false }) => {
  const [status, setStatus] = useState<Status>('checking');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const checkSetup = async () => {
    if (isAISetupCached()) {
      setStatus('ok');
      return;
    }

    setStatus('checking');
    try {
      const { data, error } = await supabase.functions.invoke('ai-customer-chat', {
        body: { message: 'ping', conversationHistory: [], currentPage: '/' },
      });

      const setupErr = detectAISetupError(error, data);
      if (setupErr) {
        setErrorMsg(setupErr);
        setStatus('error');
      } else if (error) {
        setErrorMsg(error.message || 'Unknown error calling AI function.');
        setStatus('error');
      } else {
        markAISetupOk();
        setStatus('ok');
      }
    } catch (err: any) {
      const setupErr = detectAISetupError(err, null);
      setErrorMsg(setupErr || err?.message || 'Could not reach AI functions.');
      setStatus('error');
    }
  };

  useEffect(() => {
    checkSetup();
  }, []);

  if (status === 'ok') return null;

  if (status === 'checking') {
    return (
      <Alert className="border-border bg-muted/50">
        <Loader2 className="h-4 w-4 animate-spin" />
        <AlertTitle>Checking AI configuration…</AlertTitle>
      </Alert>
    );
  }

  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>AI Features Not Configured</AlertTitle>
      <AlertDescription className="mt-2 space-y-3">
        <p className="text-sm">{errorMsg}</p>

        {!compact && (
          <div className="space-y-2 text-sm">
            <p className="font-medium">Setup checklist:</p>
            <ol className="list-decimal list-inside space-y-1 text-destructive-foreground/80">
              <li>
                Go to{' '}
                <strong>Supabase Dashboard → Edge Functions → Secrets</strong> and
                add <code className="bg-destructive/20 px-1 rounded text-xs">LOVABLE_API_KEY</code> with
                your Lovable API key.
              </li>
              <li>
                Confirm the edge functions are deployed:{' '}
                <code className="text-xs">ai-estimate-generator</code>,{' '}
                <code className="text-xs">ai-customer-chat</code>,{' '}
                <code className="text-xs">ai-voice-assistant</code>,{' '}
                <code className="text-xs">ai-analytics</code>.
              </li>
            </ol>
          </div>
        )}

        <div className="flex gap-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            className="border-destructive/50 text-destructive-foreground hover:bg-destructive/10"
            onClick={checkSetup}
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Re-check
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-destructive/50 text-destructive-foreground hover:bg-destructive/10"
            asChild
          >
            <a
              href="https://supabase.com/dashboard/project/kgwruguzjidernenftyb/settings/functions"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Open Supabase Secrets
            </a>
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};
