"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { z } from "zod";

import { ADMIN_PANEL_SECTIONS } from "@/lib/admin/types";
import { SECTION_LABELS } from "@/lib/admin/permissions";
import { CONTENT_KEYS } from "@/lib/content/schemas";
import { CONTENT_CATEGORY_LABELS } from "@/lib/admin/permissions";

import { AdminAlert, AdminButton, AdminField } from "./admin-ui";

const schema = z
  .object({
    name: z.string().trim().min(1, "Enter their name."),
    email: z.string().trim().email("That email address does not look right."),
    role: z.string().trim().min(1, "Enter a role."),
    setPassword: z.boolean().optional(),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
    limitAccess: z.boolean().optional(),
    permissions: z.array(z.string()).optional(),
    contentCollections: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      if (!data.setPassword) return true;
      if (!data.password || data.password.length < 8) return false;
      return data.password === data.confirmPassword;
    },
    {
      message: "Set a password of at least 8 characters and confirm it.",
      path: ["password"],
    }
  );

type Values = z.infer<typeof schema>;

export function AdminCreateAdminForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [created, setCreated] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      role: "Administrator",
      setPassword: false,
      password: "",
      confirmPassword: "",
      limitAccess: false,
      permissions: [...ADMIN_PANEL_SECTIONS],
      contentCollections: [...CONTENT_KEYS],
    },
  });

  const setPassword = watch("setPassword");
  const limitAccess = watch("limitAccess");
  const permissions = watch("permissions") ?? [...ADMIN_PANEL_SECTIONS];
  const contentCollections = watch("contentCollections") ?? [...CONTENT_KEYS];

  function togglePermission(section: string) {
    const current = permissions;
    const next = current.includes(section)
      ? current.filter((v) => v !== section)
      : [...current, section];
    if (next.length === 0) {
      setFormError("Keep at least one section.");
      return;
    }
    setFormError(null);
    setValue("permissions", next);
  }

  function toggleContent(cat: string) {
    const current = contentCollections;
    const next = current.includes(cat)
      ? current.filter((v) => v !== cat)
      : [...current, cat];
    if (next.length === 0) {
      setFormError("Keep at least one content category.");
      return;
    }
    setFormError(null);
    setValue("contentCollections", next);
  }

  async function onSubmit(values: Values) {
    setFormError(null);
    setCreated(null);
    setPending(true);
    try {
      const body: any = {
        name: values.name,
        email: values.email,
        role: values.role,
        setPassword: values.setPassword,
        password: values.setPassword ? values.password : undefined,
      };
      if (values.limitAccess) {
        body.permissions = permissions;
        body.contentCollections = permissions.includes("content") ? contentCollections : null;
      }
      const response = await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
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
      if (values.setPassword) {
        setCreated(`${name} (${email}) has been added and can log in immediately with the password you set.`);
      } else {
        setCreated(
          `${name} can now sign in as ${email}. They choose their own password on first sign-in, and we have emailed them an invitation.`
        );
      }
      reset({
        name: "",
        email: "",
        role: "Administrator",
        setPassword: false,
        password: "",
        confirmPassword: "",
        limitAccess: false,
        permissions: [...ADMIN_PANEL_SECTIONS],
        contentCollections: [...CONTENT_KEYS],
      });
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
        hint="A label only. Only the owner can manage admins."
        error={errors.role?.message}
        {...register("role")}
      />
      <label className="flex items-center gap-2 text-sm text-hope-midnight">
        <input type="checkbox" {...register("setPassword")} className="size-4" />
        Set password now (admin can login immediately)
      </label>
      {setPassword ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="new-admin-password" className="text-sm font-medium text-hope-midnight">Password</label>
            <div className="relative">
              <input
                id="new-admin-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                className="w-full rounded-lg border border-hope-midnight/15 px-3 py-2 pr-10 text-sm"
                {...register("password")}
              />
              <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1" aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.password?.message ? <p className="text-xs text-hope-midnight">{errors.password.message}</p> : null}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="new-admin-confirm" className="text-sm font-medium text-hope-midnight">Confirm password</label>
            <div className="relative">
              <input
                id="new-admin-confirm"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                className="w-full rounded-lg border border-hope-midnight/15 px-3 py-2 pr-10 text-sm"
                {...register("confirmPassword")}
              />
              <button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1" aria-label={showConfirm ? "Hide password" : "Show password"}>
                {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <label className="flex items-center gap-2 text-sm text-hope-midnight">
        <input type="checkbox" {...register("limitAccess")} className="size-4" />
        Limit access (restrict sections/content for this admin)
      </label>
      {limitAccess ? (
        <div className="flex flex-col gap-4 rounded-xl border border-hope-midnight/10 p-4">
          <fieldset className="flex flex-col gap-1">
            <legend className="mb-1 text-sm font-semibold text-hope-midnight">Sections</legend>
            {ADMIN_PANEL_SECTIONS.map((section) => {
              const checked = permissions.includes(section);
              const id = `create-access-${section}`;
              return (
                <label key={section} htmlFor={id} className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-hope-midnight">
                  <input
                    id={id}
                    type="checkbox"
                    checked={checked}
                    onChange={() => togglePermission(section)}
                    className="size-4 shrink-0 accent-hope-ember"
                  />
                  {SECTION_LABELS[section]}
                </label>
              );
            })}
          </fieldset>
          {permissions.includes("content") ? (
            <fieldset className="flex flex-col gap-1 rounded-lg bg-hope-midnight/5 p-3">
              <legend className="mb-1 px-1 text-sm font-semibold text-hope-midnight">Content categories</legend>
              {CONTENT_KEYS.map((cat) => {
                const checked = contentCollections.includes(cat);
                const id = `create-content-${cat}`;
                return (
                  <label key={cat} htmlFor={id} className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-hope-midnight">
                    <input
                      id={id}
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleContent(cat)}
                      className="size-4 shrink-0 accent-hope-ember"
                    />
                    {CONTENT_CATEGORY_LABELS[cat]}
                  </label>
                );
              })}
            </fieldset>
          ) : null}
          <p className="text-xs text-hope-fog">Only the owner can manage other admins. Restricted admins cannot add/edit/delete other admins.</p>
        </div>
      ) : null}

      {formError ? <AdminAlert tone="error">{formError}</AdminAlert> : null}
      {created ? <AdminAlert tone="success">{created}</AdminAlert> : null}
      <div>
        <AdminButton type="submit" variant="primary" disabled={pending}>
          <UserPlus className="size-4" strokeWidth={1.75} aria-hidden="true" />
          {pending ? "Adding..." : "Add admin"}
        </AdminButton>
      </div>
    </form>
  );
}
