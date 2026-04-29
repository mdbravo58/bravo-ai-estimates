import { useState } from "react";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  FileText, Briefcase, Users, Activity, CreditCard, BookOpen,
  Calendar, CalendarDays, MapPin, Smartphone, UserCog, Route,
  Workflow, Brain, Mic, PhoneMissed, MessageSquareReply, Star,
  MessageSquare, Mail, Share2, Megaphone, ThumbsUp, GitBranch,
  BarChart3, DollarSign, TrendingUp, Wallet, Calculator,
  HelpCircle, Library, GraduationCap, Video, Compass,
  Building2, MailIcon, CalendarCheck, FileBadge, MessageCircleHeart,
  FileSignature, Calculator as CalcIcon, MapPinned, Download,
  ScrollText, Shield, Wrench, Sparkles, Menu,
  type LucideIcon,
} from "lucide-react";

interface MenuItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

interface MenuColumn {
  title: string;
  icon: LucideIcon;
  items: MenuItem[];
}

const featureColumns: MenuColumn[] = [
  {
    title: "Run the Business",
    icon: Briefcase,
    items: [
      { name: "Estimates & Quotes", href: "/features/estimates", icon: FileText },
      { name: "Job Management", href: "/features/jobs", icon: Briefcase },
      { name: "Customer CRM", href: "/features/crm", icon: Users },
      { name: "Lead Capture", href: "/features/leads", icon: Activity },
      { name: "Invoicing & Payments", href: "/features/invoicing", icon: CreditCard },
      { name: "Price Book", href: "/features/price-book", icon: BookOpen },
    ],
  },
  {
    title: "Field Operations",
    icon: MapPin,
    items: [
      { name: "Dispatch Board", href: "/features/dispatch", icon: Calendar },
      { name: "Scheduling & Calendar", href: "/features/scheduling", icon: CalendarDays },
      { name: "GPS Tracking", href: "/features/gps", icon: MapPin },
      { name: "Technician Mobile App", href: "/features/mobile", icon: Smartphone },
      { name: "Team Management", href: "/features/team", icon: UserCog },
      { name: "Route Optimization", href: "/features/routes", icon: Route },
    ],
  },
  {
    title: "Automation & Smart",
    icon: Sparkles,
    items: [
      { name: "Workflow Automation", href: "/features/workflows", icon: Workflow },
      { name: "Smart Chat Assistant", href: "/features/chat", icon: Brain },
      { name: "Smart Voice Agent", href: "/features/voice", icon: Mic },
      { name: "Missed Call Text Back", href: "/features/missed-call", icon: PhoneMissed },
      { name: "Smart Follow-Ups", href: "/features/follow-ups", icon: MessageSquareReply },
      { name: "Review Automation", href: "/features/reviews", icon: Star },
    ],
  },
  {
    title: "Marketing & Comms",
    icon: Megaphone,
    items: [
      { name: "2-Way SMS Messaging", href: "/features/sms", icon: MessageSquare },
      { name: "Email Marketing", href: "/features/email", icon: Mail },
      { name: "Social Media Messaging", href: "/features/social", icon: Share2 },
      { name: "Campaigns & Broadcasts", href: "/features/campaigns", icon: Megaphone },
      { name: "Reputation Management", href: "/features/reputation", icon: ThumbsUp },
      { name: "Pipeline Tracking", href: "/features/pipeline", icon: GitBranch },
    ],
  },
  {
    title: "Analytics & Finance",
    icon: BarChart3,
    items: [
      { name: "Reports & Analytics", href: "/features/reports", icon: BarChart3 },
      { name: "Revenue Tracking", href: "/features/revenue", icon: TrendingUp },
      { name: "Conversion Tracking", href: "/features/conversion", icon: Activity },
      { name: "Payroll Management", href: "/features/payroll", icon: Wallet },
      { name: "Tax Tools", href: "/features/tax", icon: Calculator },
    ],
  },
];

