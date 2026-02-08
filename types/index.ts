export type UserRole = "admin" | "staff";

export type AppUser = {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
};

export type Item = {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  unit: string;
  location: string;
  created_at: string;
  updated_at: string;
};

export type TelegramSettings = {
  id: string;
  telegram_bot_token: string | null;
  telegram_chat_id: string | null;
  notifications_enabled: boolean;
  created_at: string;
  updated_at: string;
};

export type DashboardStats = {
  totalItems: number;
  nearlyEmpty: number;
  categories: number;
  lowStockItems: Item[];
  allItems: Item[];
  categoryThresholds: CategoryThreshold[];
  itemsTrend: Array<{ label: string; total: number }>;
  lowStockByCategory: Array<{ category: string; total: number }>;
};

export type CategoryThreshold = {
  id: string;
  category: string;
  min_stock: number;
  created_at: string;
  updated_at: string;
};
