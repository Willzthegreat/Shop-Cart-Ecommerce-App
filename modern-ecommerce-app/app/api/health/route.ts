import { NextResponse } from "next/server";
import mongoose from "mongoose";
import DatabaseConnection from "@/lib/mongodb/mongodb";

export const runtime = "nodejs";

export async function GET() {
  try {
    await DatabaseConnection();

    return NextResponse.json({
      ok: mongoose.connection.readyState === 1,
      database: mongoose.connection.name || "unknown",
    });
  } catch (error) {
    console.error("Database health check failed:", error);
    return NextResponse.json(
      { ok: false, error: "MongoDB connection failed." },
      { status: 503 },
    );
  }
}
