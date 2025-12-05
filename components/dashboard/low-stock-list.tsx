import type { Item } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function LowStockList({ items }: { items: Item[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Barang Hampir Habis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">Semua stok aman 🎉</p>
        )}
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-xs text-muted-foreground">
                SKU {item.sku} • {item.location}
              </p>
            </div>
            <Badge variant="destructive">{item.stock} {item.unit}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
