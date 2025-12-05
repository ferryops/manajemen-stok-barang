"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

export function LowStockChart({ data }: { data: Array<{ category: string; total: number }> }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ left: 12, right: 12 }}>
        <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{ background: "hsl(var(--card))", borderRadius: 12, border: "1px solid hsl(var(--border))" }}
          formatter={(value: number) => [`${value} barang`, "Barang menipis"]}
        />
        <Bar dataKey="total" fill="hsl(var(--chart-5))" radius={6} />
      </BarChart>
    </ResponsiveContainer>
  );
}
