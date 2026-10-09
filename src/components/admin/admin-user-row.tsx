"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { AdminPanelSection } from "@/lib/admin/types";

import { AdminAccessControl } from "./admin-access-control";
import { AdminAlert, AdminBadge, AdminButton } from "./admin-ui";

export type AdminRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  isOwner: boolean;
  isActive: boolean;
  isAccessRequest: boolean;
  hasCompletedFirstLogin: boolean;
  permissions: AdminPanelSection[] | null;
  contentCollections: string[] | null;
  createdLabel: string;
  lastLoginLabel: string;
  verifiedLabel: string | null;
};

export function AdminUserRow({
  admin,
  isSelf,
  canManageRoles,
}: {
  admin: AdminRow;
  isSelf: boolean;
  canManageRoles: boolean;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [confirming, setConfirming] = useState(false);

  async function call(url: string, method: "PATCH" | "DELETE", body?: unknown) {
    setError(null);
    setPending(true);
    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        setError(payload?.error ?? "That did not work.");
        return;
      }
      setConfirming(false);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  const awaitingCode = admin.isAccessRequest && !admin.hasCompletedFirstLogin;

  const status = admin.isOwner
    ? "owner"
    : awaitingCode
      ? "pending"
      : !admin.isActive
        ? "inactive"
        : admin.hasCompletedFirstLogin
          ? "active"
          : "pending";

  const statusLabel = admin.isOwner
    ? "Owner"
    : awaitingCode
      ? "Waiting for your code"
      : !admin.isActive
        ? "Deactivated"
        : admin.hasCompletedFirstLogin
          ? "Active"
          : "Awaiting first sign-in";

  return (
    <li className="flex flex-col gap-4 rounded-2xl border border-hope-midnight/10 bg-hope-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-hope-midnight">
            {admin.name}
            {isSelf ? " (you)" : ""}
          </p>
          <p className="text-sm text-hope-fog">{admin.email}</p>
          <p className="text-sm text-hope-fog">{admin.role}</p>
        </div>
        <AdminBadge tone={status}>{statusLabel}</AdminBadge>
      </div>

      <dl className="grid gap-3 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-hope-fog">Added</dt>
          <dd className="text-hope-midnight">{admin.createdLabel}</dd>
        </div>
        <div>
          <dt className="text-hope-fog">Last sign-in</dt>
          <dd className="text-hope-midnight">{admin.lastLoginLabel}</dd>
        </div>
        <div>
          <dt className="text-hope-fog">First verified</dt>
          <dd className="text-hope-midnight">{admin.verifiedLabel ?? "Not yet"}</dd>
        </div>
      </dl>

      {canManageRoles && !admin.isOwner && !awaitingCode ? (
        <AdminAccessControl
          adminId={admin.id}
          permissions={admin.permissions}
          contentCollections={admin.contentCollections}
        />
      ) : null}

      {error ? <AdminAlert tone="error">{error}</AdminAlert> : null}

      {awaitingCode ? (
        <p className="text-sm text-hope-fog">
          They are not in the panel yet. The only way in is the one-time code you were emailed.
          If you do not recognise this request, delete it.
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {awaitingCode ? null : (
          <AdminButton
            type="button"
            variant="secondary"
            disabled={pending || admin.isOwner}
            title={
              admin.isOwner
                ? "The owner account cannot be deactivated."
                : admin.isActive
                  ? "Deactivate this admin"
                  : "Reactivate this admin"
            }
            onClick={() =>
              call(`/api/admin/admins/${admin.id}`, "PATCH", { isActive: !admin.isActive })
            }
          >
            {admin.isActive ? "Deactivate" : "Reactivate"}
          </AdminButton>
        )}

        {confirming ? (
          <>
            <AdminButton
              type="button"
              variant="secondary"
              disabled={pending}
              onClick={() => call(`/api/admin/admins/${admin.id}`, "DELETE")}
            >
              {pending ? "Deleting…" : "Confirm delete"}
            </AdminButton>
            <AdminButton
              type="button"
              variant="secondary"
              disabled={pending}
              onClick={() => setConfirming(false)}
            >
              Cancel
            </AdminButton>
          </>
        ) : (
          <AdminButton
            type="button"
            variant="secondary"
            disabled={pending || admin.isOwner || isSelf}
            title={
              admin.isOwner
                ? "The owner account cannot be deleted."
                : isSelf
                  ? "You cannot delete your own account."
                  : "Delete this admin"
            }
            onClick={() => setConfirming(true)}
          >
            Delete
          </AdminButton>
        )}
      </div>
    </li>
  );
}
