"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login } from "@/lib/actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const [state, formAction] = useActionState(login, undefined);

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold">Masuk</h1>
        <p className="text-sm text-muted-foreground">
          Gunakan email dan password Supabase Anda untuk masuk ke dashboard.
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="admin@contoh.com" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" placeholder="••••••" required />
        </div>
      </div>
      {state?.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}
      <Button type="submit" className="w-full">
        Masuk ke Dashboard
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Akun dibuat melalui panel admin Supabase. Hubungi admin jika lupa password.
      </p>
      <div className="text-center text-xs text-muted-foreground">
        Dokumentasi Supabase Auth tersedia di{" "}
        <Link className="text-primary underline" href="https://supabase.com/docs">
          sini
        </Link>
        .
      </div>
    </form>
  );
}
