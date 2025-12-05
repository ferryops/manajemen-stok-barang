"use client";

import { useActionState, useState } from "react";
import type { TelegramSettings } from "@/types";
import { saveSettings } from "@/lib/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function SettingsForm({ settings }: { settings: TelegramSettings | null }) {
  const [state, formAction] = useActionState(saveSettings, undefined);
  const [enabled, setEnabled] = useState(settings?.notifications_enabled ?? true);

  return (
    <form action={formAction} className="space-y-6 rounded-xl border bg-card p-6">
      {settings?.id && <input type="hidden" name="id" value={settings.id} />}
      <div className="space-y-1.5">
        <Label htmlFor="telegram_bot_token">Telegram Bot Token</Label>
        <Input
          id="telegram_bot_token"
          name="telegram_bot_token"
          defaultValue={settings?.telegram_bot_token ?? ""}
          placeholder="123456:ABCDEFG"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="telegram_chat_id">Telegram Chat ID</Label>
        <Input
          id="telegram_chat_id"
          name="telegram_chat_id"
          defaultValue={settings?.telegram_chat_id ?? ""}
          placeholder="-100123456"
        />
      </div>
      <div className="flex items-center justify-between rounded-lg border bg-muted/40 p-4">
        <div>
          <p className="font-medium">Aktifkan Notifikasi</p>
          <p className="text-sm text-muted-foreground">
            Notifikasi akan dikirim otomatis ketika stok barang kurang dari 5.
          </p>
        </div>
        <input type="hidden" name="notifications_enabled" value={String(enabled)} />
        <Switch checked={enabled} onCheckedChange={setEnabled} />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state?.success && <p className="text-sm text-emerald-600">{state.success}</p>}
      <Button type="submit">Simpan Pengaturan</Button>
    </form>
  );
}
