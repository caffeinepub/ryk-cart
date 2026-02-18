# Specification

## Summary
**Goal:** Make it clear how to add products when the shop catalog is empty, and improve admin product list guidance for loading vs empty states.

**Planned changes:**
- Add a dedicated empty-state panel on the Catalog (Shop) page when there are zero active products, explaining that products are not available yet and directing admins to Admin → Product Management.
- Use the existing `isAdmin` query to tailor the Catalog empty state:
  - Admins: show a button that navigates to `/admin`.
  - Non-admins: hide the admin button and show a short note that the admin area is restricted.
- Add an always-available “How to add products” help entry point for admins (in the Admin Products area) describing the minimum required fields (name, price, category, stock) plus optional image URLs (one per line), and where to find Product Management (`/admin`) and the existing “Add Product” button.
- Improve the Admin Products page table loading/empty states:
  - Show a clear loading indicator while product data is loading.
  - After loading, if there are no products, show an explicit empty state message guiding the admin to click “Add Product”.
  - Keep current table behavior unchanged when products exist (including edit and activate/deactivate actions).

**User-visible outcome:** When the shop has no products, users see a clear explanation instead of a generic message; admins get a direct path and quick help to add products, and the Admin Products list clearly distinguishes loading from having no products.
