import { NextResponse } from "next/server";
import { sendLowStockNotifications } from "@/lib/notifications";

export async function POST() {
  const result = await sendLowStockNotifications();
  const status = result.ok ? 200 : 400;
  return NextResponse.json(result, { status });
}
