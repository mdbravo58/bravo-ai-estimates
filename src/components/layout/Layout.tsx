import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
  variant?: "dashboard" | "portal";
}

export function Layout({ children, variant = "dashboard" }: LayoutProps) {
  if (variant === "portal") {
    return children;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          organization={{
            name: "Premier Plumbing Solutions",
          }}
          user={{
            name: "John Smith",
            email: "john@premierplumbing.com",
          }}
        />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}