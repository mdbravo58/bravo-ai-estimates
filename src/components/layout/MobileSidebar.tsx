import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  FileText,
  Users,
  Calculator,
  BookOpen,
  CreditCard,
  Settings,
  BarChart3,
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
  Menu,
  
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
      { name: "Leads", icon: Activity, href: "/leads" },
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
      { name: "Bravo AI Systems", icon: Zap, href: "/ghl" },
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

interface MobileSidebarProps {
  className?: string;
}

export function MobileSidebar({ className }: MobileSidebarProps) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (href: string) => currentPath === href;

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className="h-10 w-10 p-0 md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="text-left">Menu</SheetTitle>
          </SheetHeader>
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
            {navigationGroups.map((group) => (
              <div key={group.label}>
                <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.label}
                </p>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <Button
                        key={item.name}
                        variant="ghost"
                        className={cn(
                          "w-full justify-start gap-3 px-3 py-2 text-left font-normal",
                          active && "bg-primary/10 text-primary font-medium"
                        )}
                        asChild
                        onClick={() => setOpen(false)}
                      >
                        <Link to={item.href}>
                          <Icon className="h-5 w-5 shrink-0" />
                          <span>{item.name}</span>
                        </Link>
                      </Button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="border-t pt-3">
              {standaloneItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Button
                    key={item.name}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3 px-3 py-2 text-left font-normal",
                      active && "bg-primary/10 text-primary font-medium"
                    )}
                    asChild
                    onClick={() => setOpen(false)}
                  >
                    <Link to={item.href}>
                      <Icon className="h-5 w-5 shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  </Button>
                );
              })}
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}
