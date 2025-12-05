"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function TestNotificationButton() {
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    setStatus(null);
    try {
      const response = await fetch("/api/notifications/test", { method: "POST" });
      const data = await response.json();
      setStatus(data.message ?? (response.ok ? "Notifikasi berhasil" : "Gagal mengirim"));
    } catch {
      setStatus("Gagal terhubung ke server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2 rounded-xl border bg-card p-6">
      <div>
        <p className="font-semibold">Test Notification</p>
        <p className="text-sm text-muted-foreground">
          Kirim pesan uji ke Telegram untuk memastikan kredensial benar.
        </p>
      </div>
      <Button type="button" onClick={handleClick} disabled={isLoading}>
        {isLoading ? "Mengirim..." : "Kirim Pesan Uji"}
      </Button>
      {status && <p className="text-sm text-muted-foreground">{status}</p>}
    </div>
  );
}
