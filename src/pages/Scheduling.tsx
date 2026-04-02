import { Layout } from "@/components/layout/Layout";
import { DispatchBoard } from "@/components/dispatch/DispatchBoard";
import { SmartDispatchActions } from "@/components/dispatch/SmartDispatchActions";

export default function SchedulingPage() {
  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
              Dispatch
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Manage today's jobs, technicians, and appointments from one place
            </p>
          </div>
          <div className="shrink-0">
            <SmartDispatchActions />
          </div>
        </div>
        <DispatchBoard />
      </div>
    </Layout>
  );
}
