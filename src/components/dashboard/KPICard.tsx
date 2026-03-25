import { useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface SparklineData {
  value: number;
}

interface KPICardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  sparklineData?: SparklineData[];
  trend?: { value: number; label: string };
  loading?: boolean;
}

export function KPICard({ title, value, icon: Icon, sparklineData, trend, loading }: KPICardProps) {
  const trendPositive = trend && trend.value >= 0;

  if (loading) {
    return (
      <Card className="shadow-card">
        <CardContent className="p-5">
          <Skeleton className="h-4 w-24 mb-3" />
          <Skeleton className="h-8 w-20 mb-3" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card hover:shadow-elegant transition-all">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <Icon className="h-5 w-5 text-muted-foreground/60" />
        </div>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {trend && (
              <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${trendPositive ? 'text-accent' : 'text-destructive'}`}>
                {trendPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                <span>{trendPositive ? '+' : ''}{trend.value}%</span>
                <span className="text-muted-foreground font-normal">{trend.label}</span>
              </div>
            )}
          </div>
          {sparklineData && sparklineData.length > 1 && (
            <div className="h-10 w-24 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineData}>
                  <defs>
                    <linearGradient id={`spark-${title}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    strokeWidth={1.5}
                    fill={`url(#spark-${title})`}
                    dot={false}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
