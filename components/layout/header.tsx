import type { AppUser } from "@/types";
import { LogoutButton } from "@/components/auth/logout-button";

function UserAvatar({ email }: { email: string }) {
  const initials = email.slice(0, 2).toUpperCase();
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
      {initials}
    </div>
  );
}

export function Header({ user }: { user: AppUser }) {
  return (
    <header className="flex min-h-16 items-center justify-between border-b bg-background px-6">
      <div>
        <p className="text-sm text-muted-foreground">Selamat datang kembali,</p>
        <p className="font-semibold text-foreground">{user.email}</p>
      </div>
      <div className="flex items-center gap-3">
        <UserAvatar email={user.email} />
        <LogoutButton />
      </div>
    </header>
  );
}
