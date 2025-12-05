import { Ban } from "lucide-react";
import { fetchSettings } from "@/lib/data";
import { requireUser } from "@/lib/auth";
import { PageHeader } from "@/components/layout/page-header";
import { SettingsForm } from "@/components/settings/settings-form";
import { TestNotificationButton } from "@/components/settings/test-notification-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SettingsPage() {
  const user = await requireUser();

  if (user.role !== "admin") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ban className="h-4 w-4" />
            Akses Terbatas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Pengaturan hanya dapat diedit oleh admin utama.
          </p>
        </CardContent>
      </Card>
    );
  }

  const settings = await fetchSettings();

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Atur kredensial notifikasi Telegram." />
      <div className="grid gap-6 lg:grid-cols-2">
        <SettingsForm settings={settings} />
        <TestNotificationButton />
      </div>
    </div>
  );
}
