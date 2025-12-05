"use client";

import { useActionState } from "react";
import { createUser } from "@/lib/actions/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CreateUserForm() {
  const [state, formAction] = useActionState(createUser, undefined);

  return (
    <form action={formAction} className="grid gap-4 rounded-xl border bg-card p-4 md:grid-cols-2">
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="staff@contoh.com" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" placeholder="Minimal 6 karakter" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="role">Role</Label>
        <select
          id="role"
          name="role"
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          defaultValue="staff"
        >
          <option value="admin">Admin</option>
          <option value="staff">Staff</option>
        </select>
      </div>
      <div className="flex items-end">
        <Button type="submit">Tambah User</Button>
      </div>
      {state?.error && (
        <p className="text-sm text-destructive md:col-span-2">{state.error}</p>
      )}
      {state?.success && (
        <p className="text-sm text-emerald-600 md:col-span-2">{state.success}</p>
      )}
    </form>
  );
}
