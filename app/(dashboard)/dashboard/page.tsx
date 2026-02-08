import { PackageOpen, AlertTriangle, Layers } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { ItemsChart } from "@/components/dashboard/items-chart";
import { LowStockChart } from "@/components/dashboard/low-stock-chart";
import { LowStockList } from "@/components/dashboard/low-stock-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchDashboardStats } from "@/lib/data";

export default async function DashboardPage() {
  const stats = await fetchDashboardStats();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Barang"
        description="Pantau stok dan barang menipis secara real-time."
      />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total Barang"
          value={String(stats.totalItems)}
          description="Semua item terdaftar"
          icon={<PackageOpen className="h-4 w-4 text-muted-foreground" />}
          items={stats.allItems}
        />
        <StatCard
          title="Stok Menipis"
          value={String(stats.nearlyEmpty)}
          description="Berdasarkan limit kategori"
          icon={<AlertTriangle className="h-4 w-4 text-muted-foreground" />}
          items={stats.lowStockItems}
        />
        <StatCard
          title="Kategori"
          value={String(stats.categories)}
          description="Distribusi item"
          icon={<Layers className="h-4 w-4 text-muted-foreground" />}
          thresholds={stats.categoryThresholds}
        />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Grafik Jumlah Barang</CardTitle>
          </CardHeader>
          <CardContent>
            <ItemsChart data={stats.itemsTrend} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Kategori Stok Menipis</CardTitle>
          </CardHeader>
          <CardContent>
            <LowStockChart data={stats.lowStockByCategory} />
          </CardContent>
        </Card>
      </div>
      <LowStockList items={stats.lowStockItems} />
    </div>
  );
}
