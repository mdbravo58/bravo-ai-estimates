import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import {
  LayoutGrid,
  FileText,
  Users,
  Calculator,
  BookOpen,
  CreditCard,
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
  Settings,
  Smartphone,
  HelpCircle,
  ExternalLink,
  Send,
  RefreshCw,
  Workflow,
  type LucideIcon,
} from "lucide-react";

interface ResourceItem {
  name: string;
  desc: string;
  icon: LucideIcon;
  href: string;
  external?: boolean;
}

interface ResourceGroup {
  label: string;
  items: ResourceItem[];
}

const groups: ResourceGroup[] = [
  {
    label: "Run the business",
    items: [
      { name: "Dashboard", desc: "KPIs & today's activity", icon: Home, href: "/dashboard" },
      { name: "Estimates", desc: "Quote and proposal builder", icon: FileText, href: "/estimates" },
      { name: "Jobs", desc: "Active & scheduled work", icon: Briefcase, href: "/jobs" },
      { name: "Customers", desc: "Contacts & history", icon: Users, href: "/customers" },
      { name: "Leads", desc: "Inbound opportunities", icon: Activity, href: "/leads" },
    ],
  },
  {
    label: "Field operations",
    items: [
      { name: "Dispatch Board", desc: "Drag-and-drop scheduling", icon: Calendar, href: "/scheduling" },
      { name: "GPS Tracking", desc: "Live crew locations", icon: MapPin, href: "/gps-tracking" },
      { name: "Team", desc: "Crews & permissions", icon: UserCog, href: "/team" },
      { name: "Tech Mobile", desc: "On-site tech view", icon: Smartphone, href: "/mobile" },
    ],
  },
  {
    label: "Finance",
    items: [
      { name: "Billing", desc: "Invoices & payments", icon: CreditCard, href: "/billing" },
      { name: "Price Books", desc: "Service catalog & rates", icon: BookOpen, href: "/price-books" },
      { name: "Calculator", desc: "Tax & margin tools", icon: Calculator, href: "/calculator" },
      { name: "Reports", desc: "Revenue & job P&L", icon: BarChart3, href: "/reports" },
      { name: "Payroll", desc: "Hours & pay runs", icon: DollarSign, href: "/payroll" },
    ],
  },
  {
    label: "Marketing & CRM",
    items: [
      { name: "CRM Integration", desc: "Connect & manage", icon: Zap, href: "/ghl" },
      { name: "Sync Contacts", desc: "Pull contacts → customers", icon: RefreshCw, href: "/ghl?action=sync" },
      { name: "Send Estimates", desc: "Email/SMS estimates", icon: Send, href: "/ghl?action=send" },
      { name: "Trigger Workflow", desc: "Run an automation", icon: Workflow, href: "/ghl?action=workflow" },
    ],
  },
  {
    label: "Smart tools & more",
    items: [
      { name: "Smart Assistant", desc: "AI chat & automations", icon: Brain, href: "/ai" },
      { name: "Smart Usage", desc: "Track AI consumption", icon: Activity, href: "/ai-usage" },
      { name: "QuickBooks", desc: "Accounting sync", icon: Receipt, href: "/quickbooks" },
      { name: "Settings", desc: "Org, billing, services", icon: Settings, href: "/settings" },
      { name: "Help & Docs", desc: "Lovable documentation", icon: HelpCircle, href: "https://docs.lovable.dev", external: true },
    ],
  },
];

export function ResourcesMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 hidden md:inline-flex">
          <LayoutGrid className="h-4 w-4" />
          <span>Resources</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-[min(900px,95vw)] p-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-5">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {group.label}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const content = (
                    <div className="flex items-start gap-3 rounded-md px-2 py-2 hover:bg-accent transition-colors">
                      <div className="rounded-md bg-primary/10 p-1.5 text-primary shrink-0">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1 text-sm font-medium text-foreground">
                          {item.name}
                          {item.external && <ExternalLink className="h-3 w-3 opacity-60" />}
                        </div>
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  );
                  return item.external ? (
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      {content}
                    </a>
                  ) : (
                    <Link key={item.name} to={item.href} className="block">
                      {content}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
