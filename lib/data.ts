import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  AppUser,
  DashboardStats,
  Item,
  TelegramSettings,
  CategoryThreshold,
} from "@/types";

export async function fetchItems(filters?: {
  name?: string;
  sku?: string;
  category?: string;
  stock?: number;
  location?: string;
}) {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("items")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters?.name) {
    query = query.ilike("name", `%${filters.name}%`);
  }
  if (filters?.sku) {
    query = query.ilike("sku", `%${filters.sku}%`);
  }
  if (filters?.category) {
    query = query.ilike("category", `%${filters.category}%`);
  }
  if (filters?.stock !== undefined) {
    query = query.eq("stock", filters.stock);
  }
  if (filters?.location) {
    query = query.ilike("location", `%${filters.location}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Gagal mengambil data barang", error.message);
    return [] as Item[];
  }

  return (data ?? []) as Item[];
}

export async function fetchCategoryThresholds() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("category_thresholds" as any)
    .select("*");

  if (error) {
    console.error("Gagal mengambil data threshold kategori", error.message);
    return [] as CategoryThreshold[];
  }

  return (data ?? []) as unknown as CategoryThreshold[];
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
  const [items, thresholds] = await Promise.all([
    fetchItems(),
    fetchCategoryThresholds(),
  ]);

  const thresholdMap = new Map<string, number>(
    thresholds.map((t) => [t.category, t.min_stock]),
  );

  const lowStockItems = items.filter((item) => {
    const threshold = thresholdMap.get(item.category) ?? 5;
    return item.stock < threshold;
  });

  const trendMap = new Map<string, number>();
  for (const item of items) {
    const key = item.created_at?.slice(0, 10) ?? "Tidak diketahui";
    trendMap.set(key, (trendMap.get(key) ?? 0) + item.stock);
  }

  const lowStockByCategoryMap = new Map<string, number>();
  for (const item of lowStockItems) {
    lowStockByCategoryMap.set(
      item.category,
      (lowStockByCategoryMap.get(item.category) ?? 0) + 1,
    );
  }

  return {
    totalItems: items.length,
    nearlyEmpty: lowStockItems.length,
    categories: new Set(items.map((item) => item.category)).size,
    lowStockItems,
    allItems: items,
    categoryThresholds: thresholds,
    itemsTrend: Array.from(trendMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([label, total]) => ({ label, total })),
    lowStockByCategory: Array.from(lowStockByCategoryMap.entries()).map(
      ([category, total]) => ({ category, total }),
    ),
  } satisfies DashboardStats;
}
