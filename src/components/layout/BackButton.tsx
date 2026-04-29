import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  fallback?: string;
  className?: string;
  label?: string;
  variant?: "ghost" | "outline" | "secondary";
}

/**
 * Universal Back button. Uses browser history when possible,
 * otherwise navigates to a sensible fallback route.
 * Hidden on top-level "home" routes to avoid noise.
 */
export function BackButton({
  fallback = "/",
  className,
  label = "Back",
  variant = "ghost",
}: BackButtonProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't render on root pages where back makes no sense
  const hideOn = ["/", "/dashboard", "/cover"];
  if (hideOn.includes(location.pathname)) return null;

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      size="sm"
      onClick={handleBack}
      className={cn("gap-1.5", className)}
      aria-label="Go back"
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
    </Button>
  );
}
