import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Organization {
  id: string;
  name: string;
  logo_url: string | null;
  business_phone: string | null;
  business_email: string | null;
  address: string | null;
  plan: string | null;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  organization_id: string;
}

interface UseOrganizationReturn {
  organization: Organization | null;
  userData: UserData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateOrganization: (updates: Partial<Organization>) => Promise<boolean>;
}

export function useOrganization(): UseOrganizationReturn {
  const { user } = useAuth();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganization = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // First, get the user's organization_id from the users table
      const { data: userRecord, error: userError } = await supabase
        .from('users')
        .select('id, name, email, role, organization_id')
        .eq('auth_user_id', user.id)
        .maybeSingle();

      if (userError) {
        console.error('Error fetching user record:', userError.message);
        setError('Failed to load user data');
        setLoading(false);
        return;
      }

      // If no user record exists, call ensure-user-org to create one
      if (!userRecord) {
        console.log('No user record found, creating organization...');
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.access_token) {
          const { error: fnError } = await supabase.functions.invoke('ensure-user-org', {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          });
          
          if (fnError) {
            console.error('Error creating organization:', fnError);
            setError('Failed to create organization');
            setLoading(false);
            return;
          }
          
          // Retry fetching after creation
          const { data: newUserRecord, error: retryError } = await supabase
            .from('users')
            .select('id, name, email, role, organization_id')
            .eq('auth_user_id', user.id)
            .maybeSingle();
          
          if (retryError || !newUserRecord) {
            console.error('Failed to fetch user after org creation:', retryError?.message);
            setError('Failed to load user data');
            setLoading(false);
            return;
          }
          
          setUserData(newUserRecord as UserData);
          
          // Fetch the newly created organization
          const { data: orgData, error: orgError } = await supabase
            .from('organizations')
            .select('id, name, logo_url, business_phone, business_email, address, plan')
            .eq('id', newUserRecord.organization_id)
            .single();

          if (orgError) {
            console.error('Error fetching organization:', orgError.message);
            setError('Failed to load organization');
          } else {
            setOrganization(orgData as Organization);
          }
        } else {
          setError('No active session');
        }
        
        setLoading(false);
        return;
      }

      // User record exists, set user data and fetch organization
      setUserData(userRecord as UserData);

      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('id, name, logo_url, business_phone, business_email, address, plan')
        .eq('id', userRecord.organization_id)
        .single();

      if (orgError) {
        console.error('Error fetching organization:', orgError.message);
        setError('Failed to load organization');
      } else {
        setOrganization(orgData as Organization);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const updateOrganization = useCallback(async (updates: Partial<Organization>): Promise<boolean> => {
    if (!organization?.id) return false;

    try {
      const { error: updateError } = await supabase
        .from('organizations')
        .update(updates)
        .eq('id', organization.id);

      if (updateError) {
        console.error('Error updating organization:', updateError.message);
        return false;
      }

      // Refetch to get updated data
      await fetchOrganization();
      return true;
    } catch (err) {
      console.error('Unexpected error updating organization:', err);
      return false;
    }
  }, [organization?.id, fetchOrganization]);

  useEffect(() => {
    fetchOrganization();
  }, [fetchOrganization]);

  return {
    organization,
    userData,
    loading,
    error,
    refetch: fetchOrganization,
    updateOrganization,
  };
}
