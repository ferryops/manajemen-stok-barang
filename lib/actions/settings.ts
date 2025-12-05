"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { assertAdmin, requireUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const settingsSchema = z.object({
  id: z.string().uuid().optional(),
  telegram_bot_token: z
    .string()
    .optional()
    .transform((value) => (value ? String(value) : "")),
  telegram_chat_id: z
    .string()
    .optional()
    .transform((value) => (value ? String(value) : "")),
  notifications_enabled: z.string().transform((value) => value === "true"),
});

export async function saveSettings(
  _prevState: { error?: string; success?: string } | undefined,
  formData: FormData
) {
  const user = await requireUser();
  assertAdmin(user);

  const parsed = settingsSchema.safeParse({
    id: formData.get("id"),
    telegram_bot_token: formData.get("telegram_bot_token"),
    telegram_chat_id: formData.get("telegram_chat_id"),
    notifications_enabled:
      formData.get("notifications_enabled")?.toString() ?? "false",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }

  const supabase = await createSupabaseServerClient();
  const now = new Date().toISOString();
  const payload = {
    id: parsed.data.id ?? randomUUID(),
    telegram_bot_token: parsed.data.telegram_bot_token || null,
    telegram_chat_id: parsed.data.telegram_chat_id || null,
    notifications_enabled: parsed.data.notifications_enabled,
    updated_at: now,
    created_at: parsed.data.id ? undefined : now,
  };

  const { error } = await supabase.from("settings").upsert(payload);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/settings");
  return { success: "Pengaturan tersimpan" };
}
