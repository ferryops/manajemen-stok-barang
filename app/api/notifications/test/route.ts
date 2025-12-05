import { NextResponse } from "next/server";
import { sendTestNotification } from "@/lib/notifications";

export async function POST() {
  const result = await sendTestNotification();
  const status = result.ok ? 200 : 400;
  return NextResponse.json(result, { status });
}
