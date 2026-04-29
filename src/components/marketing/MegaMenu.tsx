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
  Users, UserCircle, Tags, ListChecks, Target, StickyNote, Paperclip, History, MapPin, Activity,
  Globe, CalendarDays, BellRing, Repeat, CalendarClock, CalendarX, Clock, Map, Building2, CalendarCheck,
  Briefcase, LayoutGrid, UserCog, ClipboardList, Smartphone, Route, Navigation, Camera, NotebookPen, FileBox,
  FileText, CheckCircle2, ReceiptText, Link2, CreditCard, PiggyBank, HandCoins, Undo2, RefreshCw, BookOpen,
  MessageSquare, Mail, Phone, PhoneMissed, Voicemail, MessagesSquare, Inbox, FileCode2, UsersRound, BellDot,
  Workflow, Brain, Mic, Send, Sprout, Star, CalendarOff, BadgeCheck, ListTodo, Shuffle,
  Megaphone, MailPlus, Share2, Facebook, Instagram, Building, ThumbsUp, Sparkles as SparklesIcon, Gift, Ticket,
  BarChart3, TrendingUp, Briefcase as BriefcaseIcon, Award, Filter, CalendarRange, Wallet, LineChart, Heart, GitBranch,
  Users2, ShieldCheck, KeyRound, ListChecks as TaskIcon, FileEdit, LayoutDashboard, Building as BuildingIcon, ScrollText, Bell, Palette,
  CreditCard as CardIcon, CalendarPlus, MailCheck, MapPinned, Zap, Boxes, Webhook, Code2, MessageCircle, BellPlus,
  HelpCircle, Library, Compass, ListChecks as ChecklistIcon, Video, Newspaper, Rss, MessageCircleQuestion,
  Info, MailIcon, FileBadge, MessageCircleHeart, Handshake, Briefcase as CareersIcon,
  FileSignature, Calculator, MapPinCheck, Calculator as CalcIcon2, FileText as TemplateIcon, Receipt, Download, Stethoscope,
  LifeBuoy, TicketCheck, MessageSquareDot, Server, GraduationCap, Wrench, ArrowUpDown, Headphones,
  Shield, Cookie, FileLock, Lock, BadgeCheck as ComplianceIcon, AlertTriangle,
  Menu, ArrowRight, Sparkles,
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

