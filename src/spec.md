# Specification

## Summary
**Goal:** Fix the /admin access flow so eligible users can reach the admin unlock screen, support single-password bootstrap claiming when needed, and provide clearer diagnostics when access is denied.

**Planned changes:**
- Update frontend /admin gating to: prompt Internet Identity login when signed out; show admin password unlock when signed in and backend-recognized as admin; otherwise show an improved Access Denied screen with next steps.
- Update the frontend bootstrap-claim flow to require only a single password (no username anywhere), use English-only text, and auto re-check admin status after a successful claim (React Query invalidations) so the user can proceed without refreshing.
- Repair backend bootstrap availability and admin recognition so that when no effective admin exists bootstrap becomes available, claiming bootstrap grants the caller admin privileges for isCallerAdmin and admin-only mutations, and availability is not blocked by stale/incorrect admin initialization state.
- Enhance the Access Denied UI to display the caller Principal ID (copyable/monospace), show whether bootstrap is available (Yes/No), and include a WhatsApp support CTA to 03280941320 with a prefilled message containing the Principal ID.

**User-visible outcome:** Visiting /admin now guides the user correctly: signed-out users are asked to sign in with Internet Identity; signed-in admins can unlock and access the Admin Products panel; signed-in non-admins see clear English guidance, bootstrap claim (if available), and a support button that shares their Principal ID via WhatsApp.
