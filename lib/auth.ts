import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AppUser } from "@/types";

export async function getCurrentUser(): Promise<AppUser | null> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("users")
    .select("id, email, role, created_at")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return null;
  }

  return profile as AppUser;
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export function assertAdmin(user: AppUser) {
  if (user.role !== "admin") {
    throw new Error("Hanya admin yang diperbolehkan melakukan aksi ini.");
  }
}