export const featureGroups: MenuColumn[] = [
  {
    title: "Customer & CRM",
    icon: Users,
    items: [
      { name: "Customer Database", href: "/features/customer-database", icon: Users, desc: "All your customers in one place" },
      { name: "Contact Profiles", href: "/features/contact-profiles", icon: UserCircle },
      { name: "Customer Tags", href: "/features/customer-tags", icon: Tags },
      { name: "Smart Lists", href: "/features/smart-lists", icon: ListChecks },
      { name: "Lead Source Tracking", href: "/features/lead-source-tracking", icon: Target },
      { name: "Customer Notes", href: "/features/customer-notes", icon: StickyNote },
      { name: "File Attachments", href: "/features/file-attachments", icon: Paperclip },
      { name: "Service History", href: "/features/service-history", icon: History },
      { name: "Saved Addresses", href: "/features/saved-addresses", icon: MapPin },
      { name: "Customer Timeline", href: "/features/customer-timeline", icon: Activity },
    ],
  },
  {
    title: "Booking & Scheduling",
    icon: CalendarDays,
    items: [
      { name: "Online Booking", href: "/features/online-booking", icon: Globe, desc: "Let customers book 24/7" },
      { name: "Calendar Scheduling", href: "/features/calendar-scheduling", icon: CalendarDays },
      { name: "Appointment Reminders", href: "/features/appointment-reminders", icon: BellRing },
      { name: "Recurring Appointments", href: "/features/recurring-appointments", icon: Repeat },
      { name: "Rescheduling", href: "/features/rescheduling", icon: CalendarClock },
      { name: "Cancellations", href: "/features/cancellations", icon: CalendarX },
      { name: "Availability Rules", href: "/features/availability-rules", icon: Clock },
      { name: "Service Area Rules", href: "/features/service-area-rules", icon: Map },
      { name: "Multi-Location Scheduling", href: "/features/multi-location-scheduling", icon: Building2 },
      { name: "Staff Calendar Sync", href: "/features/staff-calendar-sync", icon: CalendarCheck },
    ],
  },
  {
    title: "Jobs & Field Operations",
    icon: Briefcase,
    items: [
      { name: "Job Management", href: "/features/job-management", icon: Briefcase, desc: "Track every job start to finish" },
      { name: "Dispatch Board", href: "/features/dispatch-board", icon: LayoutGrid },
      { name: "Technician Assignment", href: "/features/technician-assignment", icon: UserCog },
      { name: "Job Status Tracking", href: "/features/job-status-tracking", icon: ClipboardList },
      { name: "Technician Mobile View", href: "/features/technician-mobile-view", icon: Smartphone },
      { name: "Route Optimization", href: "/features/route-optimization", icon: Route },
      { name: "GPS Tracking", href: "/features/gps-tracking", icon: Navigation },
      { name: "Before & After Photos", href: "/features/before-after-photos", icon: Camera },
      { name: "Internal Job Notes", href: "/features/internal-job-notes", icon: NotebookPen },
      { name: "Work Orders", href: "/features/work-orders", icon: FileBox },
    ],
  },
  {
    title: "Estimates, Invoices & Payments",
    icon: ReceiptText,
    items: [
      { name: "Estimates & Quotes", href: "/features/estimates-quotes", icon: FileText, desc: "Win more jobs faster" },
      { name: "Quote Approval", href: "/features/quote-approval", icon: CheckCircle2 },
      { name: "Invoices", href: "/features/invoices", icon: ReceiptText },
      { name: "Payment Links", href: "/features/payment-links", icon: Link2 },
      { name: "Card Payments", href: "/features/card-payments", icon: CreditCard },
      { name: "Deposits", href: "/features/deposits", icon: PiggyBank },
      { name: "Tips", href: "/features/tips", icon: HandCoins },
      { name: "Refunds", href: "/features/refunds", icon: Undo2 },
      { name: "Recurring Billing", href: "/features/recurring-billing", icon: RefreshCw },
      { name: "Price Book", href: "/features/price-book", icon: BookOpen },
    ],
  },
  {
    title: "Communication Hub",
    icon: MessagesSquare,
    items: [
      { name: "2-Way SMS", href: "/features/two-way-sms", icon: MessageSquare, desc: "Text customers instantly" },
      { name: "Email Messaging", href: "/features/email-messaging", icon: Mail },
      { name: "Phone Calls", href: "/features/phone-calls", icon: Phone },
      { name: "Missed Call Text Back", href: "/features/missed-call-text-back", icon: PhoneMissed },
      { name: "Voicemail Drops", href: "/features/voicemail-drops", icon: Voicemail },
      { name: "In-App Chat", href: "/features/in-app-chat", icon: MessagesSquare },
      { name: "Conversation Inbox", href: "/features/conversation-inbox", icon: Inbox },
      { name: "Message Templates", href: "/features/message-templates", icon: FileCode2 },
      { name: "Team Assignments", href: "/features/team-assignments", icon: UsersRound },
      { name: "Customer Notifications", href: "/features/customer-notifications", icon: BellDot },
    ],
  },
  {
    title: "Automation & Smart",
    icon: Sparkles,
    items: [
      { name: "Workflow Automation", href: "/features/workflow-automation", icon: Workflow, desc: "Set it and forget it" },
      { name: "Smart Chat Assistant", href: "/features/smart-chat-assistant", icon: Brain },
      { name: "Smart Voice Agent", href: "/features/smart-voice-agent", icon: Mic },
      { name: "Auto Follow-Ups", href: "/features/auto-follow-ups", icon: Send },
      { name: "Lead Nurture Sequences", href: "/features/lead-nurture-sequences", icon: Sprout },
      { name: "Review Request Automation", href: "/features/review-request-automation", icon: Star },
      { name: "No-Show Automation", href: "/features/no-show-automation", icon: CalendarOff },
      { name: "Booking Confirmation Automation", href: "/features/booking-confirmation-automation", icon: BadgeCheck },
      { name: "Internal Task Automation", href: "/features/internal-task-automation", icon: ListTodo },
      { name: "Smart Routing", href: "/features/smart-routing", icon: Shuffle },
    ],
  },
  {
    title: "Marketing & Social Media",
    icon: Megaphone,
    items: [
      { name: "SMS Campaigns", href: "/features/sms-campaigns", icon: Megaphone, desc: "Reach every customer" },
      { name: "Email Campaigns", href: "/features/email-campaigns", icon: MailPlus },
      { name: "Social Media Planner", href: "/features/social-media-planner", icon: Share2 },
      { name: "Facebook Messaging", href: "/features/facebook-messaging", icon: Facebook },
      { name: "Instagram Messaging", href: "/features/instagram-messaging", icon: Instagram },
      { name: "Google Business Profile", href: "/features/google-business-profile", icon: Building },
      { name: "Review Management", href: "/features/review-management", icon: Star },
      { name: "Reputation Management", href: "/features/reputation-management", icon: ThumbsUp },
      { name: "Referral Campaigns", href: "/features/referral-campaigns", icon: Gift },
      { name: "Promo Codes", href: "/features/promo-codes", icon: Ticket },
    ],
  },
  {
    title: "Reporting & BI",
    icon: BarChart3,
    items: [
      { name: "Dashboard Analytics", href: "/features/dashboard-analytics", icon: LayoutDashboard, desc: "Know your numbers" },
      { name: "Revenue Reports", href: "/features/revenue-reports", icon: TrendingUp },
      { name: "Job Reports", href: "/features/job-reports", icon: BriefcaseIcon },
      { name: "Technician Performance", href: "/features/technician-performance", icon: Award },
      { name: "Lead Conversion Tracking", href: "/features/lead-conversion-tracking", icon: Filter },
      { name: "Appointment Reports", href: "/features/appointment-reports", icon: CalendarRange },
      { name: "Payment Reports", href: "/features/payment-reports", icon: Wallet },
      { name: "Campaign Reports", href: "/features/campaign-reports", icon: LineChart },
      { name: "Customer Retention Reports", href: "/features/customer-retention-reports", icon: Heart },
      { name: "Pipeline Reports", href: "/features/pipeline-reports", icon: GitBranch },
    ],
  },
  {
    title: "Team & Admin",
    icon: Users2,
    items: [
      { name: "Team Management", href: "/features/team-management", icon: Users2, desc: "Manage your whole crew" },
      { name: "User Roles", href: "/features/user-roles", icon: ShieldCheck },
      { name: "Staff Permissions", href: "/features/staff-permissions", icon: KeyRound },
      { name: "Task Management", href: "/features/task-management", icon: TaskIcon },
      { name: "Internal Notes", href: "/features/internal-notes", icon: FileEdit },
      { name: "Admin Dashboard", href: "/features/admin-dashboard", icon: LayoutDashboard },
      { name: "Multi-Location Management", href: "/features/multi-location-management", icon: BuildingIcon },
      { name: "Activity Logs", href: "/features/activity-logs", icon: ScrollText },
      { name: "Notifications", href: "/features/notifications", icon: Bell },
      { name: "White Label Branding", href: "/features/white-label-branding", icon: Palette },
    ],
  },
  {
    title: "Integrations",
    icon: Boxes,
    items: [
      { name: "Stripe", href: "/features/stripe", icon: CardIcon, desc: "Accept card payments" },
      { name: "Google Calendar", href: "/features/google-calendar", icon: CalendarPlus },
      { name: "Outlook Calendar", href: "/features/outlook-calendar", icon: MailCheck },
      { name: "Google Maps", href: "/features/google-maps", icon: MapPinned },
      { name: "Zapier", href: "/features/zapier", icon: Zap },
      { name: "Make", href: "/features/make", icon: Boxes },
      { name: "Webhooks", href: "/features/webhooks", icon: Webhook },
      { name: "API Access", href: "/features/api-access", icon: Code2 },
      { name: "Slack", href: "/features/slack", icon: MessageCircle },
      { name: "Push Notifications", href: "/features/push-notifications", icon: BellPlus },
    ],
  },
];

