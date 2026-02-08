"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";

const thresholdSchema = z.object({
  category: z.string().min(1, { message: "Kategori wajib diisi" }),
  min_stock: z.coerce.number().min(0, { message: "Threshold minimal 0" }),
});

export async function upsertCategoryThreshold(
  _prevState: { error?: string; success?: string } | undefined,
  formData: FormData,
) {
  const user = await requireUser();
  if (user.role !== "admin") {
    throw new Error("Hanya admin yang dapat mengelola threshold");
  }

  const parsed = thresholdSchema.safeParse({
    category: formData.get("category"),
    min_stock: formData.get("min_stock"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }

  const payload = parsed.data;
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("category_thresholds" as any).upsert(
    {
      category: payload.category,
      min_stock: payload.min_stock,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "category" },
  );

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/thresholds");
  revalidatePath("/dashboard");
  revalidatePath("/items");
  return { success: "Threshold berhasil disimpan" };
}

export async function deleteCategoryThreshold(formData: FormData) {
  const user = await requireUser();
  if (user.role !== "admin") {
    throw new Error("Hanya admin yang dapat menghapus threshold");
  }

  const id = formData.get("id");
  if (!id || typeof id !== "string") {
    throw new Error("ID tidak valid");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("category_thresholds" as any)
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/thresholds");
  revalidatePath("/dashboard");
  revalidatePath("/items");
}
