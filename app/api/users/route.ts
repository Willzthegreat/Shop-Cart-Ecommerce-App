// import DatabaseConnection from "@/lib/mongodb";
// import User from "../../../../backend/models/userModel.js";
// import { NextRequest, NextResponse } from "next/server";
// import bcrypt from "bcryptjs";


// export async function POST(req: NextRequest) {
//   try {
//     await DatabaseConnection();

//     const { name, email, password } = await req.json();


//     if (!name || !email || !password) {
//       return NextResponse.json(
//         { message: "Please add all fields" },
//         { status: 400 }
//       );
//     }


//     const existingUser = await User.findOne({ email });

//     if (existingUser) {
//       return NextResponse.json(
//         { message: "User already exists" },
//         { status: 400 }
//       );
//     }


//     const hashedPassword = await bcrypt.hash(password, 10);


//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword,
//     });


//     await newUser.save();


//     return NextResponse.json(
//       {
//         message: "User created successfully",
//         user: newUser,
//       },
//       { status: 201 }
//     );


//   } catch (error: unknown) {

//     console.log(error);

//     return NextResponse.json(
//       {
//         message: "Server error",
//         error: error instanceof Error ? error.message : "Unknown error",
//       },
//       { status: 500 }
//     );

//   }
// }




import DatabaseConnection from "@/lib/mongodb";
import User from "../../../../backend/models/userModel.js";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest){

 try {

   await DatabaseConnection();


   const {name,email,password} = await req.json();


   const existingUser = await User.findOne({email});


   if(existingUser){

    return NextResponse.json(
      {message:"User already exists"},
      {status:400}
    );

   }


   const newUser = await User.create({
    name,
    email,
    password
   });


   return NextResponse.json(newUser,{status:201});


 } catch(error){

   console.log(error);

   return NextResponse.json(
    {message:"Server error"},
    {status:500}
   );

 }

}