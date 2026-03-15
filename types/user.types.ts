export type UserType = "ADMIN" | "STAFF" | "CUSTOMER";

export interface AppUser {
  id: number | string;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  email: string;
  user_type: UserType;
  profile_picture: string | null;
  mobile_number: string;
  whatsapp_number: string | null;
  is_verified: boolean;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  last_login: string | null;
  date_joined: string;
  created_at: string;
  updated_at: string;
}