export const resourceGroups: MenuColumn[] = [
  {
    title: "Learn",
    icon: GraduationCap,
    items: [
      { name: "Help Center", href: "/resources/help-center", icon: HelpCircle, desc: "Find answers fast" },
      { name: "Knowledge Base", href: "/resources/knowledge-base", icon: Library },
      { name: "Getting Started Guide", href: "/resources/getting-started-guide", icon: Compass },
      { name: "Onboarding Checklist", href: "/resources/onboarding-checklist", icon: ChecklistIcon },
      { name: "Video Tutorials", href: "/resources/video-tutorials", icon: Video },
      { name: "Product Updates", href: "/resources/product-updates", icon: Newspaper },
      { name: "Blog", href: "/resources/blog", icon: Rss },
      { name: "FAQs", href: "/resources/faqs", icon: MessageCircleQuestion },
    ],
  },
  {
    title: "Company",
    icon: Building2,
    items: [
      { name: "About Us", href: "/resources/about-us", icon: Info, desc: "Our mission & team" },
      { name: "Contact Us", href: "/resources/contact-us", icon: MailIcon },
      { name: "Book a Demo", href: "/resources/book-a-demo", icon: CalendarCheck },
      { name: "Customer Stories", href: "/resources/customer-stories", icon: MessageCircleHeart },
      { name: "Case Studies", href: "/resources/case-studies", icon: FileBadge },
      { name: "Testimonials", href: "/resources/testimonials", icon: Star },
      { name: "Partner Program", href: "/resources/partner-program", icon: Handshake },
      { name: "Careers", href: "/resources/careers", icon: CareersIcon },
    ],
  },
  {
    title: "Tools",
    icon: Wrench,
    items: [
      { name: "Request a Quote", href: "/resources/request-a-quote", icon: FileSignature, desc: "Get a custom price" },
      { name: "ROI Calculator", href: "/resources/roi-calculator", icon: Calculator },
      { name: "Service Area Checker", href: "/resources/service-area-checker", icon: MapPinCheck },
      { name: "Pricing Calculator", href: "/resources/pricing-calculator", icon: CalcIcon2 },
      { name: "Estimate Template", href: "/resources/estimate-template", icon: TemplateIcon },
      { name: "Invoice Template", href: "/resources/invoice-template", icon: Receipt },
      { name: "Download Mobile App", href: "/resources/download-mobile-app", icon: Download },
      { name: "Business Health Check", href: "/resources/business-health-check", icon: Stethoscope },
    ],
  },
  {
    title: "Support",
    icon: LifeBuoy,
    items: [
      { name: "Support Center", href: "/resources/support-center", icon: LifeBuoy, desc: "We're here to help" },
      { name: "Submit a Ticket", href: "/resources/submit-a-ticket", icon: TicketCheck },
      { name: "Live Chat", href: "/resources/live-chat", icon: MessageSquareDot },
      { name: "System Status", href: "/resources/system-status", icon: Server },
      { name: "Training", href: "/resources/training", icon: GraduationCap },
      { name: "Implementation Help", href: "/resources/implementation-help", icon: Wrench },
      { name: "Migration Help", href: "/resources/migration-help", icon: ArrowUpDown },
      { name: "Contact Support", href: "/resources/contact-support", icon: Headphones },
    ],
  },
  {
    title: "Legal",
    icon: Shield,
    items: [
      { name: "Terms of Service", href: "/terms", icon: ScrollText, desc: "How we operate" },
      { name: "Privacy Policy", href: "/privacy", icon: Shield },
      { name: "Cookie Policy", href: "/resources/cookie-policy", icon: Cookie },
      { name: "Data Processing Agreement", href: "/resources/data-processing-agreement", icon: FileLock },
      { name: "Security", href: "/resources/security", icon: Lock },
      { name: "Compliance", href: "/resources/compliance", icon: ComplianceIcon },
      { name: "Acceptable Use Policy", href: "/resources/acceptable-use-policy", icon: AlertTriangle },
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
      className="group relative flex h-full flex-col justify-between overflow-hidden rounded-lg bg-gradient-to-br from-primary/15 via-primary/5 to-transparent p-5 ring-1 ring-primary/20 hover:ring-primary/40 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
  maxHeight?: string;
}

function MenuPanel({ columns, gridClass, featured, maxHeight }: MenuPanelProps) {
  return (
    <div className="flex">
      <div
        className={`grid ${gridClass} flex-1 gap-x-5 gap-y-6 p-6 overflow-y-auto`}
        style={maxHeight ? { maxHeight } : undefined}
      >
        {columns.map((col) => {
          const ColIcon = col.icon;
          return (
            <div key={col.title} className="min-w-0">
              <div className="flex items-center gap-2 pb-2 mb-2 border-b border-border/60">
                <div className="rounded-md bg-primary/10 p-1.5 text-primary shrink-0">
                  <ColIcon className="h-3.5 w-3.5" />
                </div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-foreground truncate">
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
                        className="group flex items-start gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                        <div className="min-w-0">
                          <p className="text-[13px] font-medium text-foreground leading-tight truncate">
                            {item.name}
                          </p>
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
        <div className="hidden xl:block w-[260px] shrink-0 border-l border-border/60 bg-muted/30 p-4">
          <FeaturedCard {...featured} />
        </div>
      )}
    </div>
  );
}

interface MegaMenuProps {
  triggerClassName?: string;
}

export function MegaMenu({ triggerClassName }: MegaMenuProps = {}) {
  return (
    <NavigationMenu aria-label="Primary">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className={triggerClassName} aria-label="Open features menu">
            Features
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[min(1400px,97vw)] bg-popover">
              <MenuPanel
                columns={featureGroups}
                gridClass="grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                maxHeight="78vh"
                featured={{
                  title: "See all features",
                  description:
                    "Explore the full Bravo AI Systems platform built for service pros.",
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
            <div className="w-[min(1200px,96vw)] bg-popover">
              <MenuPanel
                columns={resourceGroups}
                gridClass="grid-cols-2 md:grid-cols-3 xl:grid-cols-5"
                maxHeight="78vh"
                featured={{
                  title: "Book a live demo",
                  description:
                    "See how Bravo AI Systems fits your business in a 20-minute walkthrough.",
                  href: "/resources/book-a-demo",
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

export function MegaMenuMobile({ triggerClassName }: MegaMenuProps = {}) {
  const [open, setOpen] = useState(false);

  const renderSection = (columns: MenuColumn[]) =>
    columns.map((col) => {
      const ColIcon = col.icon;
      return (
        <AccordionItem key={col.title} value={col.title}>
          <AccordionTrigger className="text-sm">
            <span className="flex items-center gap-2">
              <ColIcon className="h-4 w-4 text-primary" />
              {col.title}
            </span>
          </AccordionTrigger>
          <AccordionContent>
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
          </AccordionContent>
        </AccordionItem>
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
        <div className="mt-6">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
            Features
          </p>
          <Accordion type="multiple">{renderSection(featureGroups)}</Accordion>

          <p className="mt-6 text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
            Resources
          </p>
          <Accordion type="multiple">{renderSection(resourceGroups)}</Accordion>
        </div>

        <div className="mt-6 border-t border-border pt-4 space-y-1">
          <Link
            to="/pricing"
            onClick={() => setOpen(false)}
            className="block rounded-md px-3 py-3 text-sm font-medium hover:bg-accent"
          >
            Pricing
          </Link>
          <Link
            to="/resources/book-a-demo"
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
