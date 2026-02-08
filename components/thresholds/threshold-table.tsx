"use client";

import type { CategoryThreshold } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  deleteCategoryThreshold,
  upsertCategoryThreshold,
} from "@/lib/actions/thresholds";
import { Trash2, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useState, useEffect } from "react";

function EditThresholdDialog({ threshold }: { threshold: CategoryThreshold }) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(
    upsertCategoryThreshold,
    undefined,
  );

  useEffect(() => {
    if (state?.success) {
      setOpen(false);
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Threshold {threshold.category}</DialogTitle>
          <DialogDescription>
            Ubah batas minimal stok untuk kategori ini.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="category" value={threshold.category} />
          <div className="space-y-1.5">
            <Label htmlFor={`min_stock-${threshold.id}`}>
              Minimal Stok (Limit Alert)
            </Label>
            <Input
              id={`min_stock-${threshold.id}`}
              name="min_stock"
              type="number"
              min={0}
              defaultValue={threshold.min_stock}
              required
            />
          </div>
          {state?.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}
          <DialogFooter>
            <Button type="submit">Simpan Perubahan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function ThresholdTable({
  thresholds,
}: {
  thresholds: CategoryThreshold[];
}) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Kategori</TableHead>
            <TableHead>Minimal Stok (Limit)</TableHead>
            <TableHead>Terakhir Diupdate</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {thresholds.map((t) => (
            <TableRow key={t.id}>
              <TableCell className="font-medium">{t.category}</TableCell>
              <TableCell>{t.min_stock} unit</TableCell>
              <TableCell>
                {new Date(t.updated_at).toLocaleString("id-ID")}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <EditThresholdDialog threshold={t} />
                  <form
                    action={deleteCategoryThreshold}
                    onSubmit={(e) => {
                      if (
                        !confirm(
                          `Hapus threshold untuk kategori "${t.category}"?`,
                        )
                      ) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <input type="hidden" name="id" value={t.id} />
                    <Button
                      variant="ghost"
                      size="sm"
                      type="submit"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {thresholds.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center text-sm text-muted-foreground py-10"
              >
                Belum ada threshold kategori yang diatur.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
