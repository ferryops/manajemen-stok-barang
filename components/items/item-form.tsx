"use client";

import { useActionState } from "react";
import { createItem } from "@/lib/actions/items";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CategoryThreshold } from "@/types";

export function ItemForm({ categories }: { categories: CategoryThreshold[] }) {
  const [state, formAction] = useActionState(createItem, undefined);

  return (
    <form
      action={formAction}
      className="grid gap-4 rounded-xl border bg-card p-4 md:grid-cols-2"
    >
      <div className="space-y-1.5">
        <Label htmlFor="name">Nama Barang</Label>
        <Input name="name" id="name" placeholder="Contoh: Kertas A4" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="sku">SKU</Label>
        <Input name="sku" id="sku" placeholder="SKU-001" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="category">Kategori</Label>
        <select
          name="category"
          id="category"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          required
        >
          <option value="">Pilih Kategori</option>
          {categories.map((c) => (
            <option key={c.id} value={c.category}>
              {c.category}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="stock">Stok</Label>
        <Input name="stock" id="stock" type="number" min={0} required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="unit">Satuan</Label>
        <Input name="unit" id="unit" placeholder="pcs" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="location">Lokasi</Label>
        <Input
          name="location"
          id="location"
          placeholder="Gudang Utama"
          required
        />
      </div>
      {state?.error && (
        <p className="text-sm text-destructive md:col-span-2" role="alert">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="text-sm text-emerald-600 md:col-span-2">
          {state.success}
        </p>
      )}
      <div className="md:col-span-2">
        <Button type="submit" className="w-full md:w-auto">
          Simpan Barang
        </Button>
      </div>
    </form>
  );
}
