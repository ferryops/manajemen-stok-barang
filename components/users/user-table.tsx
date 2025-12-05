import type { AppUser } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deleteUser, updateUserRole } from "@/lib/actions/users";

export function UserTable({ users }: { users: AppUser[] }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Dibuat</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.email}</TableCell>
              <TableCell>
                <form className="flex items-center gap-2" action={updateUserRole}>
                  <input type="hidden" name="userId" value={user.id} />
                  <select
                    name="role"
                    defaultValue={user.role}
                    className="h-9 rounded-md border border-input bg-background px-2 text-xs"
                  >
                    <option value="admin">Admin</option>
                    <option value="staff">Staff</option>
                  </select>
                  <Button variant="ghost" size="sm" type="submit">
                    Simpan
                  </Button>
                </form>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {new Date(user.created_at).toLocaleDateString("id-ID")}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <form action={deleteUser}>
                  <input type="hidden" name="userId" value={user.id} />
                  <Button variant="ghost" size="sm" type="submit">
                    Hapus
                  </Button>
                </form>
              </TableCell>
            </TableRow>
          ))}
          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                Belum ada user terdaftar.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
