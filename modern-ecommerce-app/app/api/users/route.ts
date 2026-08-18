import DatabaseConnection from "@/lib/mongodb/mongodb";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createUserSession, SESSION_COOKIE } from "@/lib/authSession";

export async function POST(req: NextRequest) {
  try {
    await DatabaseConnection();

    const { name, email: rawEmail, password } = await req.json();
    const normalizedEmail = String(rawEmail || "").trim().toLowerCase();
    const normalizedName = String(name || "").trim();

    if (!normalizedName || !normalizedEmail || !password) {
      return NextResponse.json(
        { message: "Please add all fields" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password: hashedPassword,
    });

    const response = NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: newUser._id.toString(),
          name: newUser.name,
          email: newUser.email,
        },
      },
      { status: 201 }
    );

    response.cookies.set(
      SESSION_COOKIE,
      await createUserSession(newUser._id.toString(), newUser.email),
      {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      },
    );

    return response;

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
