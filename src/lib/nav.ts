/** Single source of truth for the marketing site's section links, shared by
 *  the navbar and the footer so the two never drift out of sync. */
export const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Demo", href: "#demo" },
  { label: "Tools", href: "#tools" },
  { label: "Reviews", href: "#reviews" },
] as const;
