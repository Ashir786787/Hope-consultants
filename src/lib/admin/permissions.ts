import { ADMIN_PANEL_SECTIONS } from "@/lib/admin/types";
import type { AdminPanelSection } from "@/lib/admin/types";
import { SCHEMAS } from "@/lib/content/schemas";

export const SECTION_LABELS: Record<AdminPanelSection, string> = {
  dashboard: "Dashboard",
  leads: "Leads",
  onboarding: "Onboarding forms",
  content: "Content editor",
  admins: "Admin users",
};

export const SECTION_HREFS: Record<AdminPanelSection, string> = {
  dashboard: "/admin",
  leads: "/admin/leads",
  onboarding: "/admin/onboarding",
  content: "/admin/content",
  admins: "/admin/admins",
};

export const SECTION_BY_HREF: Partial<Record<string, AdminPanelSection>> = {
  "/admin": "dashboard",
  "/admin/leads": "leads",
  "/admin/onboarding": "onboarding",
  "/admin/content": "content",
  "/admin/admins": "admins",
};

export type SectionHolder = {
  isOwner: boolean;
  permissions: AdminPanelSection[] | null | undefined;
};

export function hasSection(holder: SectionHolder, section: AdminPanelSection): boolean {
  if (holder.isOwner) return true;
  if (!holder.permissions) return true;
  return holder.permissions.includes(section);
}

export function accessSummary(permissions: AdminPanelSection[] | null | undefined): string {
  if (!permissions || ADMIN_PANEL_SECTIONS.every((section) => permissions.includes(section))) {
    return "Full access";
  }
  if (permissions.length === 0) return "No sections";
  return permissions.map((section) => SECTION_LABELS[section]).join(", ");
}

export function firstPermittedHref(holder: SectionHolder): string {
  for (const section of ADMIN_PANEL_SECTIONS) {
    if (hasSection(holder, section)) return SECTION_HREFS[section];
  }
  return "/admin/settings";
}

export const CONTENT_CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  SCHEMAS.map((schema) => [schema.key, schema.label]),
);

export type ContentCollectionHolder = SectionHolder & {
  contentCollections: string[] | null | undefined;
};

export function hasContentCollection(
  holder: ContentCollectionHolder,
  key: string
): boolean {
  if (holder.isOwner) return true;
  if (holder.contentCollections === null || holder.contentCollections === undefined) return true;
  return holder.contentCollections.includes(key);
}

export function contentAccessSummary(
  contentCollections: string[] | null | undefined
): string {
  if (contentCollections === null || contentCollections === undefined) return "All content";
  if (contentCollections.length === 0) return "No content";
  return contentCollections
    .map((key) => CONTENT_CATEGORY_LABELS[key] ?? key)
    .join(", ");
}
