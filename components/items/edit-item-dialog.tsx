"use client";

import { useActionState, useState } from "react";
import { PencilLine } from "lucide-react";
import type { Item } from "@/types";
import { updateItem } from "@/lib/actions/items";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function EditItemDialog({ item }: { item: Item }) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(updateItem, undefined);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" type="button">
          <PencilLine className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {item.name}</DialogTitle>
          <DialogDescription>Perbarui informasi barang.</DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-3">
          <input type="hidden" name="id" value={item.id} />
          <div className="space-y-1.5">
            <Label htmlFor={`name-${item.id}`}>Nama</Label>
            <Input id={`name-${item.id}`} name="name" defaultValue={item.name} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`sku-${item.id}`}>SKU</Label>
            <Input id={`sku-${item.id}`} name="sku" defaultValue={item.sku} required />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor={`category-${item.id}`}>Kategori</Label>
              <Input id={`category-${item.id}`} name="category" defaultValue={item.category} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`stock-${item.id}`}>Stok</Label>
              <Input id={`stock-${item.id}`} name="stock" type="number" min={0} defaultValue={item.stock} required />
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor={`unit-${item.id}`}>Satuan</Label>
              <Input id={`unit-${item.id}`} name="unit" defaultValue={item.unit} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`location-${item.id}`}>Lokasi</Label>
              <Input id={`location-${item.id}`} name="location" defaultValue={item.location} required />
            </div>
          </div>
          {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
          {state?.success && <p className="text-sm text-emerald-600">{state.success}</p>}
          <DialogFooter>
            <Button type="submit">Simpan Perubahan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
