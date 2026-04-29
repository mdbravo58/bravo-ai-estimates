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
  BarChart3, TrendingUp, Wallet, Calculator,
  HelpCircle, Library, GraduationCap, Video, Compass,
  Building2, MailIcon, CalendarCheck, FileBadge, MessageCircleHeart,
  FileSignature, Calculator as CalcIcon, MapPinned, Download,
  ScrollText, Shield, Wrench, Sparkles, Menu, ArrowRight,
  type LucideIcon,
} from "lucide-react";

interface MenuItem {
  name: string;
  href: string;
  icon: LucideIcon;
  desc?: string;
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
      { name: "Estimates & Quotes", href: "/features/estimates", icon: FileText, desc: "Win jobs faster" },
      { name: "Job Management", href: "/features/jobs", icon: Briefcase, desc: "Track every job" },
      { name: "Customer CRM", href: "/features/crm", icon: Users, desc: "All contacts in one place" },
      { name: "Lead Capture", href: "/features/leads", icon: Activity, desc: "Never miss a lead" },
      { name: "Invoicing & Payments", href: "/features/invoicing", icon: CreditCard, desc: "Get paid on time" },
      { name: "Price Book", href: "/features/price-book", icon: BookOpen, desc: "Service catalog" },
    ],
  },
  {
    title: "Field Operations",
    icon: MapPin,
    items: [
      { name: "Dispatch Board", href: "/features/dispatch", icon: Calendar, desc: "Drag-and-drop scheduling" },
      { name: "Scheduling & Calendar", href: "/features/scheduling", icon: CalendarDays, desc: "Plan the week" },
      { name: "GPS Tracking", href: "/features/gps", icon: MapPin, desc: "Live crew location" },
      { name: "Technician Mobile App", href: "/features/mobile", icon: Smartphone, desc: "For the field team" },
      { name: "Team Management", href: "/features/team", icon: UserCog, desc: "Roles & permissions" },
      { name: "Route Optimization", href: "/features/routes", icon: Route, desc: "Save fuel and time" },
    ],
  },
  {
    title: "Automation & Smart",
    icon: Sparkles,
    items: [
      { name: "Workflow Automation", href: "/features/workflows", icon: Workflow, desc: "Set it and forget it" },
      { name: "Smart Chat Assistant", href: "/features/chat", icon: Brain, desc: "24/7 chat" },
      { name: "Smart Voice Agent", href: "/features/voice", icon: Mic, desc: "Answer every call" },
      { name: "Missed Call Text Back", href: "/features/missed-call", icon: PhoneMissed, desc: "Auto follow-up" },
      { name: "Smart Follow-Ups", href: "/features/follow-ups", icon: MessageSquareReply, desc: "Stay top of mind" },
      { name: "Review Automation", href: "/features/reviews", icon: Star, desc: "Build reputation" },
    ],
  },
  {
    title: "Marketing & Comms",
    icon: Megaphone,
    items: [
      { name: "2-Way SMS Messaging", href: "/features/sms", icon: MessageSquare, desc: "Text customers" },
      { name: "Email Marketing", href: "/features/email", icon: Mail, desc: "Campaigns made easy" },
      { name: "Social Media Messaging", href: "/features/social", icon: Share2, desc: "All inboxes, one view" },
      { name: "Campaigns & Broadcasts", href: "/features/campaigns", icon: Megaphone, desc: "Reach everyone" },
      { name: "Reputation Management", href: "/features/reputation", icon: ThumbsUp, desc: "5-star reviews" },
      { name: "Pipeline Tracking", href: "/features/pipeline", icon: GitBranch, desc: "Watch leads convert" },
    ],
  },
  {
    title: "Analytics & Finance",
    icon: BarChart3,
    items: [
      { name: "Reports & Analytics", href: "/features/reports", icon: BarChart3, desc: "Know your numbers" },
      { name: "Revenue Tracking", href: "/features/revenue", icon: TrendingUp, desc: "Watch growth" },
      { name: "Conversion Tracking", href: "/features/conversion", icon: Activity, desc: "Optimize funnel" },
      { name: "Payroll Management", href: "/features/payroll", icon: Wallet, desc: "Pay the team" },
      { name: "Tax Tools", href: "/features/tax", icon: Calculator, desc: "Stay compliant" },
    ],
  },
];

const resourceColumns: MenuColumn[] = [
  {
    title: "Learn",
    icon: GraduationCap,
    items: [
      { name: "Help Center", href: "/resources/help", icon: HelpCircle, desc: "Find answers fast" },
      { name: "Knowledge Base", href: "/resources/knowledge-base", icon: Library, desc: "In-depth articles" },
      { name: "Tutorials & Guides", href: "/resources/tutorials", icon: GraduationCap, desc: "Step-by-step" },
      { name: "Video Library", href: "/resources/videos", icon: Video, desc: "Watch & learn" },
      { name: "Onboarding Guide", href: "/resources/onboarding", icon: Compass, desc: "Get started" },
    ],
  },
  {
    title: "Company",
    icon: Building2,
    items: [
      { name: "About Us", href: "/resources/about", icon: Building2, desc: "Our story" },
      { name: "Contact", href: "/resources/contact", icon: MailIcon, desc: "Talk to us" },
      { name: "Book a Demo", href: "/demo", icon: CalendarCheck, desc: "See it live" },
      { name: "Case Studies", href: "/resources/case-studies", icon: FileBadge, desc: "Customer wins" },
      { name: "Testimonials", href: "/resources/testimonials", icon: MessageCircleHeart, desc: "What pros say" },
    ],
  },
  {
    title: "Tools",
    icon: Wrench,
    items: [
      { name: "Request a Quote", href: "/request-quote", icon: FileSignature, desc: "Get a price" },
      { name: "ROI Calculator", href: "/resources/roi-calculator", icon: CalcIcon, desc: "Estimate savings" },
      { name: "Service Area Checker", href: "/resources/service-area", icon: MapPinned, desc: "Are we in your area?" },
      { name: "Download Mobile App", href: "/resources/mobile-app", icon: Download, desc: "iOS & Android" },
    ],
  },
  {
    title: "Legal",
    icon: Shield,
    items: [
      { name: "Terms of Service", href: "/terms", icon: ScrollText, desc: "How we operate" },
      { name: "Privacy Policy", href: "/privacy", icon: Shield, desc: "Your data, protected" },
    ],
  },
];

