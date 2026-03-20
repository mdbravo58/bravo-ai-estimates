

## Make Settings Menu Buttons Scroll to Sections

**Problem**: 7 of 8 sidebar menu buttons do nothing. All the content sections they represent already exist on the page.

**Solution**: Add `id` attributes to each content card and wire each menu button to smooth-scroll to it. Also highlight the active section.

### File: `src/pages/Settings.tsx`

1. **Add `id` to each content `<Card>`**:
   - `id="organization"` → Organization Settings card
   - `id="services"` → ServiceTypesManager card (wrap if needed)
   - `id="profile"` → User Management card
   - `id="notifications"` → Notification Preferences card
   - `id="billing"` → Billing & Plan card
   - `id="security"` → (no card exists yet — skip or add a placeholder)
   - `id="appearance"` → (no card exists yet — skip or add a placeholder)
   - `id="integrations"` → Integrations card

2. **Add state for active section** and a `scrollToSection` helper:
   ```
   const [activeSection, setActiveSection] = useState("organization");
   const scrollToSection = (id: string) => {
     setActiveSection(id);
     document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
   };
   ```

3. **Wire each menu button** with `onClick={() => scrollToSection("...")}` and apply an active style (e.g., `variant="secondary"`) when that section is selected.

4. **For Security and Appearance** which have no content cards yet — either remove those menu items or add minimal placeholder cards with "Coming soon" messaging.

### Summary of changes
- **1 file modified**: `src/pages/Settings.tsx`
- No new components or dependencies
- GoHighLevel link stays as-is (already works)

