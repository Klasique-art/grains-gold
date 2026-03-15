import { AppUser } from "@/types";

export const getUserDisplayName = (user: AppUser): string => {
  const fullName = `${user.first_name} ${user.last_name}`.trim();
  return fullName || user.username;
};

export const getUserInitials = (user: AppUser): string => {
  const first = user.first_name?.trim()?.charAt(0) || "";
  const last = user.last_name?.trim()?.charAt(0) || "";

  if (first || last) {
    return `${first}${last}`.toUpperCase();
  }

  return user.username.slice(0, 2).toUpperCase();
};

