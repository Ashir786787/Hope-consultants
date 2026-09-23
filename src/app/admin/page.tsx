import { AdminEditor } from "@/components/admin/admin-editor";
import { AdminLogin } from "@/components/admin/admin-login";
import { isAuthenticated } from "@/lib/auth";
import { mongoConfigured } from "@/lib/mongo";

export default async function AdminPage() {
  const authed = await isAuthenticated();
  return authed ? (
    <AdminEditor storage={mongoConfigured() ? "mongodb" : "json-files"} />
  ) : (
    <AdminLogin />
  );
}