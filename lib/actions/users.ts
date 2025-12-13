"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { assertAdmin, requireUser } from "@/lib/auth";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";

const createUserSchema = z.object({
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(6, { message: "Minimal 6 karakter" }),
  role: z.enum(["admin", "staff"]),
});

const updateUserSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(["admin", "staff"]),
});

export async function createUser(
  _prevState: { error?: string; success?: string } | undefined,
  formData: FormData,
) {
  const currentUser = await requireUser();
  assertAdmin(currentUser);

  const parsed = createUserSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }

  const serviceClient = await createSupabaseServiceRoleClient();
  if (!serviceClient) {
    return { error: "SUPABASE_SERVICE_ROLE_KEY belum diatur" };
  }

  const { data, error } = await serviceClient.auth.admin.createUser({
    email: parsed.data.email,
    password: parsed.data.password,
    email_confirm: true,
  });

  if (error || !data.user) {
    return { error: error?.message ?? "Gagal membuat user" };
  }

  const { error: profileError } = await serviceClient.from("users").upsert({
    id: data.user.id,
    email: parsed.data.email,
    role: parsed.data.role,
    created_at: new Date().toISOString(),
  });

  if (profileError) {
    return { error: profileError.message };
  }

  revalidatePath("/users");
  return { success: "User berhasil dibuat" };
}

export async function updateUserRole(formData: FormData) {
  const currentUser = await requireUser();
  assertAdmin(currentUser);

  const parsed = updateUserSchema.safeParse({
    userId: formData.get("userId"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message);
  }

  const serviceClient = createSupabaseServiceRoleClient();
  if (!serviceClient) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY belum diatur");
  }

  const { error } = await serviceClient
    .from("users")
    .update({ role: parsed.data.role })
    .eq("id", parsed.data.userId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/users");
}

export async function deleteUser(formData: FormData) {
  const currentUser = await requireUser();
  assertAdmin(currentUser);

  const userId = formData.get("userId");
  if (!userId || typeof userId !== "string") {
    throw new Error("ID user tidak valid");
  }

  if (currentUser.id === userId) {
    throw new Error("Tidak dapat menghapus akun sendiri");
  }

  const serviceClient = createSupabaseServiceRoleClient();
  if (!serviceClient) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY belum diatur");
  }

  const { error } = await serviceClient.auth.admin.deleteUser(userId);

  if (error) {
    throw new Error(error.message);
  }

  await serviceClient.from("users").delete().eq("id", userId);
  revalidatePath("/users");
}
