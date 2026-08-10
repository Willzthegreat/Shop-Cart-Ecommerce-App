import DatabaseConnection from "@/lib/mongodb/mongodb";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createUserSession, SESSION_COOKIE } from "@/lib/authSession";


export async function POST(req: NextRequest) {

  try {
    await DatabaseConnection();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        {
          message: "Please enter email and password"
        },
        {
          status:400
        }
      );
    }

    const user = await User.findOne({
      email
    });
    if (!user) {
      return NextResponse.json(
        {
          message:"User not found"
        },
        {
          status:404
        }
      );
    }


    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return NextResponse.json(
        {
          message:"Invalid password"
        },
        {
          status:401
        }
      );
    }

    const response = NextResponse.json(
      {
        message:"Login successful",
        user:{
          id:user._id,
          name:user.name,
          email:user.email
        }
      },
      { status: 200 },
    );

    response.cookies.set(SESSION_COOKIE, await createUserSession(user._id.toString(), user.email), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;

  } catch(error){
    console.log(error);
    return NextResponse.json(
      {
        message:"Server error"
      },
      {
        status:500
      }
    );
  }
}
