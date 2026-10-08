import { ADMIN_PANEL_SECTIONS } from "@/lib/admin/types";
import type { AdminPanelSection } from "@/lib/admin/types";

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
