import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  FileText,
  Users,
  Calculator,
  BookOpen,
  CreditCard,
  Settings,
  BarChart3,
  ChevronLeft,
  ChevronDown,
  Home,
  Brain,
  Zap,
  Calendar,
  UserCog,
  Briefcase,
  Activity,
  MapPin,
  Receipt,
  DollarSign,
  LucideIcon,
} from "lucide-react";

interface NavItem {
  name: string;
  icon: LucideIcon;
  href: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navigationGroups: NavGroup[] = [
  {
    label: "Main",
    items: [
      { name: "Dashboard", icon: Home, href: "/dashboard" },
      { name: "Estimates", icon: FileText, href: "/estimates" },
      { name: "Jobs", icon: Briefcase, href: "/jobs" },
      { name: "Customers", icon: Users, href: "/customers" },
    ],
  },
  {
    label: "Operations",
    items: [
      { name: "Scheduling", icon: Calendar, href: "/scheduling" },
      { name: "GPS Tracking", icon: MapPin, href: "/gps-tracking" },
      { name: "Team", icon: UserCog, href: "/team" },
    ],
  },
  {
    label: "Finance",
    items: [
      { name: "Billing", icon: CreditCard, href: "/billing" },
      { name: "Price Books", icon: BookOpen, href: "/price-books" },
      { name: "Calculator", icon: Calculator, href: "/calculator" },
      { name: "Reports", icon: BarChart3, href: "/reports" },
      { name: "Payroll", icon: DollarSign, href: "/payroll" },
    ],
  },
  {
    label: "Integrations",
    items: [
      { name: "GoHighLevel", icon: Zap, href: "/ghl" },
      { name: "QuickBooks", icon: Receipt, href: "/quickbooks" },
    ],
  },
  {
    label: "AI Tools",
    items: [
      { name: "AI Assistant", icon: Brain, href: "/ai" },
      { name: "AI Usage", icon: Activity, href: "/ai-usage" },
    ],
  },
];

const standaloneItems: NavItem[] = [
  { name: "Settings", icon: Settings, href: "/settings" },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  // Track which groups are open
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    // Initialize with groups that contain the active route open
    const initial: Record<string, boolean> = {};
    navigationGroups.forEach((group) => {
      const hasActiveItem = group.items.some((item) => currentPath === item.href);
      initial[group.label] = hasActiveItem || group.label === "Main";
    });
    return initial;
  });

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const isActive = (href: string) => currentPath === href;

  return (
    <div
      className={cn(
        "relative flex h-full flex-col border-r bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Collapse Toggle */}
      <div className="flex h-16 items-center justify-end px-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform",
              collapsed && "rotate-180"
            )}
          />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-4">
        {navigationGroups.map((group) => {
          const isGroupOpen = openGroups[group.label];
          const hasActiveItem = group.items.some((item) => isActive(item.href));

          return (
            <Collapsible
              key={group.label}
              open={collapsed ? false : isGroupOpen}
              onOpenChange={() => !collapsed && toggleGroup(group.label)}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground",
                    collapsed && "justify-center px-0",
                    hasActiveItem && "text-primary"
                  )}
                >
                  {!collapsed && <span>{group.label}</span>}
                  {collapsed ? (
                    <div className="h-1 w-4 rounded bg-muted-foreground/30" />
                  ) : (
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        isGroupOpen && "rotate-180"
                      )}
                    />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 pt-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Button
                      key={item.name}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-3 px-3 py-2 text-left font-normal",
                        collapsed && "justify-center px-0",
                        active && "bg-primary/10 text-primary font-medium"
                      )}
                      asChild
                    >
                      <Link to={item.href} aria-label={item.name}>
                        <Icon className="h-5 w-5 shrink-0" />
                        {!collapsed && <span>{item.name}</span>}
                      </Link>
                    </Button>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>
          );
        })}

        {/* Collapsed view - show all icons */}
        {collapsed && (
          <div className="space-y-1 pt-2">
            {navigationGroups.flatMap((group) =>
              group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Button
                    key={item.name}
                    variant="ghost"
                    className={cn(
                      "w-full justify-center p-2",
                      active && "bg-primary/10 text-primary"
                    )}
                    asChild
                    title={item.name}
                  >
                    <Link to={item.href} aria-label={item.name}>
                      <Icon className="h-5 w-5 shrink-0" />
                    </Link>
                  </Button>
                );
              })
            )}
          </div>
        )}

        {/* Separator before standalone items */}
        <div className="my-4 border-t" />

        {/* Standalone Items */}
        {standaloneItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Button
              key={item.name}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 px-3 py-2 text-left font-normal",
                collapsed && "justify-center px-0",
                active && "bg-primary/10 text-primary font-medium"
              )}
              asChild
            >
              <Link to={item.href} aria-label={item.name}>
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            </Button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-3">
        <div className={cn("text-xs text-muted-foreground", collapsed && "hidden")}>
          <p className="font-medium">Professional Plan</p>
          <p>2 users • 150 estimates/month</p>
        </div>
      </div>
    </div>
  );
}
