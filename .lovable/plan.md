

## Replace Scheduling Page with Dispatch Board

**What**: Replace the current `src/pages/Scheduling.tsx` content with a simple wrapper that renders the `DispatchBoard` component, matching the code the user provided.

### Changes

**`src/pages/Scheduling.tsx`** — Replace the entire file with:
```tsx
import { Layout } from "@/components/layout/Layout";
import { DispatchBoard } from "@/components/dispatch/DispatchBoard";

export default function SchedulingPage() {
  return (
    <Layout>
      <DispatchBoard />
    </Layout>
  );
}
```

This removes the separate calendar/appointment UI and unifies Scheduling with the Dispatch Board view. One file changed, no new dependencies.