const resourceColumns: MenuColumn[] = [
  {
    title: "Learn",
    icon: GraduationCap,
    items: [
      { name: "Help Center", href: "/resources/help", icon: HelpCircle },
      { name: "Knowledge Base", href: "/resources/knowledge-base", icon: Library },
      { name: "Tutorials & Guides", href: "/resources/tutorials", icon: GraduationCap },
      { name: "Video Library", href: "/resources/videos", icon: Video },
      { name: "Onboarding Guide", href: "/resources/onboarding", icon: Compass },
    ],
  },
  {
    title: "Company",
    icon: Building2,
    items: [
      { name: "About Us", href: "/resources/about", icon: Building2 },
      { name: "Contact", href: "/resources/contact", icon: MailIcon },
      { name: "Book a Demo", href: "/demo", icon: CalendarCheck },
      { name: "Case Studies", href: "/resources/case-studies", icon: FileBadge },
      { name: "Testimonials", href: "/resources/testimonials", icon: MessageCircleHeart },
    ],
  },
  {
    title: "Tools",
    icon: Wrench,
    items: [
      { name: "Request a Quote", href: "/request-quote", icon: FileSignature },
      { name: "ROI Calculator", href: "/resources/roi-calculator", icon: CalcIcon },
      { name: "Service Area Checker", href: "/resources/service-area", icon: MapPinned },
      { name: "Download Mobile App", href: "/resources/mobile-app", icon: Download },
    ],
  },
  {
    title: "Legal",
    icon: Shield,
    items: [
      { name: "Terms of Service", href: "/terms", icon: ScrollText },
      { name: "Privacy Policy", href: "/privacy", icon: Shield },
    ],
  },
];

interface MenuPanelProps {
  columns: MenuColumn[];
  gridClass: string;
}

function MenuPanel({ columns, gridClass }: MenuPanelProps) {
  return (
    <div className={`grid ${gridClass} gap-x-6 gap-y-4 p-6`}>
      {columns.map((col) => {
        const ColIcon = col.icon;
        return (
          <div key={col.title}>
            <div className="flex items-center gap-2 pb-3 mb-2 border-b border-border">
              <div className="rounded-md bg-primary/10 p-1.5 text-primary">
                <ColIcon className="h-4 w-4" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
                {col.title}
              </p>
            </div>
            <ul className="space-y-1">
              {col.items.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      aria-label={item.name}
                      className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <Icon className="h-3.5 w-3.5 opacity-70" />
                      <span className="truncate">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

interface MegaMenuProps {
  triggerClassName?: string;
}

/** Desktop mega menu — Features + Resources tabs */
export function MegaMenu({ triggerClassName }: MegaMenuProps = {}) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className={triggerClassName}>Features</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[min(1100px,95vw)] bg-popover">
              <MenuPanel
                columns={featureColumns}
                gridClass="grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"
              />
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className={triggerClassName}>Resources</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[min(900px,95vw)] bg-popover">
              <MenuPanel
                columns={resourceColumns}
                gridClass="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              />
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

/** Mobile collapsible menu (accordion in a sheet) */
export function MegaMenuMobile({ triggerClassName }: MegaMenuProps = {}) {
  const [open, setOpen] = useState(false);

  const renderSection = (columns: MenuColumn[]) =>
    columns.map((col) => {
      const ColIcon = col.icon;
      return (
        <div key={col.title} className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <ColIcon className="h-4 w-4 text-primary" />
            <p className="text-xs font-semibold uppercase tracking-wider">{col.title}</p>
          </div>
          <ul className="space-y-1 pl-6">
            {col.items.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      );
    });

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className={triggerClassName} aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[90vw] sm:w-[400px] overflow-y-auto">
        <Accordion type="multiple" className="mt-6">
          <AccordionItem value="features">
            <AccordionTrigger>Features</AccordionTrigger>
            <AccordionContent>{renderSection(featureColumns)}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="resources">
            <AccordionTrigger>Resources</AccordionTrigger>
            <AccordionContent>{renderSection(resourceColumns)}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="pricing">
            <AccordionTrigger>
              <Link to="/pricing" onClick={() => setOpen(false)}>Pricing</Link>
            </AccordionTrigger>
          </AccordionItem>
        </Accordion>
      </SheetContent>
    </Sheet>
  );
}
