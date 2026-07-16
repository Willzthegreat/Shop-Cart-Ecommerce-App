import { NextResponse } from "next/server";

import { seedProducts } from "@/lib/seedProducts";

export async function POST() {
  try {
    const result = await seedProducts();

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Seed failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
