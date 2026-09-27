import { randomUUID } from "node:crypto";

import {
  mongoCount,
  mongoDeleteOne,
  mongoEnsureIndex,
  mongoFind,
  mongoFindOne,
  mongoInsertOne,
  mongoUpdateOne,
} from "@/lib/mongo";
import type { AdminUser, AdminUserSummary } from "@/lib/admin/types";

const COLLECTION = "adminUsers";

export const ACCESS_REQUEST_RETENTION_HOURS = 24;

export function maxOpenAccessRequests(): number {
  const configured = Number(process.env.MAX_OPEN_ACCESS_REQUESTS);
  return Number.isFinite(configured) && configured >= 0 ? Math.trunc(configured) : 25;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function ensureAdminUserIndexes(): Promise<void> {
  await mongoEnsureIndex(COLLECTION, { email: 1 }, { unique: true });
  await mongoEnsureIndex(COLLECTION, { purgeAt: 1 }, { expireAfterSeconds: 0 });
}

export async function findAdminByEmail(email: string): Promise<AdminUser | null> {
  return mongoFindOne<AdminUser>(COLLECTION, { email: normalizeEmail(email) });
}

export async function findAdminById(id: string): Promise<AdminUser | null> {
  return mongoFindOne<AdminUser>(COLLECTION, { id });
}

export async function listAdmins(): Promise<AdminUser[]> {
  return mongoFind<AdminUser>(COLLECTION, {}, { sort: { createdAt: 1 } });
}

export async function countAdmins(): Promise<number> {
  return mongoCount(COLLECTION, {});
}

export async function createAdmin(input: {
  name: string;
  email: string;
  role: string;
}): Promise<AdminUser> {
  await ensureAdminUserIndexes();
  const admin: AdminUser = {
    id: randomUUID(),
    name: input.name.trim(),
    email: normalizeEmail(input.email),
    passwordHash: null,
    role: input.role,
    isOwner: false,
    hasCompletedFirstLogin: false,
    isActive: true,
    isAccessRequest: false,
    createdAt: new Date().toISOString(),
    lastLoginAt: null,
    firstLoginVerifiedAt: null,
    sessionsValidAfter: null,
    purgeAt: null,
  };
  await mongoInsertOne(COLLECTION, { ...admin });
  return admin;
}

export function displayNameFromEmail(email: string): string {
  const local = normalizeEmail(email).split("@")[0] ?? "";
  return local.length > 0 ? local : "Admin";
}

export async function countOpenAccessRequests(): Promise<number> {
  return mongoCount(COLLECTION, {
    isAccessRequest: true,
    hasCompletedFirstLogin: false,
    purgeAt: { $gt: new Date() },
  });
}

export async function requestAdminAccess(input: {
  email: string;
  passwordHash: string;
  ip: string | null;
}): Promise<AdminUser> {
  await ensureAdminUserIndexes();
  const now = new Date();
  const admin: AdminUser = {
    id: randomUUID(),
    name: displayNameFromEmail(input.email),
    email: normalizeEmail(input.email),
    passwordHash: input.passwordHash,
    role: "Administrator",
    isOwner: false,
    hasCompletedFirstLogin: false,
    isActive: false,
    isAccessRequest: true,
    createdAt: now.toISOString(),
    lastLoginAt: null,
    firstLoginVerifiedAt: null,
    sessionsValidAfter: null,
    purgeAt: new Date(now.getTime() + ACCESS_REQUEST_RETENTION_HOURS * 60 * 60 * 1000),
  };
  await mongoInsertOne(COLLECTION, { ...admin });
  return admin;
}

export async function updateAdmin(
  id: string,
  patch: Partial<Omit<AdminUser, "id" | "createdAt">>
): Promise<void> {
  await mongoUpdateOne(COLLECTION, { id }, { $set: patch });
}

export async function deleteAdmin(id: string): Promise<boolean> {
  const deleted = await mongoDeleteOne(COLLECTION, { id });
  return deleted > 0;
}

export async function setAdminActive(id: string, isActive: boolean): Promise<void> {
  await updateAdmin(id, isActive ? { isActive } : { isActive, isAccessRequest: false });
  await mongoUpdateOne(COLLECTION, { id }, { $unset: { purgeAt: "" } });
}

export async function emailIsRegistered(email: string): Promise<boolean> {
  return (await findAdminByEmail(email)) !== null;
}

export function toAdminSummary(admin: AdminUser): AdminUserSummary {
  return {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    isOwner: admin.isOwner,
    isAccessRequest: admin.isAccessRequest,
    hasCompletedFirstLogin: admin.hasCompletedFirstLogin,
    isActive: admin.isActive,
    createdAt: admin.createdAt,
    lastLoginAt: admin.lastLoginAt,
    firstLoginVerifiedAt: admin.firstLoginVerifiedAt,
  };
}

export async function listOwnerEmails(excludeAdminId?: string): Promise<string[]> {
  const owners = await mongoFind<AdminUser>(
    COLLECTION,
    {
      isOwner: true,
      ...(excludeAdminId ? { id: { $ne: excludeAdminId } } : {}),
    },
    { projection: { email: 1 } }
  );
  return owners.map((owner) => owner.email);
}

export async function recordAdminLogin(id: string): Promise<void> {
  await updateAdmin(id, { lastLoginAt: new Date().toISOString() });
}

export async function setInitialPassword(
  id: string,
  passwordHash: string
): Promise<void> {
  await updateAdmin(id, {
    passwordHash,
    hasCompletedFirstLogin: false,
    firstLoginVerifiedAt: null,
  });
}

export async function recordFirstLoginVerified(id: string): Promise<void> {
  await updateAdmin(id, {
    hasCompletedFirstLogin: true,
    isActive: true,
    isAccessRequest: false,
    firstLoginVerifiedAt: new Date().toISOString(),
  });
  await mongoUpdateOne(COLLECTION, { id }, { $unset: { purgeAt: "" } });
}

export async function revokeSessions(id: string): Promise<void> {
  await updateAdmin(id, { sessionsValidAfter: new Date().toISOString() });
}

export async function setPassword(id: string, passwordHash: string): Promise<void> {
  await updateAdmin(id, { passwordHash });
}
