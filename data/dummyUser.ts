import { AppUser } from "@/types";

export const demoCustomer: AppUser = {
  id: 1,
  username: "naana.badu",
  password: "hashed-password-placeholder",
  first_name: "Naana",
  last_name: "Badu",
  email: "naana.badu@example.com",
  user_type: "CUSTOMER",
  profile_picture:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=687&auto=format&fit=crop",
  mobile_number: "+233240001111",
  whatsapp_number: "+233240001111",
  is_verified: true,
  is_active: true,
  is_staff: false,
  is_superuser: false,
  last_login: "2026-03-14T12:20:00.000Z",
  date_joined: "2025-11-20T09:10:00.000Z",
  created_at: "2025-11-20T09:10:00.000Z",
  updated_at: "2026-03-14T12:20:00.000Z",
};

export const currentUser: AppUser | null = demoCustomer;
