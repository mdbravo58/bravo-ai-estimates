import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, TrendingUp, TrendingDown, Clock, Package } from "lucide-react";

interface JobPLReportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: string;
  jobCode: string;
  jobName: string;
}

interface CostCodeSummary {
  code: string;
  name: string;
  cost: number;
  revenue: number;
  hours?: number;
}

interface PLData {
  laborByCode: CostCodeSummary[];
  materialsByCode: CostCodeSummary[];
  totalLabor: number;
  totalMaterials: number;
  totalRevenue: number;
  totalHours: number;
  grossProfit: number;
  margin: number;
}

export const JobPLReport = ({ 
  open, 
  onOpenChange, 
  jobId, 
  jobCode, 
  jobName 
}: JobPLReportProps) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PLData>({
    laborByCode: [],
    materialsByCode: [],
    totalLabor: 0,
    totalMaterials: 0,
    totalRevenue: 0,
    totalHours: 0,
    grossProfit: 0,
    margin: 0
  });

  useEffect(() => {
    if (open && jobId) {
      fetchPLData();
    }
  }, [open, jobId]);

  const fetchPLData = async () => {
    try {
      setLoading(true);

      const [timeResult, materialsResult] = await Promise.all([
        supabase
          .from('time_entries')
          .select(`
            hours,
            burden_rate,
            cost_code:cost_codes(code, name)
          `)
          .eq('job_id', jobId),
        supabase
          .from('material_lines')
          .select(`
            qty,
            unit_cost,
            unit_price,
            cost_code:cost_codes(code, name)
          `)
          .eq('job_id', jobId)
      ]);

      // Group labor by cost code
      const laborMap = new Map<string, CostCodeSummary>();
      let totalLabor = 0;
      let totalHours = 0;

      timeResult.data?.forEach((entry) => {
        const cost = (entry.hours || 0) * (entry.burden_rate || 0);
        const hours = entry.hours || 0;
        totalLabor += cost;
        totalHours += hours;

        if (entry.cost_code) {
          const key = entry.cost_code.code;
          const existing = laborMap.get(key);
          if (existing) {
            existing.cost += cost;
            existing.hours = (existing.hours || 0) + hours;
          } else {
            laborMap.set(key, {
              code: entry.cost_code.code,
              name: entry.cost_code.name,
              cost,
              revenue: 0,
              hours
            });
          }
        }
      });

      // Group materials by cost code
      const materialsMap = new Map<string, CostCodeSummary>();
      let totalMaterials = 0;
      let totalRevenue = 0;

      materialsResult.data?.forEach((line) => {
        const cost = line.qty * line.unit_cost;
        const revenue = line.qty * line.unit_price;
        totalMaterials += cost;
        totalRevenue += revenue;

        if (line.cost_code) {
          const key = line.cost_code.code;
          const existing = materialsMap.get(key);
          if (existing) {
            existing.cost += cost;
            existing.revenue += revenue;
          } else {
            materialsMap.set(key, {
              code: line.cost_code.code,
              name: line.cost_code.name,
              cost,
              revenue
            });
          }
        }
      });

      const totalCost = totalLabor + totalMaterials;
      const grossProfit = totalRevenue - totalCost;
      const margin = totalRevenue > 0 ? (grossProfit / totalRevenue * 100) : 0;

      setData({
        laborByCode: Array.from(laborMap.values()).sort((a, b) => a.code.localeCompare(b.code)),
        materialsByCode: Array.from(materialsMap.values()).sort((a, b) => a.code.localeCompare(b.code)),
        totalLabor,
        totalMaterials,
        totalRevenue,
        totalHours,
        grossProfit,
        margin
      });
    } catch (error) {
      console.error('Error fetching P&L data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Profit & Loss Report</DialogTitle>
          <p className="text-sm text-muted-foreground">{jobCode} - {jobName}</p>
        </DialogHeader>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Revenue</span>
                  </div>
                  <p className="text-xl font-bold mt-1">${data.totalRevenue.toLocaleString()}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    {data.grossProfit >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm text-muted-foreground">Gross Profit</span>
                  </div>
                  <p className={`text-xl font-bold mt-1 ${data.grossProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${data.grossProfit.toLocaleString()} ({data.margin.toFixed(1)}%)
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Labor Costs */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Labor Costs
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {data.laborByCode.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No labor entries recorded</p>
                ) : (
                  <div className="space-y-2">
                    {data.laborByCode.map((item) => (
                      <div key={item.code} className="flex justify-between items-center py-2 border-b last:border-0">
                        <div>
                          <p className="font-medium text-sm">{item.code}</p>
                          <p className="text-xs text-muted-foreground">{item.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${item.cost.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">{item.hours?.toFixed(1)} hrs</p>
                        </div>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between items-center pt-2">
                      <p className="font-semibold">Total Labor</p>
                      <div className="text-right">
                        <p className="font-semibold">${data.totalLabor.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{data.totalHours.toFixed(1)} hrs</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Material Costs */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Material Costs
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {data.materialsByCode.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No material entries recorded</p>
                ) : (
                  <div className="space-y-2">
                    {data.materialsByCode.map((item) => (
                      <div key={item.code} className="flex justify-between items-center py-2 border-b last:border-0">
                        <div>
                          <p className="font-medium text-sm">{item.code}</p>
                          <p className="text-xs text-muted-foreground">{item.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${item.cost.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Revenue: ${item.revenue.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between items-center pt-2">
                      <p className="font-semibold">Total Materials</p>
                      <p className="font-semibold">${data.totalMaterials.toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bottom Line */}
            <Card className={data.grossProfit >= 0 ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50'}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Cost</p>
                    <p className="font-semibold">${(data.totalLabor + data.totalMaterials).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Net Margin</p>
                    <p className={`text-xl font-bold ${data.grossProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {data.margin.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};