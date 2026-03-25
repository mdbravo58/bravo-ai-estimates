import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileText, CheckCircle, Send, Clock, Users, Briefcase, CreditCard, LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ActivityItem {
  id: string;
  type: "estimate_created" | "estimate_approved" | "estimate_sent" | "invoice_created" | "customer_added" | "job_created";
  title: string;
  description: string;
  timestamp: string;
}

const activityConfig: Record<ActivityItem["type"], { icon: LucideIcon; color: string }> = {
  estimate_created: { icon: FileText, color: "bg-primary/10 text-primary" },
  estimate_approved: { icon: CheckCircle, color: "bg-accent/10 text-accent" },
  estimate_sent: { icon: Send, color: "bg-primary/10 text-primary" },
  invoice_created: { icon: CreditCard, color: "bg-accent/10 text-accent" },
  customer_added: { icon: Users, color: "bg-secondary text-secondary-foreground" },
  job_created: { icon: Briefcase, color: "bg-primary/10 text-primary" },
};

interface ActivityFeedProps {
  activities: ActivityItem[];
  loading?: boolean;
}

export function ActivityFeed({ activities, loading }: ActivityFeedProps) {
  if (loading) {
    return (
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-8 w-8 rounded-full shrink-0" />
              <div className="flex-1">
                <Skeleton className="h-4 w-3/4 mb-1" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-base">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            <Clock className="h-8 w-8 mx-auto mb-2 opacity-40" />
            No recent activity
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, i) => {
              const config = activityConfig[activity.type];
              const Icon = config.icon;
              return (
                <div key={activity.id} className="flex gap-3 items-start">
                  <div className={cn("h-8 w-8 rounded-full flex items-center justify-center shrink-0", config.color)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-tight truncate">{activity.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{activity.description}</p>
                    <p className="text-xs text-muted-foreground/70 mt-0.5">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
