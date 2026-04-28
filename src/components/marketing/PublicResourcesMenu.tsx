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
  Calendar,
  MapPin,
  CreditCard,
  BookOpen,
  Calculator,
  BarChart3,
  DollarSign,
  Briefcase,
  Activity,
  UserCog,
  Smartphone,
  Brain,
  Zap,
  Receipt,
  HelpCircle,
  ExternalLink,
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

// Public marketing-style menu — links to public/marketing routes only.
// Internal app routes are not exposed to logged-out visitors.
const groups: ResourceGroup[] = [
  {
    label: "Run the business",
    items: [
      { name: "Estimates & Quotes", desc: "Quote and proposal builder", icon: FileText, href: "/demo" },
      { name: "Job Management", desc: "Active & scheduled work", icon: Briefcase, href: "/demo" },
      { name: "Customer CRM", desc: "Contacts & history", icon: Users, href: "/demo" },
      { name: "Lead Capture", desc: "Inbound opportunities", icon: Activity, href: "/demo" },
    ],
  },
  {
    label: "Field operations",
    items: [
      { name: "Dispatch Board", desc: "Drag-and-drop scheduling", icon: Calendar, href: "/demo" },
      { name: "GPS Tracking", desc: "Live crew locations", icon: MapPin, href: "/demo" },
      { name: "Team Management", desc: "Crews & permissions", icon: UserCog, href: "/demo" },
      { name: "Tech Mobile App", desc: "On-site tech view", icon: Smartphone, href: "/demo" },
    ],
  },
  {
    label: "Finance",
    items: [
      { name: "Invoicing & Payments", desc: "Get paid faster", icon: CreditCard, href: "/demo" },
      { name: "Price Books", desc: "Service catalog & rates", icon: BookOpen, href: "/demo" },
      { name: "Tax Calculator", desc: "Tax & margin tools", icon: Calculator, href: "/demo" },
      { name: "Reports & P&L", desc: "Revenue & job reports", icon: BarChart3, href: "/demo" },
      { name: "Payroll", desc: "Hours & pay runs", icon: DollarSign, href: "/demo" },
    ],
  },
  {
    label: "Marketing & CRM",
    items: [
      { name: "CRM Integration", desc: "Connect & manage", icon: Zap, href: "/demo" },
      { name: "QuickBooks Sync", desc: "Accounting integration", icon: Receipt, href: "/demo" },
      { name: "Smart Assistant", desc: "AI chat & automations", icon: Brain, href: "/demo" },
      { name: "Pricing", desc: "Plans & options", icon: DollarSign, href: "/pricing" },
    ],
  },
  {
    label: "Resources",
    items: [
      { name: "Live Demo", desc: "Try the platform now", icon: LayoutGrid, href: "/demo" },
      { name: "Request a Quote", desc: "Get started today", icon: FileText, href: "/request-quote" },
      { name: "Terms", desc: "Terms of service", icon: BookOpen, href: "/terms" },
      { name: "Privacy", desc: "Privacy policy", icon: HelpCircle, href: "/privacy" },
    ],
  },
];

export function PublicResourcesMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
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
