import { Button } from "@/components/ui/button";
import { Building2, Settings, User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { ResourcesMenu } from "./ResourcesMenu";
import { BackButton } from "./BackButton";

interface HeaderProps {
  organization?: {
    name: string;
    logo?: string;
  };
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  loading?: boolean;
  mobileNav?: React.ReactNode;
}

export function Header({ organization, user, loading, mobileNav }: HeaderProps) {
  const { signOut, user: authUser } = useAuth();
  const navigate = useNavigate();
  const displayOrganizationName = "Prime Plumbing Company";
  
  const displayUser = user || {
    name: authUser?.email?.split('@')[0] || 'User',
    email: authUser?.email || 'user@example.com'
  };

  return (
    <header className="border-b bg-card shadow-card">
      <div className="flex h-14 md:h-16 items-center justify-between px-3 md:px-6">
        {/* Mobile nav + Back + Logo */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {mobileNav}
          <BackButton fallback="/dashboard" />
          <div className="flex items-center space-x-3">
            {loading ? (
              <>
                <Skeleton className="h-12 w-12 rounded" />
                <Skeleton className="h-5 w-40" />
              </>
            ) : (
              <>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-primary text-primary-foreground">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="font-heading text-lg font-semibold text-foreground">
                    {displayOrganizationName}
                  </h1>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Resources + User Menu */}
        <div className="flex items-center space-x-2 md:space-x-3">
          <ResourcesMenu />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={displayUser.avatar} alt={displayUser.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {displayUser.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex flex-col space-y-1 p-2">
                <p className="text-sm font-medium leading-none">
                  {displayUser.name}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {displayUser.email}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
