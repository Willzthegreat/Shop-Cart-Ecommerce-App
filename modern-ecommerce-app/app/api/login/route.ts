import DatabaseConnection from "@/lib/mongodb/mongodb";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createUserSession, SESSION_COOKIE } from "@/lib/authSession";


export async function POST(req: NextRequest) {

  try {
    await DatabaseConnection();
    const {
      email: rawEmail,
      password,
      accountType: requestedAccountType = "buyer",
    } = await req.json();
    const accountType = requestedAccountType === "seller" ? "seller" : "buyer";
    const email = String(rawEmail || "").trim().toLowerCase();

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

    const escapedEmail = email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const users = await User.find({
      email: new RegExp(`^${escapedEmail}$`, "i"),
    });
    if (users.length === 0) {
      return NextResponse.json(
        {
          message:"User not found"
        },
        {
          status:404
        }
      );
    }


    let user = null;
    for (const candidate of users) {
      let passwordMatch = false;

      try {
        passwordMatch = await bcrypt.compare(password, candidate.password);
      } catch {
        passwordMatch = false;
      }

      if (!passwordMatch && candidate.password === password) {
        passwordMatch = true;
        candidate.password = await bcrypt.hash(password, 10);
        await candidate.save();
      }

      if (passwordMatch) {
        user = candidate;
        break;
      }
    }

    if (!user) {
      return NextResponse.json(
        {
          message:"Invalid password"
        },
        {
          status:401
        }
      );
    }

    // Read the role directly from MongoDB so an older cached Mongoose model
    // cannot silently turn a seller account into a buyer session.
    const storedUser = await User.collection.findOne(
      { _id: user._id },
      { projection: { role: 1 } },
    );
    const storedRole = storedUser?.role;
    const accountRole = ["buyer", "seller", "admin"].includes(storedRole)
      ? storedRole
      : "buyer";

    if (accountType === "seller" && accountRole !== "seller") {
      return NextResponse.json(
        { message: "This email is not registered as a seller account." },
        { status: 403 },
      );
    }

    if (accountType === "buyer" && accountRole !== "buyer") {
      return NextResponse.json(
        { message: "This email is not registered as a buyer account." },
        { status: 403 },
      );
    }

    const response = NextResponse.json(
      {
        message:"Login successful",
        user:{
          id:user._id.toString(),
          name:user.name,
          email:user.email,
          role:accountRole,
        }
      },
      { status: 200 },
    );

    response.cookies.set(SESSION_COOKIE, await createUserSession(
      user._id.toString(),
      user.email,
      accountRole,
    ), {
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
