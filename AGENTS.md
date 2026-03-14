# Project Instructions

## Frontend Priorities (From Client Documentation)
- Build customer-facing pages only on the public side: `Home`, `About`, `Products & Price List`, `Customer Registration/Login`, `Customer Dashboard`, and `Contact`.
- Keep farmer onboarding out of frontend signup; farmer accounts are backend/admin-managed only.
- Home page should include hero messaging, core CTAs (`Create Customer Account`, `View Products`, `Request a Quote`), benefits, testimonials, and latest announcements/blog preview.
- Products page should publicly show maize types, packaging sizes, price per bag/ton, and availability status without login.
- `Order Now` should remain visible on products, but initiating checkout/order placement requires login.
- Customer registration should support: full name, profile picture (optional), mobile, WhatsApp, email, location/town, password, and confirm password.
- Customer dashboard should provide product/price view, place order, order history, order status, profile settings, and notifications/updates.
- Contact page should include phone, WhatsApp, email, office location, Google Map, and contact form.

## Accessibility (Must-Have)
- Ensure screen-reader compatibility across all customer-facing pages.
- Use clear ARIA labels for interactive elements.
- Add meaningful alt text for all images.
- Support full keyboard navigation.
- Provide a high-contrast mode for low-vision accessibility.

## Frontend Security Baseline
- Enforce HTTPS in deployment.
- Validate email and phone formats on forms.
- Maintain secure user session handling.
- Use secure password handling (hashing/encryption handled by auth backend).

## Implementation Guidance for This Repo
- Study and follow conventions from `C:\Users\Good\Desktop\Klasique_projects\cafa-tickets` before major implementation work.
- Specifically learn and mirror:
  - folder structure organization
  - file naming conventions
  - how pages are split into reusable components
  - API-calling/service patterns
  - general frontend architecture decisions
