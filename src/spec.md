# Specification

## Summary
**Goal:** Make the admin bootstrap claim flow work end-to-end so “Access Denied” can be resolved and the admin panel becomes reachable without refresh, while enforcing password validation on the backend.

**Planned changes:**
- Fix backend bootstrap claim so a successful claim immediately grants admin permissions in the same session (so isCallerAdmin becomes true and admin-only mutations succeed).
- Correct backend bootstrap availability logic to be accurate and side-effect-free (only true when an initial admin can still be established; false when an admin exists or after bootstrap is claimed).
- Enforce admin bootstrap password validation on the backend (password must be `miang275@`) and return clear errors for incorrect passwords.
- Persist bootstrap-related state across canister upgrades so availability/claimed status remain consistent after redeployments.
- Update frontend bootstrap-claim call to use the corrected backend method (including passing the password) and refetch/invalidate admin + bootstrap status so the UI transitions to the Admin password unlock screen after success; show clear English errors on failure.

**User-visible outcome:** From `/admin`, an Internet Identity user can claim initial admin access with the correct password and immediately proceed past the Access Denied screen to the Admin unlock screen; incorrect passwords show a clear error and do not grant admin access.
