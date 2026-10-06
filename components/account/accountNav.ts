import { Bell, Bookmark, Gift, LifeBuoy, Ticket, User, type LucideIcon } from "lucide-react";

export type AccountNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const ACCOUNT_NAV: AccountNavItem[] = [
  { href: "/profile", label: "Profile", icon: User },
  { href: "/tickets", label: "Bookings", icon: Ticket },
  { href: "/saved", label: "Saved spots", icon: Bookmark },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/rewards", label: "Rewards", icon: Gift },
  { href: "/help-center", label: "Help & safety", icon: LifeBuoy },
];
