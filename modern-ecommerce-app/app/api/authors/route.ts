import { NextResponse } from "next/server";
import DatabaseConnection from "@/lib/mongodb/mongodb";
import Author from "@/models/authorType";

export async function GET() {
  await DatabaseConnection();

  const authors = await Author.find().sort({ createdAt: -1 });

  return NextResponse.json(authors);
}

export async function POST(request: Request) {
  await DatabaseConnection();

  const body = await request.json();

  const author = await Author.create(body);

  return NextResponse.json(author, { status: 201 });
}