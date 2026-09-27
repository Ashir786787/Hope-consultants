"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import { z } from "zod";

import { AdminAlert, AdminButton, AdminField } from "./admin-ui";

const schema = z.object({
  name: z.string().trim().min(1, "Enter their name."),
  email: z.string().trim().email("That email address does not look right."),
  role: z.string().trim().min(1, "Enter a role."),
});

type Values = z.infer<typeof schema>;

export function AdminCreateAdminForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [created, setCreated] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", role: "Administrator" },
  });

  async function onSubmit(values: Values) {
    setFormError(null);
    setCreated(null);
    setPending(true);
    try {
      const response = await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
        admin?: { name?: string; email?: string };
      } | null;

      if (!response.ok) {
        setFormError(payload?.error ?? "Could not add that admin.");
        return;
      }

      const name = payload?.admin?.name ?? values.name;
      const email = payload?.admin?.email ?? values.email;
      setCreated(
        `${name} can now sign in as ${email}. They choose their own password on first sign-in, and we have emailed them an invitation.`
      );
      reset({ name: "", email: "", role: "Administrator" });
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <AdminField
          id="new-admin-name"
          label="Name"
          autoComplete="off"
          error={errors.name?.message}
          {...register("name")}
        />
        <AdminField
          id="new-admin-email"
          label="Email address"
          type="email"
          autoComplete="off"
          error={errors.email?.message}
          {...register("email")}
        />
      </div>
      <AdminField
        id="new-admin-role"
        label="Role"
        hint="A label only. Roles do not change what someone can do in this panel."
        error={errors.role?.message}
        {...register("role")}
      />
      {formError ? <AdminAlert tone="error">{formError}</AdminAlert> : null}
      {created ? <AdminAlert tone="success">{created}</AdminAlert> : null}
      <div>
        <AdminButton type="submit" variant="primary" disabled={pending}>
          <UserPlus className="size-4" strokeWidth={1.75} aria-hidden="true" />
          {pending ? "Adding…" : "Add admin"}
        </AdminButton>
      </div>
    </form>
  );
}
