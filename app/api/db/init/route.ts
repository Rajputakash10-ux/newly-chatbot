import { NextResponse } from "next/server";
import { initDB } from "@/lib/db/client";

export async function GET() {
  try {
    await initDB();
    return NextResponse.json({ success: true, message: "Database initialized" });
  } catch (error: any) {
    console.error("DB init error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
