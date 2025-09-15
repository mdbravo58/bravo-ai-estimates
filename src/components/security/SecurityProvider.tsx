import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface SecurityContext {
  isSecureSession: boolean;
  sessionRisk: 'low' | 'medium' | 'high';
  rateLimitStatus: {
    remaining: number;
    resetTime: Date | null;
  };
  auditLog: (action: string, details?: Record<string, any>) => Promise<void>;
}

const SecurityContext = createContext<SecurityContext | null>(null);

export const useSecurityContext = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error("useSecurityContext must be used within SecurityProvider");
  }
  return context;
};

interface SecurityProviderProps {
  children: ReactNode;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSecureSession, setIsSecureSession] = useState(true);
  const [sessionRisk, setSessionRisk] = useState<'low' | 'medium' | 'high'>('low');
  const [rateLimitStatus, setRateLimitStatus] = useState({
    remaining: 100,
    resetTime: null as Date | null
  });

  // Security monitoring
  useEffect(() => {
    if (!user) return;

    const checkSessionSecurity = async () => {
      try {
        // Check session validity
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error || !session) {
          setIsSecureSession(false);
          return;
        }

        // Check for suspicious activity patterns
        const risk = await assessSessionRisk(user.id);
        setSessionRisk(risk);

        // Log security check
        await auditLog('security_check', { 
          sessionId: session.access_token.substring(0, 10) + '...',
          risk 
        });

      } catch (error) {
        console.error('Security check failed:', error);
        setSessionRisk('high');
      }
    };

    // Initial check
    checkSessionSecurity();

    // Periodic security checks every 5 minutes
    const interval = setInterval(checkSessionSecurity, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user]);

  // Rate limiting monitoring
  useEffect(() => {
    const updateRateLimit = () => {
      // This would typically be updated by response headers from API calls
      // For now, simulate decreasing rate limit
      setRateLimitStatus(prev => ({
        remaining: Math.max(0, prev.remaining - 1),
        resetTime: prev.resetTime || new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now
      }));
    };

    // Listen for API calls and update rate limit status
    const interval = setInterval(() => {
      if (rateLimitStatus.resetTime && new Date() > rateLimitStatus.resetTime) {
        setRateLimitStatus({
          remaining: 100,
          resetTime: new Date(Date.now() + 60 * 60 * 1000)
        });
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [rateLimitStatus.resetTime]);

  // Security alerts
  useEffect(() => {
    if (sessionRisk === 'high') {
      toast({
        title: "Security Alert",
        description: "Unusual activity detected. Please review your account security.",
        variant: "destructive"
      });
    }

    if (rateLimitStatus.remaining < 10) {
      toast({
        title: "Rate Limit Warning",
        description: "You're approaching your API rate limit. Please slow down your requests.",
        variant: "destructive"
      });
    }
  }, [sessionRisk, rateLimitStatus.remaining, toast]);

  const assessSessionRisk = async (userId: string): Promise<'low' | 'medium' | 'high'> => {
    try {
      // Check for multiple failed login attempts
      const { data: authLogs } = await supabase
        .from('staging_events')
        .select('*')
        .eq('provider', 'auth')
        .contains('payload', { user_id: userId })
        .gte('received_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
        .order('received_at', { ascending: false })
        .limit(50);

      if (!authLogs) return 'low';

      // Analyze patterns
      const failedAttempts = authLogs.filter(log => 
        log.payload?.event === 'signin_failed' || 
        log.payload?.error_code === 'invalid_credentials'
      ).length;

      const uniqueIPs = new Set(authLogs.map(log => log.payload?.ip_address)).size;

      // Risk assessment logic
      if (failedAttempts > 5 || uniqueIPs > 3) {
        return 'high';
      } else if (failedAttempts > 2 || uniqueIPs > 1) {
        return 'medium';
      }

      return 'low';
    } catch (error) {
      console.error('Risk assessment failed:', error);
      return 'medium'; // Default to medium risk on error
    }
  };

  const auditLog = async (action: string, details?: Record<string, any>) => {
    if (!user) return;

    try {
      await supabase.from('staging_events').insert({
        organization_id: user.user_metadata?.organization_id,
        provider: 'security_audit',
        payload: {
          user_id: user.id,
          action,
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent,
          ip_address: 'client_side', // Would be set by server in real implementation
          ...details
        }
      });
    } catch (error) {
      console.error('Audit logging failed:', error);
    }
  };

  const value: SecurityContext = {
    isSecureSession,
    sessionRisk,
    rateLimitStatus,
    auditLog
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};

export default SecurityProvider;