import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";

const FeaturePlaceholder = () => {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Derive title from path segment
  const segment = slug || location.pathname.split("/").filter(Boolean).pop() || "page";
  const title = segment
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-xl text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Sparkles className="h-8 w-8" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">{title}</h1>
        <p className="text-muted-foreground mb-8">
          This page is coming soon. We're polishing the details to give you the best experience.
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go back
          </Button>
          <Button onClick={() => navigate("/")}>Back to home</Button>
        </div>
      </div>
    </div>
  );
};

export default FeaturePlaceholder;
