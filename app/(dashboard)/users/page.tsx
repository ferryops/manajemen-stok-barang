import { ShieldCheck } from "lucide-react";
import { fetchUsers } from "@/lib/data";
import { requireUser } from "@/lib/auth";
import { PageHeader } from "@/components/layout/page-header";
import { CreateUserForm } from "@/components/users/create-user-form";
import { UserTable } from "@/components/users/user-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function UsersPage() {
  const currentUser = await requireUser();

  if (currentUser.role !== "admin") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            Akses Terbatas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Hanya admin yang dapat mengelola user. Silakan hubungi administrator Anda.
          </p>
        </CardContent>
      </Card>
    );
  }

  const users = await fetchUsers();

  return (
    <div className="space-y-6">
      <PageHeader title="Manajemen User" description="Kelola akun admin dan staff." />
      <CreateUserForm />
      <UserTable users={users} />
    </div>
  );
}
