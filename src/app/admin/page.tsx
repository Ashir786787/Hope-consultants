import { AdminEditor } from "@/components/admin/admin-editor";
import { AdminLogin } from "@/components/admin/admin-login";
import { isAuthenticated } from "@/lib/auth";

export default async function AdminPage() {
  const authed = await isAuthenticated();
  return authed ? <AdminEditor /> : <AdminLogin />;
}