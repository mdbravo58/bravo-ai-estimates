import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import {
  FileText,
  Users,
  Calculator,
  BookOpen,
  CreditCard,
  Settings,
  BarChart3,
  ChevronLeft,
  Home,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", icon: Home, href: "/" },
  { name: "Estimates", icon: FileText, href: "/estimates" },
  { name: "Customers", icon: Users, href: "/customers" },
  { name: "Price Books", icon: BookOpen, href: "/price-books" },
  { name: "Calculator", icon: Calculator, href: "/calculator" },
  { name: "Reports", icon: BarChart3, href: "/reports" },
  { name: "Billing", icon: CreditCard, href: "/billing" },
  { name: "Settings", icon: Settings, href: "/settings" },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

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
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.name}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 px-3 py-2 text-left font-normal",
                collapsed && "justify-center px-0"
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