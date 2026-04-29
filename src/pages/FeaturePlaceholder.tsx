import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { featureGroups, resourceGroups } from "@/components/marketing/MegaMenu";

const FeaturePlaceholder = () => {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isResource = location.pathname.startsWith("/resources");
  const allGroups = isResource ? resourceGroups : featureGroups;

  // Derive title from path segment
  const segment = slug || location.pathname.split("/").filter(Boolean).pop() || "page";
  const title = segment
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const matchedGroup = allGroups.find((group) => group.items.some((item) => item.href === location.pathname));
  const matchedItem = matchedGroup?.items.find((item) => item.href === location.pathname);
  const relatedItems = (matchedGroup?.items || []).filter((item) => item.href !== location.pathname).slice(0, 6);
  const eyebrow = isResource ? "Resource" : "Feature";
  const pageTitle = matchedItem?.name || title;
  const description = matchedItem?.desc ||
    (isResource
      ? `Practical guidance and support resources for getting more from ${pageTitle.toLowerCase()}.`
      : `A dedicated Bravo AI Systems workspace for ${pageTitle.toLowerCase()} in your service business.`);
  const bullets = isResource
    ? ["Clear guidance for service teams", "Built around real home-service workflows", "Easy path to support, training, or next steps"]
    : ["Built for home-service operators", "Connects office, field, and customer workflows", "Ready for routing into the full platform experience"];

  return (
    <div className="min-h-screen bg-background">
      <section className="border-b bg-gradient-to-br from-primary/15 via-background to-muted/40 px-6 py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.05fr_0.95fr] md:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              {eyebrow} · {matchedGroup?.title || "Bravo AI Systems"}
            </div>
            <h1 className="text-4xl font-bold leading-tight text-foreground md:text-6xl">{pageTitle}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">{description}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button onClick={() => navigate(isResource ? "/resources/book-a-demo" : "/auth")} size="lg">
                {isResource ? "Book a demo" : "Get started"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button onClick={() => navigate(-1)} variant="outline" size="lg">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6 shadow-lg">
            <p className="text-sm font-semibold text-foreground">What this includes</p>
            <div className="mt-5 space-y-4">
              {bullets.map((bullet) => (
                <div key={bullet} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="text-sm text-muted-foreground">{bullet}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {relatedItems.length > 0 && (
        <section className="px-6 py-12">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-bold text-foreground">Related {matchedGroup?.title}</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} to={item.href} className="group rounded-lg border bg-card p-5 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <Icon className="h-5 w-5 text-primary" />
                    <p className="mt-3 font-semibold text-foreground">{item.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{item.desc || `Explore ${item.name.toLowerCase()} for service teams.`}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <div className="px-6 pb-12">
        <div className="mx-auto flex max-w-6xl justify-center">
          <Button onClick={() => navigate("/")} variant="ghost">Back to home</Button>
        </div>
      </div>
    </div>
  );
};

export default FeaturePlaceholder;
