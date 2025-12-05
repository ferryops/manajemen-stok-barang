"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { logout } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => startTransition(() => logout())}
      disabled={isPending}
      className="gap-2"
    >
      <LogOut className="h-4 w-4" />
      {isPending ? "Keluar..." : "Keluar"}
    </Button>
  );
}
