export const sectionIds = {
  "/": "home",
  "/about": "about",
  "/services": "services",
  "/work": "portfolio",
  "/process": "process",
  "/contact": "contact",
} as const;

// Pages that have their own dedicated route (not scroll anchors on home)
const dedicatedPageRoutes = [] as const;

export function getSectionId(href: string) {
  return sectionIds[href as keyof typeof sectionIds] ?? href.replace(/^\//, "");
}

export function getSectionHref(locale: string, href: string) {
  const sectionId = getSectionId(href);
  const base = `/${locale}`;

  // Check if this is a dedicated page route
  if (dedicatedPageRoutes.includes(href as typeof dedicatedPageRoutes[number])) {
    return `${base}${href}`;
  }

  if (sectionId === "home") {
    return `${base}#home`;
  }

  return `${base}#${sectionId}`;
}
