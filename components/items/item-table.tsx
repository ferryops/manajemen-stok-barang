import type { Item } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EditItemDialog } from "@/components/items/edit-item-dialog";
import { deleteItem } from "@/lib/actions/items";

export function ItemTable({ items }: { items: Item[] }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Barang</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Stok</TableHead>
            <TableHead>Lokasi</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} className={item.stock < 5 ? "bg-destructive/5" : undefined}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.sku}</TableCell>
              <TableCell>
                <Badge variant="secondary">{item.category}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span>
                    {item.stock} {item.unit}
                  </span>
                  {item.stock < 5 && <Badge variant="destructive">Menipis</Badge>}
                </div>
              </TableCell>
              <TableCell>{item.location}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <EditItemDialog item={item} />
                  <form action={deleteItem}>
                    <input type="hidden" name="id" value={item.id} />
                    <Button variant="ghost" size="sm" type="submit">
                      Hapus
                    </Button>
                  </form>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {items.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                Belum ada data barang.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
