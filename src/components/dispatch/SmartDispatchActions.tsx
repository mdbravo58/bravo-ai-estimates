import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck, Truck, FileText, ArrowRight } from "lucide-react";
import { toast } from "sonner";

// User-facing label intentionally avoids "AI" to reduce learning curve
// These buttons can be wired to existing AI handlers when ready

export function SmartDispatchActions() {
  const handleUpdateCustomer = () => {
    // TODO: Wire to existing AI customer update logic
    toast.info("Update Customer — coming soon");
  };

  const handleSendTech = () => {
    // TODO: Wire to dispatch/assignment logic
    toast.info("Send Tech — coming soon");
  };

  const handleJobSummary = () => {
    // TODO: Wire to AI job summary handler
    toast.info("Job Summary — coming soon");
  };

  const handleSuggestNextStep = () => {
    // TODO: Wire to AI next-step recommendation handler
    toast.info("Suggest Next Step — coming soon");
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">Smart Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleUpdateCustomer}>
            <UserCheck className="h-4 w-4 mr-1" />
            Update Customer
          </Button>
          <Button variant="outline" size="sm" onClick={handleSendTech}>
            <Truck className="h-4 w-4 mr-1" />
            Send Tech
          </Button>
          <Button variant="outline" size="sm" onClick={handleJobSummary}>
            <FileText className="h-4 w-4 mr-1" />
            Job Summary
          </Button>
          <Button variant="outline" size="sm" onClick={handleSuggestNextStep}>
            <ArrowRight className="h-4 w-4 mr-1" />
            Suggest Next Step
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
