"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

export function ItemsChart({ data }: { data: Array<{ label: string; total: number }> }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ left: 12, right: 12 }}>
        <defs>
          <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.8} />
            <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{ background: "hsl(var(--card))", borderRadius: 12, border: "1px solid hsl(var(--border))" }}
          formatter={(value: number) => [`${value} unit`, "Total Stok"]}
        />
        <Area type="monotone" dataKey="total" stroke="hsl(var(--chart-3))" fill="url(#colorStock)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
