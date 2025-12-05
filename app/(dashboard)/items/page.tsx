import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { fetchItems } from "@/lib/data";
import { PageHeader } from "@/components/layout/page-header";
import { ItemForm } from "@/components/items/item-form";
import { ItemTable } from "@/components/items/item-table";
import { Button } from "@/components/ui/button";

export default async function ItemsPage() {
  const items = await fetchItems();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manajemen Barang"
        description="Tambah, ubah, atau hapus data barang Anda."
        actions={
          <Button variant="outline" size="sm" className="gap-2" asChild>
            <Link href="/schema.sql" target="_blank" rel="noreferrer">
              <PlusCircle className="h-4 w-4" />
              Skema Database
            </Link>
          </Button>
        }
      />
      <ItemForm />
      <ItemTable items={items} />
    </div>
  );
}
