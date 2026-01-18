import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "./useOrganization";

export interface ServiceType {
  id: string;
  name: string;
  description: string | null;
  base_price: number | null;
  is_active: boolean;
  sort_order: number;
}

export function useServiceTypes() {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { organization } = useOrganization();

  const fetchServiceTypes = async () => {
    if (!organization?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("organization_service_types")
        .select("*")
        .eq("organization_id", organization.id)
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (fetchError) throw fetchError;

      setServiceTypes(data || []);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching service types:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const initializeServiceTypes = async (industry: string) => {
    if (!organization?.id) return;

    try {
      const { error: rpcError } = await supabase.rpc("populate_default_service_types", {
        p_organization_id: organization.id,
        p_industry: industry,
      });

      if (rpcError) throw rpcError;

      // Refresh the list
      await fetchServiceTypes();
    } catch (err: any) {
      console.error("Error initializing service types:", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchServiceTypes();
  }, [organization?.id]);

  return {
    serviceTypes,
    loading,
    error,
    refetch: fetchServiceTypes,
    initializeServiceTypes,
  };
}
