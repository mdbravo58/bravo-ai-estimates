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
import { useAuth } from "@/hooks/useAuth";

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
}

export function Header({ organization, user }: HeaderProps) {
  const { signOut, user: authUser } = useAuth();
  
  const displayUser = user || {
    name: authUser?.email?.split('@')[0] || 'User',
    email: authUser?.email || 'user@example.com'
  };

  return (
    <header className="border-b bg-card shadow-card">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Logo and Organization */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            {organization?.logo ? (
              <img
                src={organization.logo}
                alt={organization.name}
                className="h-8 w-auto"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded bg-gradient-primary">
                <Building2 className="h-5 w-5 text-primary-foreground" />
              </div>
            )}
            <div>
              <h1 className="font-heading text-lg font-semibold text-foreground">
                {organization?.name || "Bravo Book Buddy"}
              </h1>
            </div>
          </div>
        </div>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
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
              <DropdownMenuItem>
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