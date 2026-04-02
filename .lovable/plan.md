

## Add Dispatch Board Page

The user provided a complete `DispatchBoard` component. This needs to be wired into the app as a new page with routing and sidebar navigation.

### Changes

1. **`src/components/dispatch/DispatchBoard.tsx`** — Create this file with the user's provided component code. The JSX in the pasted code has been stripped of tags (likely a rendering issue), so the component will need its JSX properly reconstructed with the correct HTML/React elements (divs, spans, etc.) wrapping the layout. The component features:
   - Kanban-style board with 4 columns: Unassigned, Scheduled, In Progress, Completed
   - Drag-and-drop to assign technicians or move jobs between statuses
   - Date picker, search, refresh
   - Technician load sidebar showing job counts per tech
   - Call customer, Start, and Complete action buttons on each card

2. **`src/pages/Dispatch.tsx`** — Create a thin page wrapper that renders `<DispatchBoard />` inside the app `Layout`.

3. **`src/components/routing/AppRouter.tsx`** — Add a protected route at `/dispatch`.

4. **`src/components/layout/Sidebar.tsx`** — Add "Dispatch" to the Operations nav group (after Scheduling), using the `Truck` or `LayoutGrid` icon from lucide-react.

5. **`src/components/layout/MobileSidebar.tsx`** — Add matching "Dispatch" entry to the mobile nav.

### Notes
- The component queries `appointments` and `users` tables which already exist with proper RLS policies — no database changes needed.
- The drag-and-drop uses native HTML5 drag events (no new dependencies).

