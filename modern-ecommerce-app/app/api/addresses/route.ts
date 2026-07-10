import { NextResponse } from "next/server";
import DatabaseConnection from "@/lib/mongodb/mongodb";
import Address from "@/models/addressType";

export async function GET() {
  await DatabaseConnection();

  const addresses = await Address.find().sort({ createdAt: -1 });

  return NextResponse.json(addresses);
}

export async function POST(request: Request) {
  await DatabaseConnection();

  const body = await request.json();

  const address = await Address.create(body);

  return NextResponse.json(address, { status: 201 });
}