import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { MobileSidebar } from "./MobileSidebar";
import { useOrganization } from "@/hooks/useOrganization";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
  variant?: "dashboard" | "portal";
}

export function Layout({ children, variant = "dashboard" }: LayoutProps) {
  const { organization, userData, loading } = useOrganization();
  const isMobile = useIsMobile();

  if (variant === "portal") {
    return children;
  }

  return (
    <div className="flex h-screen bg-background">
      {!isMobile && <Sidebar />}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          organization={organization ? {
            name: organization.name,
            logo: organization.logo_url || undefined,
          } : undefined}
          user={userData ? {
            name: userData.name,
            email: userData.email,
          } : undefined}
          loading={loading}
          mobileNav={isMobile ? <MobileSidebar /> : undefined}
        />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
