export type OtpPurpose = "first_login" | "password_change";

export const LEAD_STATUSES = ["New", "Contacted", "Converted", "Lost"] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const ADMIN_PANEL_SECTIONS = ["dashboard", "leads", "onboarding", "content", "admins"] as const;

export type AdminPanelSection = (typeof ADMIN_PANEL_SECTIONS)[number];

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string | null;
  role: string;
  isOwner: boolean;
  isActive: boolean;
  hasCompletedFirstLogin: boolean;
  isAccessRequest: boolean;
  permissions: AdminPanelSection[] | null;
  contentCollections: string[] | null;
  createdAt: string;
  lastLoginAt: string | null;
  firstLoginVerifiedAt: string | null;
  sessionsValidAfter: string | null;
  purgeAt: Date | null;
}

export type AdminUserSummary = Omit<
  AdminUser,
  "passwordHash" | "sessionsValidAfter" | "purgeAt"
>;

export interface OtpChallenge {
  id: string;
  adminUserId: string;
  purpose: OtpPurpose;
  codeHash: string;
  expiresAt: string;
  attempts: number;
  createdAt: string;
  verifiedAt: string | null;
  failedAt: string | null;
  attemptsUsed: number;
  ip: string | null;
  purgeAt: Date;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: LeadStatus;
  sourcePage: string;
  notes: string;
  submittedAt: string;
}
