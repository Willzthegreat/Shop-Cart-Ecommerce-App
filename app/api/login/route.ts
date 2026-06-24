import DatabaseConnection from "@/lib/mongodb/mongodb.js";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";


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

    return NextResponse.json(
      {
        message:"Login successful",
        user:{
          id:user._id,
          name:user.name,
          email:user.email
        }
      },
      {
        status:200
      }
    );

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