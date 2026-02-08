import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";
import { env } from "@/lib/env";
import { sendTelegramMessage } from "@/lib/telegram";
import type { Item, TelegramSettings } from "@/types";

export async function getTelegramSettings() {
  const serviceClient = createSupabaseServiceRoleClient();

  if (!serviceClient) {
    return null;
  }

  const { data } = await serviceClient
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

function buildNotificationMessage(items: Item[]) {
  const lines = [
    "⚠️ *Stok Barang Menipis*",
    "Barang berikut berada di bawah ambang stok 5:",
    ...items.map(
      (item) =>
        `• ${item.name} (${item.sku}) — stok ${item.stock} ${item.unit}`,
    ),
  ];

  return lines.join("\n");
}

export async function sendLowStockNotifications() {
  const serviceClient = createSupabaseServiceRoleClient();

  if (!serviceClient) {
    return {
      ok: false,
      message: "Service role Supabase belum diatur",
    } as const;
  }

  const [settingsResult, itemsResult, thresholdsResult] = await Promise.all([
    getTelegramSettings(),
    serviceClient.from("items").select("*"),
    serviceClient.from("category_thresholds").select("*"),
  ]);

  const items = (itemsResult.data ?? []) as Item[];
  const thresholds = (thresholdsResult.data ?? []) as any[]; // Use any or CategoryThreshold

  const thresholdMap = new Map<string, number>(
    thresholds.map((t) => [t.category, t.min_stock]),
  );

  const lowStockItems = items.filter((item) => {
    const threshold = thresholdMap.get(item.category) ?? 5;
    return item.stock < threshold;
  });

  if (!lowStockItems.length) {
    return { ok: true, message: "Tidak ada stok menipis" } as const;
  }

  const token = settingsResult?.telegram_bot_token || env.telegramBotToken;
  const chatId = settingsResult?.telegram_chat_id || env.telegramChatId;
  const enabled = settingsResult?.notifications_enabled ?? true;

  if (!enabled) {
    return { ok: false, message: "Notifikasi dinonaktifkan" } as const;
  }

  if (!token || !chatId) {
    return {
      ok: false,
      message: "Token/Chat ID Telegram belum tersedia",
    } as const;
  }

  const buildCategoryNotificationMessage = (items: Item[]) => {
    const lines = [
      "⚠️ *Stok Barang Menipis*",
      "Barang berikut berada di bawah ambang stok kategori:",
      ...items.map((item) => {
        const threshold = thresholdMap.get(item.category) ?? 5;
        return `• ${item.name} (${item.sku}) — stok ${item.stock} ${item.unit} (Limit: ${threshold})`;
      }),
    ];
    return lines.join("\n");
  };

  await sendTelegramMessage({
    botToken: token,
    chatId,
    text: buildCategoryNotificationMessage(lowStockItems),
  });

  return { ok: true, message: "Notifikasi terkirim" } as const;
}

export async function sendTestNotification() {
  const serviceClient = createSupabaseServiceRoleClient();

  if (!serviceClient) {
    return {
      ok: false,
      message: "Service role Supabase belum diatur",
    } as const;
  }

  const settings = await getTelegramSettings();
  console.log(settings);
  const token = settings?.telegram_bot_token || env.telegramBotToken;
  const chatId = settings?.telegram_chat_id || env.telegramChatId;
  const enabled = settings?.notifications_enabled ?? true;

  if (!enabled) {
    return {
      ok: false,
      message: "Aktifkan notifikasi terlebih dahulu",
    } as const;
  }

  if (!token || !chatId) {
    return { ok: false, message: "Token/Chat ID Telegram kosong" } as const;
  }

  await sendTelegramMessage({
    botToken: token,
    chatId,
    text: "Pesan uji dari Sistem Manajemen Stok ✅",
  });

  return { ok: true, message: "Pesan uji berhasil dikirim" } as const;
}
