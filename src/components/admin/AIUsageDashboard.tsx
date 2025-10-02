import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, TrendingUp, DollarSign, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UsageSummary {
  feature: string;
  total_requests: number;
  total_cost_usd: number;
  month: string;
}

export const AIUsageDashboard = () => {
  const [usageData, setUsageData] = useState<UsageSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsageData();
  }, []);

  const fetchUsageData = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_usage_summary')
        .select('*')
        .order('month', { ascending: false })
        .limit(12);

      if (error) throw error;
      setUsageData(data || []);
    } catch (error) {
      console.error('Error fetching usage data:', error);
      toast({
        title: "Error",
        description: "Failed to load AI usage data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const totalCost = usageData.reduce((sum, item) => sum + item.total_cost_usd, 0);
  const totalRequests = usageData.reduce((sum, item) => sum + item.total_requests, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total AI Costs</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Current month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRequests.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All features</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Cost/Request</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalRequests > 0 ? (totalCost / totalRequests).toFixed(4) : '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">Per AI call</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usage by Feature</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {usageData.slice(0, 5).map((item) => (
              <div key={`${item.month}-${item.feature}`} className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium capitalize">{item.feature}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(item.month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">${item.total_cost_usd.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">{item.total_requests} requests</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