interface FeatureCardProps {
  title: string;
  description: string;
  href: string;
  cta: string;
  icon: LucideIcon;
}

function FeaturedCard({ title, description, href, cta, icon: Icon }: FeatureCardProps) {
  return (
    <Link
      to={href}
      className="group relative flex flex-col justify-between overflow-hidden rounded-lg bg-gradient-to-br from-primary/15 via-primary/5 to-transparent p-5 ring-1 ring-primary/20 hover:ring-primary/40 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div>
        <div className="mb-3 inline-flex rounded-md bg-primary/15 p-2 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>
      <div className="mt-4 flex items-center gap-1 text-xs font-medium text-primary">
        {cta}
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

interface MenuPanelProps {
  columns: MenuColumn[];
  gridClass: string;
  featured?: FeatureCardProps;
}

function MenuPanel({ columns, gridClass, featured }: MenuPanelProps) {
  return (
    <div className="flex">
      <div className={`grid ${gridClass} flex-1 gap-x-6 gap-y-6 p-6`}>
        {columns.map((col) => {
          const ColIcon = col.icon;
          return (
            <div key={col.title}>
              <div className="flex items-center gap-2 pb-2 mb-3 border-b border-border/60">
                <div className="rounded-md bg-primary/10 p-1.5 text-primary">
                  <ColIcon className="h-3.5 w-3.5" />
                </div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-foreground">
                  {col.title}
                </p>
              </div>
              <ul className="space-y-0.5">
                {col.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        aria-label={item.name}
                        className="group flex items-start gap-2.5 rounded-md px-2 py-2 text-sm hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                        <div className="min-w-0">
                          <p className="font-medium text-foreground leading-tight truncate">{item.name}</p>
                          {item.desc && (
                            <p className="text-[11px] text-muted-foreground truncate">{item.desc}</p>
                          )}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
      {featured && (
        <div className="hidden lg:block w-[260px] shrink-0 border-l border-border/60 bg-muted/30 p-4">
          <FeaturedCard {...featured} />
        </div>
      )}
    </div>
  );
}

interface MegaMenuProps {
  triggerClassName?: string;
}

/** Desktop mega menu — Features + Resources tabs */
export function MegaMenu({ triggerClassName }: MegaMenuProps = {}) {
  return (
    <NavigationMenu aria-label="Primary">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className={triggerClassName} aria-label="Open features menu">
            Features
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[min(1240px,96vw)] bg-popover">
              <MenuPanel
                columns={featureColumns}
                gridClass="grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"
                featured={{
                  title: "See all features",
                  description: "Explore the complete Service Suite Pro platform built for service pros.",
                  href: "/pricing",
                  cta: "Tour the platform",
                  icon: Sparkles,
                }}
              />
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className={triggerClassName} aria-label="Open resources menu">
            Resources
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[min(1080px,96vw)] bg-popover">
              <MenuPanel
                columns={resourceColumns}
                gridClass="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                featured={{
                  title: "Book a live demo",
                  description: "See how Service Suite Pro fits your business in a 20-minute walkthrough.",
                  href: "/demo",
                  cta: "Schedule now",
                  icon: CalendarCheck,
                }}
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
        <div key={col.title} className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <ColIcon className="h-4 w-4 text-primary" />
            <p className="text-[11px] font-bold uppercase tracking-wider">{col.title}</p>
          </div>
          <ul className="space-y-0.5 pl-6">
            {col.items.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  onClick={() => setOpen(false)}
                  aria-label={item.name}
                  className="block rounded-md px-2 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  {item.name}
                  {item.desc && (
                    <span className="block text-[11px] opacity-70">{item.desc}</span>
                  )}
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
      <SheetContent side="right" className="w-[92vw] sm:w-[420px] overflow-y-auto">
        <Accordion type="multiple" className="mt-6">
          <AccordionItem value="features">
            <AccordionTrigger>Features</AccordionTrigger>
            <AccordionContent>{renderSection(featureColumns)}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="resources">
            <AccordionTrigger>Resources</AccordionTrigger>
            <AccordionContent>{renderSection(resourceColumns)}</AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="mt-4 border-t border-border pt-4 space-y-1">
          <Link
            to="/pricing"
            onClick={() => setOpen(false)}
            className="block rounded-md px-3 py-3 text-sm font-medium hover:bg-accent"
          >
            Pricing
          </Link>
          <Link
            to="/demo"
            onClick={() => setOpen(false)}
            className="block rounded-md px-3 py-3 text-sm font-medium hover:bg-accent"
          >
            Book a Demo
          </Link>
          <Link
            to="/auth"
            onClick={() => setOpen(false)}
            className="block rounded-md bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-3 text-sm font-semibold text-white text-center mt-2"
          >
            Get Started
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
