"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut } from "lucide-react";

import { cn } from "@/lib/utils";

export function AdminAccountBlock({
  name,
  email,
  className,
  onNavigate,
}: {
  name: string;
  email: string;
  className?: string;
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    setPending(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      onNavigate?.();
      router.replace("/admin/login");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <div className={cn("mt-auto flex flex-col gap-3 border-t border-hope-white/10 pt-4", className)}>
      <div className="flex min-w-0 flex-col gap-0.5 px-3">
        <p className="truncate text-sm font-medium">{name}</p>
        <p className="truncate text-xs text-hope-white/70">{email}</p>
      </div>
      <button
        type="button"
        onClick={handleLogout}
        disabled={pending}
        className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-left text-sm font-medium text-hope-white/80 transition-colors hover:bg-hope-white/10 hover:text-hope-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hope-ember disabled:cursor-not-allowed disabled:opacity-60"
      >
        <LogOut className="size-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
        {pending ? "Signing out…" : "Logout"}
      </button>
    </div>
  );
}
