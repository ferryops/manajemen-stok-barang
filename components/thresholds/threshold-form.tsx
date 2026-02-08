"use client";

import { useActionState } from "react";
import { upsertCategoryThreshold } from "@/lib/actions/thresholds";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ThresholdForm() {
  const [state, formAction] = useActionState(
    upsertCategoryThreshold,
    undefined,
  );

  return (
    <form
      action={formAction}
      className="grid gap-4 rounded-xl border bg-card p-4 md:grid-cols-3"
    >
      <div className="space-y-1.5">
        <Label htmlFor="category">Nama Kategori</Label>
        <Input
          name="category"
          id="category"
          placeholder="Contoh: ATK"
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="min_stock">Minimal Stok (Limit Alert)</Label>
        <Input
          name="min_stock"
          id="min_stock"
          type="number"
          min={0}
          placeholder="5"
          required
        />
      </div>
      <div className="flex items-end">
        <Button type="submit" className="w-full">
          Simpan Threshold
        </Button>
      </div>
      {state?.error && (
        <p className="text-sm text-destructive md:col-span-3" role="alert">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="text-sm text-emerald-600 md:col-span-3">
          {state.success}
        </p>
      )}
    </form>
  );
}
