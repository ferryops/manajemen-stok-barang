import { fetchCategoryThresholds } from "@/lib/data";
import { PageHeader } from "@/components/layout/page-header";
import { ThresholdForm } from "@/components/thresholds/threshold-form";
import { ThresholdTable } from "@/components/thresholds/threshold-table";
import { requireUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ThresholdsPage() {
  const user = await requireUser();

  if (user.role !== "admin") {
    redirect("/dashboard");
  }

  const thresholds = await fetchCategoryThresholds();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Master Threshold Stok"
        description="Atur batas minimal stok untuk tiap kategori agar notifikasi alert lebih akurat."
      />
      <ThresholdForm />
      <ThresholdTable thresholds={thresholds} />
    </div>
  );
}
