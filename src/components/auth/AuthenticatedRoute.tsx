import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface AuthenticatedRouteProps {
  children: React.ReactNode;
}

export const AuthenticatedRoute = ({ children }: AuthenticatedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
};