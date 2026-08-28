import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/sidebar";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className="container-site py-8">
      <div className="grid gap-8 lg:grid-cols-[230px_1fr]">
        <AdminSidebar adminName={admin.name} adminEmail={admin.email} />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
