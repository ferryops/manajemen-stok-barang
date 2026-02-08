import { fetchItems, fetchCategoryThresholds } from "@/lib/data";
import { PageHeader } from "@/components/layout/page-header";
import { ItemForm } from "@/components/items/item-form";
import { ItemTable } from "@/components/items/item-table";
import { ItemFilter } from "@/components/items/item-filter";

export default async function ItemsPage({
  searchParams,
}: {
  searchParams: Promise<{
    name?: string;
    sku?: string;
    category?: string;
    stock?: string;
    location?: string;
  }>;
}) {
  const params = await searchParams;
  const [items, categories] = await Promise.all([
    fetchItems({
      name: params.name,
      sku: params.sku,
      category: params.category,
      stock: params.stock ? parseInt(params.stock) : undefined,
      location: params.location,
    }),
    fetchCategoryThresholds(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manajemen Barang"
        description="Tambah, ubah, atau hapus data barang Anda."
      />
      <ItemForm categories={categories} />
      <ItemFilter categories={categories} />
      <ItemTable items={items} categories={categories} />
    </div>
  );
}
