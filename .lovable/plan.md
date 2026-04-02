

## Remove Duplicate Dispatch Nav Entry

Since Scheduling and Dispatch both render the `DispatchBoard`, having two sidebar entries is redundant.

**Option**: Remove the "Dispatch" entry from the Operations nav group in both sidebars, keeping only "Scheduling" (which already points to `/scheduling` and now shows the Dispatch Board).

### Changes

1. **`src/components/layout/Sidebar.tsx`** — Remove `{ name: "Dispatch", icon: Truck, href: "/dispatch" }` from Operations items
2. **`src/components/layout/MobileSidebar.tsx`** — Same removal
3. Optionally remove the `/dispatch` route from `AppRouter.tsx` and `src/pages/Dispatch.tsx`, or keep them as an alias — your call

If you'd prefer a different consolidation (e.g., keep "Dispatch" and remove "Scheduling", or rename "Scheduling" to "Dispatch Board"), let me know.

