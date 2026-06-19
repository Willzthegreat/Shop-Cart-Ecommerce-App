// "use client";

// import React, { useState } from "react";

// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";

// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Link } from "lucide-react";


// interface SignUpForm {
//   name: string;
//   email: string;
//   password: string;
// }


// const SignUp = () => {
//   const [formData, setFormData] = useState<SignUpForm>({
//     name: "",
//     email: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (
//     e: React.FormEvent<HTMLFormElement>
//   ) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");

//     try {
//       const res = await fetch(
//         "http://localhost:5000/api/users/register",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(formData),
//         }
//       );
//       const data = await res.json();
//       if(!res.ok){
//         throw new Error(
//           data.message || "Registration failed"
//         );
//       }

//       console.log(data);
//       setMessage("Account created successfully");


//       setFormData({
//         name:"",
//         email:"",
//         password:"",
//       });

//     } catch(error:any){
//       setMessage(error.message);
//       console.log(error);
//     }
//     finally{
//       setLoading(false);
//     }
//   };



//   return (
//     <div className="flex min-h-screen items-center justify-center bg-muted">
//       <Card className="w-full max-w-lg">
//         <CardHeader>
//           <CardTitle>
//             Create Account
//           </CardTitle>
//           <CardDescription>
//             Sign up to start shopping 
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div className="space-y-2">
//               <label htmlFor="name" className="text-sm font-medium">
//                 Name
//               </label>
//               <Input
//                 id="name"
//                 type="text"
//                 name="name"
//                 placeholder="John Doe"
//                 value={formData.name}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="space-y-2">
//               <label
//                 htmlFor="email"
//                 className="text-sm font-medium"
//               >
//                 Email
//               </label>
//               <Input
//                 id="email"
//                 type="email"
//                 name="email"
//                 placeholder="example@gmail.com"
//                 value={formData.email}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="space-y-2">
//               <label
//                 htmlFor="password"
//                 className="text-sm font-medium"
//               >
//                 Password
//               </label>
//               <Input
//                 id="password"
//                 type="password"
//                 name="password"
//                 placeholder="******"
//                 value={formData.password}
//                 onChange={handleChange}
//               />
//             </div>
//             {
//               message && (
//                 <p className="text-sm">
//                   {message}
//                 </p>
//               )
//             }
//             <Button
//               type="submit"
//               className="w-full"
//               disabled={loading}
//             >
//               {loading ? "Creating account..." : "Sign Up"
//               }
//             </Button>
//           </form>
//         </CardContent>
//         <div>
//           <p className="text-[10px] text-center ">I already have an account? 
//             <a href="/modern-ecommerce-app/app/signIn" className="px-2">
//               Sigin
//             </a>
//           </p>
//         </div>
//       </Card>
//     </div>
//   );
// };


// export default SignUp;