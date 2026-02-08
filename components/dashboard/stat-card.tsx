"use client";

import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Item, CategoryThreshold } from "@/types";
import { Badge } from "@/components/ui/badge";

type StatCardProps = {
  title: string;
  value: string;
  icon?: ReactNode;
  description?: string;
  className?: string;
  items?: Item[];
  thresholds?: CategoryThreshold[];
};

export function StatCard({
  title,
  value,
  icon,
  description,
  className,
  items,
  thresholds,
}: StatCardProps) {
  const isThresholds = !!thresholds;
  const count = thresholds ? thresholds.length : (items?.length ?? 0);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card
          className={cn(
            "cursor-pointer transition hover:bg-muted/50",
            className,
          )}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {title}
            </CardTitle>
            {icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail: {title}</DialogTitle>
          <DialogDescription>
            Menampilkan {count} data terkait statistik ini.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                {isThresholds ? (
                  <>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Threshold (Minimum Stok)</TableHead>
                    <TableHead>Terakhir Diupdate</TableHead>
                  </>
                ) : (
                  <>
                    <TableHead>ID</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Stok</TableHead>
                    <TableHead>Lokasi</TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {thresholds
                ? thresholds.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium">
                        {t.category}
                      </TableCell>
                      <TableCell>{t.min_stock} unit</TableCell>
                      <TableCell>
                        {new Date(t.updated_at).toLocaleString("id-ID")}
                      </TableCell>
                    </TableRow>
                  ))
                : items
                  ? items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono text-[10px] text-muted-foreground truncate max-w-[80px]">
                          {item.id}
                        </TableCell>
                        <TableCell className="font-medium">
                          {item.name}
                        </TableCell>
                        <TableCell>{item.sku}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{item.category}</Badge>
                        </TableCell>
                        <TableCell>
                          {item.stock} {item.unit}
                        </TableCell>
                        <TableCell>{item.location}</TableCell>
                      </TableRow>
                    ))
                  : null}
              {count === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={isThresholds ? 3 : 6}
                    className="text-center py-10 text-muted-foreground"
                  >
                    Tidak ada data untuk ditampilkan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
