export const siteConfig = {
  name: "VYBE",
  tagline: "Plans • Events • Experiences",
  title: "VYBE — Plans • Events • Experiences",
  description:
    "Discover movies, events, activities and play near you with VYBE.",
  defaultCity: "Hyderabad",
  availableCities: ["Hyderabad", "Bengaluru", "Mumbai", "Delhi NCR"] as const,
  contact: {
    email: "hello@vybe.app",
    phone: "+91 40 4567 8900",
    addressLines: [
      "Raidurg Metro Pillar, HITEC City",
      "Hyderabad, Telangana 500081",
    ] as const,
  },
  nav: [
    { href: "/movies", label: "Movies" },
    { href: "/events", label: "Events" },
    { href: "/activities", label: "Activities" },
    { href: "/play", label: "Play" },
  ] as const,
  footer: {
    explore: [
      { href: "/movies", label: "Movies" },
      { href: "/events", label: "Events" },
      { href: "/activities", label: "Activities" },
      { href: "/play", label: "Play" },
    ],
    company: [
      { href: "/about-us", label: "About Us" },
      { href: "/careers", label: "Careers" },
      { href: "/contact", label: "Contact" },
      { href: "/partner-with-us", label: "Partner With Us" },
    ],
    support: [
      { href: "/help-center", label: "Help & FAQ" },
      { href: "/terms-of-service", label: "Terms of Service" },
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/refund-policy", label: "Refund Policy" },
    ],
    legal: [
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/terms-of-service", label: "Terms of Service" },
      { href: "/refund-policy", label: "Refund Policy" },
    ],
  },
  languages: [
    { id: "all", label: "All" },
    { id: "telugu", label: "Telugu" },
    { id: "hindi", label: "Hindi" },
    { id: "english", label: "English" },
    { id: "tamil", label: "Tamil" },
  ] as const,
} as const;
