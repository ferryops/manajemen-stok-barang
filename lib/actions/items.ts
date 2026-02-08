"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import { sendLowStockNotifications } from "@/lib/notifications";
import { fetchCategoryThresholds } from "@/lib/data";

const itemSchema = z.object({
  name: z.string().min(1, { message: "Nama wajib diisi" }),
  sku: z.string().min(1, { message: "SKU wajib diisi" }),
  category: z.string().min(1, { message: "Kategori wajib diisi" }),
  stock: z.coerce.number().min(0, { message: "Stok minimal 0" }),
  unit: z.string().min(1, { message: "Satuan wajib diisi" }),
  location: z.string().min(1, { message: "Lokasi wajib diisi" }),
});

const updateSchema = itemSchema.extend({
  id: z.string().uuid(),
});

export async function createItem(
  _prevState: { error?: string; success?: string } | undefined,
  formData: FormData,
) {
  await requireUser();
  const parsed = itemSchema.safeParse({
    name: formData.get("name"),
    sku: formData.get("sku"),
    category: formData.get("category"),
    stock: formData.get("stock"),
    unit: formData.get("unit"),
    location: formData.get("location"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }

  const payload = parsed.data;
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("items").insert({
    ...payload,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  if (error) {
    return { error: error.message };
  }

  const thresholds = await fetchCategoryThresholds();
  const threshold =
    thresholds.find((t) => t.category === payload.category)?.min_stock ?? 5;

  if (payload.stock < threshold) {
    await sendLowStockNotifications();
  }

  revalidatePath("/items");
  revalidatePath("/dashboard");
  return { success: "Barang berhasil ditambahkan" };
}

export async function updateItem(
  _prevState: { error?: string; success?: string } | undefined,
  formData: FormData,
) {
  await requireUser();
  const parsed = updateSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    sku: formData.get("sku"),
    category: formData.get("category"),
    stock: formData.get("stock"),
    unit: formData.get("unit"),
    location: formData.get("location"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }

  const payload = parsed.data;
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("items")
    .update({
      name: payload.name,
      sku: payload.sku,
      category: payload.category,
      stock: payload.stock,
      unit: payload.unit,
      location: payload.location,
      updated_at: new Date().toISOString(),
    })
    .eq("id", payload.id);

  if (error) {
    return { error: error.message };
  }

  const thresholds = await fetchCategoryThresholds();
  const threshold =
    thresholds.find((t) => t.category === payload.category)?.min_stock ?? 5;

  if (payload.stock < threshold) {
    await sendLowStockNotifications();
  }

  revalidatePath("/items");
  revalidatePath("/dashboard");
  return { success: "Barang berhasil diperbarui" };
}

export async function deleteItem(formData: FormData) {
  const user = await requireUser();
  if (user.role !== "admin") {
    throw new Error("Hanya admin yang dapat menghapus barang");
  }

  const id = formData.get("id");
  if (!id || typeof id !== "string") {
    throw new Error("ID tidak valid");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("items").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/items");
  revalidatePath("/dashboard");
}
