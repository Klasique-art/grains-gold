import { FooterContactItem, FooterLinkItem } from "@/types";

export const footerPrimaryLinks: FooterLinkItem[] = [
  { id: "home", label: "Home", href: "/" },
  { id: "about", label: "About", href: "/about" },
  { id: "products", label: "Products", href: "/products" },
  { id: "contact", label: "Contact", href: "/contact" },
];

export const footerCustomerLinks: FooterLinkItem[] = [
  { id: "register", label: "Create Customer Account", href: "/register" },
  { id: "login", label: "Customer Login", href: "/login" },
  { id: "dashboard", label: "Dashboard", href: "/dashboard" },
  { id: "quote", label: "Request a Quote", href: "/contact#quote" },
];

export const footerContactInfo: FooterContactItem[] = [
  {
    id: "phone",
    label: "Phone",
    value: "+233 20 123 4567",
    href: "tel:+233201234567",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    value: "+233 24 000 1111",
    href: "https://wa.me/233240001111",
  },
  {
    id: "email",
    label: "Email",
    value: "hello@grainsgold.com",
    href: "mailto:hello@grainsgold.com",
  },
  {
    id: "address",
    label: "Office",
    value: "Tamale, Northern Region, Ghana",
    href: "https://maps.google.com/?q=Tamale%2C+Ghana",
  },
];
