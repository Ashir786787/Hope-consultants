import { Suspense, type ReactNode } from "react";
import { redirect } from "next/navigation";

import { AdminAutoRefresh } from "@/components/admin/admin-auto-refresh";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { countLeadsByStatus } from "@/lib/admin/lead";
import { requireAdmin } from "@/lib/admin/require-admin";

const SIDEBAR_SURFACE =
  "bg-[linear-gradient(180deg,rgb(var(--hope-midnight-rgb)),rgb(var(--hope-obsidian-rgb)/0.55))]";

function SidebarFallback() {
  return <aside className={`hidden shrink-0 lg:fixed lg:inset-y-0 lg:left-0 lg:block lg:w-64 ${SIDEBAR_SURFACE}`} />;
}

export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  const admin = await requireAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const byStatus = await countLeadsByStatus();

  return (
    <div className="min-h-dvh bg-hope-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-40 focus:rounded-full focus:bg-hope-ember focus:px-5 focus:py-3 focus:font-semibold focus:text-hope-midnight"
      >
        Skip to content
      </a>
      <AdminAutoRefresh />
      <Suspense fallback={<SidebarFallback />}>
        <AdminSidebar name={admin.name} email={admin.email} newLeads={byStatus.New} />
      </Suspense>
      <div className="lg:pl-64">
        <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
