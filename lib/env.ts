const missingValue = (key: string) =>
  new Error(`Variabel lingkungan ${key} belum di-set. Periksa file .env.`);

export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN ?? "",
  telegramChatId: process.env.TELEGRAM_CHAT_ID ?? "",
};

export function assertSupabaseEnv() {
  if (!env.supabaseUrl) throw missingValue("NEXT_PUBLIC_SUPABASE_URL");
  if (!env.supabaseAnonKey) throw missingValue("NEXT_PUBLIC_SUPABASE_ANON_KEY");
}
