"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";
import type { CategoryThreshold } from "@/types";

export function ItemFilter({
  categories,
}: {
  categories: CategoryThreshold[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [name, setName] = useState(searchParams.get("name") || "");
  const [sku, setSku] = useState(searchParams.get("sku") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [stock, setStock] = useState(searchParams.get("stock") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");

  const debouncedName = useDebounce(name, 500);
  const debouncedSku = useDebounce(sku, 500);
  const debouncedCategory = useDebounce(category, 500);
  const debouncedStock = useDebounce(stock, 500);
  const debouncedLocation = useDebounce(location, 500);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const filters = {
      name: debouncedName,
      sku: debouncedSku,
      category: debouncedCategory,
      stock: debouncedStock,
      location: debouncedLocation,
    };

    let hasChanged = false;
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        if (params.get(key) !== value) {
          params.set(key, value);
          hasChanged = true;
        }
      } else {
        if (params.has(key)) {
          params.delete(key);
          hasChanged = true;
        }
      }
    });

    if (hasChanged) {
      router.push(`?${params.toString()}`, { scroll: false });
    }
  }, [
    debouncedName,
    debouncedSku,
    debouncedCategory,
    debouncedStock,
    debouncedLocation,
    router,
    searchParams,
  ]);

  const handleReset = () => {
    setName("");
    setSku("");
    setCategory("");
    setStock("");
    setLocation("");
    router.push("?", { scroll: false });
  };

  return (
    <div className="grid gap-4 rounded-xl border bg-card p-4 md:grid-cols-3 lg:grid-cols-5">
      <div className="space-y-1.5">
        <Label htmlFor="filter-name">Nama Barang</Label>
        <Input
          id="filter-name"
          placeholder="Cari nama..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="filter-sku">SKU</Label>
        <Input
          id="filter-sku"
          placeholder="Cari SKU..."
          value={sku}
          onChange={(e) => setSku(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="filter-category">Kategori</Label>
        <select
          id="filter-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Semua Kategori</option>
          {categories.map((c) => (
            <option key={c.id} value={c.category}>
              {c.category}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="filter-stock">Jumlah Stok</Label>
        <Input
          id="filter-stock"
          type="number"
          placeholder="Stok tepat..."
          value={stock}
          // prevent select under 0
          onChange={(e) => {
            const value = e.target.value;
            if (Number(value) < 0) {
              return;
            }
            setStock(value);
          }}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="filter-location">Lokasi</Label>
        <div className="flex gap-2">
          <Input
            id="filter-location"
            placeholder="Cari lokasi..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
