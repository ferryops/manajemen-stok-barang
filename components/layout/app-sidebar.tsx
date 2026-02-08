"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PackageOpen,
  Settings,
  Users2,
  ShieldAlert,
} from "lucide-react";
import type { AppUser } from "@/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "staff"] as const,
  },
  {
    label: "Barang",
    href: "/items",
    icon: PackageOpen,
    roles: ["admin", "staff"] as const,
  },
  {
    label: "Threshold Stok",
    href: "/thresholds",
    icon: ShieldAlert,
    roles: ["admin"] as const,
  },
  {
    label: "Pengguna",
    href: "/users",
    icon: Users2,
    roles: ["admin"] as const,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    roles: ["admin", "staff"] as const,
  },
];

export function AppSidebar({ user }: { user: AppUser }) {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-64 flex-col border-r bg-card p-4 md:flex">
      <div className="flex items-center gap-2 text-lg font-semibold">
        <PackageOpen className="h-5 w-5" />
        Sistem Stok
      </div>
      <nav className="mt-8 flex flex-col gap-1 text-sm">
        {NAV_ITEMS.filter((item) =>
          (item.roles as readonly string[]).includes(user.role),
        ).map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground transition hover:text-foreground",
                active && "bg-muted text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-lg border bg-muted/30 p-4 text-xs text-muted-foreground">
        <p className="font-medium text-foreground">{user.email}</p>
        <Badge variant="outline" className="mt-2 capitalize">
          {user.role}
        </Badge>
        <p className="mt-2">
          Aktif sejak {new Date(user.created_at).toLocaleDateString("id-ID")}
        </p>
      </div>
    </aside>
  );
}
