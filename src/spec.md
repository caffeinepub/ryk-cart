# Specification

## Summary
**Goal:** Build “Ryk cart,” a marketplace-style e-commerce web app with browsing/shopping flows, Internet Identity login for orders and account features, WhatsApp support entry, loyalty points with 20-point redemptions, and an admin product management area—styled with a distinctive theme.

**Planned changes:**
- Create core storefront flows: product catalog with categories/search, product details, cart (edit quantities/remove), and order placement with confirmation.
- Add Internet Identity sign-in; require authentication for placing orders and viewing Order History and Loyalty/Rewards.
- Persist user orders and display them in an Order History screen.
- Add a “Support / Complaints” entry that opens a WhatsApp chat to 03280941320 with a prefilled English message via a wa.me link.
- Implement loyalty points: award points on successful order placement (rule shown in UI) and display current balance (badge + Loyalty/Rewards page), persisted per user.
- Add rewards redemption: when points ≥ 20, allow redeeming exactly 20 points for either Cashback or Mystery Box; record redemption history; disable redemption when points < 20 with an English explanation.
- Add admin-only product management (allowlisted principal): create/edit/deactivate products with name, price, description, category, stock, and images; inactive products hidden from catalog; changes persisted.
- Apply a coherent, marketplace-friendly visual theme across key pages (not a Daraz copy), avoiding a blue+purple primary combination.
- Add generated static brand/UI images under `frontend/public/assets/generated` and reference them in the UI (e.g., header logo, home hero).

**User-visible outcome:** Users can browse products, view details, manage a cart, sign in with Internet Identity to place orders and see their order history, contact support via WhatsApp link, earn loyalty points from purchases, redeem 20 points for Cashback or a Mystery Box, and (if admin) manage products in an admin section.
