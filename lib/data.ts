import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AppUser, DashboardStats, Item, TelegramSettings } from "@/types";

export async function fetchItems() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Gagal mengambil data barang", error.message);
    return [] as Item[];
  }

  return (data ?? []) as Item[];
}

export async function fetchUsers() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("users")
    .select("id, email, role, created_at")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Gagal mengambil data user", error.message);
    return [] as AppUser[];
  }

  return (data ?? []) as AppUser[];
}

export async function fetchSettings() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("settings")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) {
    return null;
  }

  return data as TelegramSettings;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const items = await fetchItems();
  const lowStockItems = items.filter((item) => item.stock < 5);

  const trendMap = new Map<string, number>();
  for (const item of items) {
    const key = item.created_at?.slice(0, 10) ?? "Tidak diketahui";
    trendMap.set(key, (trendMap.get(key) ?? 0) + item.stock);
  }

  const lowStockByCategoryMap = new Map<string, number>();
  for (const item of lowStockItems) {
    lowStockByCategoryMap.set(
      item.category,
      (lowStockByCategoryMap.get(item.category) ?? 0) + 1
    );
  }

  return {
    totalItems: items.length,
    nearlyEmpty: lowStockItems.length,
    categories: new Set(items.map((item) => item.category)).size,
    lowStockItems,
    itemsTrend: Array.from(trendMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([label, total]) => ({ label, total })),
    lowStockByCategory: Array.from(lowStockByCategoryMap.entries()).map(
      ([category, total]) => ({ category, total })
    ),
  } satisfies DashboardStats;
}
