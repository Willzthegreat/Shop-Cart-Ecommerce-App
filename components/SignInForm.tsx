// // "use client";

// // import { useState } from "react";
// // import Logo from "./logo";
// // import axios from "axios";
// // import { Eye, EyeOff } from "lucide-react";
// // import { useRouter } from "next/navigation";

// // export default function SignInForm() {

// //   const router = useRouter();

// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [showPassword, setShowPassword] = useState(false);


// //   const handleSubmit = async (e:any) => {
// //     e.preventDefault();

// //     try {

// //       const response = await axios.post(
// //         "http://localhost:5000/api/login",
// //         {
// //           email,
// //           password,
// //         }
// //       );

// //       console.log("Login success:", response.data);

// //       const token = response.data.token;
// //       localStorage.setItem("token", token);
// //       close();
// //       router.push("/dashboard"); // ✅ NOW WORKS

// //     } catch (error:any) {
// //       console.log(error.response?.data?.message);
// //     }
// //   };


// //   return (
// //     <div>

// //       <h2 className="text-xl font-bold flex mb-6">
// //         Welcome Back To <Logo className="px-2 text-md" />
// //       </h2>

// //       <form onSubmit={handleSubmit}>

// //         <input
// //           className="border p-2 w-full mt-3"
// //           placeholder="Email"
// //           onChange={(e)=>setEmail(e.target.value)}
// //         />

// //         <div className="relative mt-3">

// //           <input
// //             className="border p-2 pr-10 w-full"
// //             placeholder="Password"
// //             type={showPassword ? "text" : "password"}
// //             value={password}
// //             onChange={(e)=>setPassword(e.target.value)}
// //           />

// //           <button
// //             type="button"
// //             onClick={() => setShowPassword(!showPassword)}
// //             className="absolute right-3 top-2"
// //           >
// //             {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
// //           </button>

// //         </div>

// //         <button type="submit" className="mt-4 bg-shop-dark-green text-white px-4 py-2 rounded">
// //           Sign In
// //         </button>

// //       </form>

// //     </div>
// //   );
// // }


// "use client";

// import { useState } from "react";
// import Logo from "./logo";
// import axios from "axios";
// import { Eye, EyeOff } from "lucide-react";
// import { useRouter } from "next/navigation";


// interface Props {
//   close: () => void;
// }


// export default function SignInForm({close}: Props) {


//   const router = useRouter();


//   const [email,setEmail] = useState("");
//   const [password,setPassword] = useState("");

//   const [showPassword,setShowPassword] = useState(false);



//   const handleSubmit = async (e:any) => {
//   e.preventDefault();

//   console.log("LOGIN STARTED");
//   try {
//     const response = await axios.post(
//       "/api/login",
//       {
//         email,
//         password,
//       }
//     );
//     console.log("LOGIN RESPONSE:", response.data);
//     const token = response.data.token;
//     if (!token) {
//       console.log("NO TOKEN RECEIVED");
//       return;
//     }
//     localStorage.setItem("token", token);
//     console.log("TOKEN SAVED");
//     close();
//     router.replace("/dashboard");
//   } catch(error:any) {
//     console.log(
//       "LOGIN ERROR:",
//       error.response?.data || error.message
//     );
//   }
// };





// return (

// <div>
//   <h2 className="text-xl font-bold flex mb-6">
//     Welcome Back To
//     <Logo className="px-2 text-md"/>
//   </h2>

//   <form onSubmit={handleSubmit}>
//   <input
//   className="border p-2 w-full mt-3"
//   placeholder="Email"
//   value={email}
//   onChange={(e)=>setEmail(e.target.value)}
//   />
//   <div className="relative mt-3">
//   <input
//   className="border p-2 pr-10 w-full"
//   placeholder="Password"
//   type={
//   showPassword
//   ?
//   "text"
//   :
//   "password"
//   }
//   value={password}
//   onChange={(e)=>setPassword(e.target.value)}
// />
//   <button
//   type="button"
//   onClick={()=>setShowPassword(!showPassword)}
//   className="absolute right-3 top-2"
//   >

//   {showPassword
//   ?
//   <EyeOff size={20}/>
//   :
//   <Eye size={20}/>
//   }
//   </button>
// </div>





// <button

// type="submit"

// className="
// mt-4 
// bg-shop-dark-green 
// text-white 
// px-4 
// py-2 
// rounded
// "

// >

// Sign In

// </button>



// </form>


// </div>


// );


// }







"use client";

import { useState } from "react";
import Logo from "./logo";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";


interface Props {
  close: () => void;
}


export default function SignInForm({ close }: Props) {


  const router = useRouter();


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);



  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();


    console.log("LOGIN STARTED");


    try {


      const response = await axios.post(
        "/api/login",
        {
          email,
          password,
        }
      );


      console.log(
        "LOGIN RESPONSE:",
        response.data
      );



      // Save logged in user
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      window.dispatchEvent(
        new Event("userChanged")
      );

      console.log("USER SAVED");



      // Close popup
      close();



      // Redirect
      router.replace("/dashboard");



    } catch (error:any) {


      console.log(
        "LOGIN ERROR:",
        error.response?.data || error.message
      );


    }

  };




  return (

    <div>


      <h2 className="text-xl font-bold flex mb-6">

        Welcome Back To

        <Logo className="px-2 text-md"/>

      </h2>




      <form onSubmit={handleSubmit}>


        <input

          className="border p-2 w-full mt-3"

          placeholder="Email"

          type="email"

          value={email}

          onChange={(e)=>setEmail(e.target.value)}

        />





        <div className="relative mt-3">


          <input
            className="border p-2 pr-10 w-full"
            placeholder="Password"
            type={
              showPassword
              ?
              "text"
              :
              "password"
            }
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(!showPassword)
            }
            className="absolute right-3 top-2"
          >
            {
              showPassword
              ?
              <EyeOff size={20}/>
              :
              <Eye size={20}/>
            }
          </button>
        </div>
        <button
          type="submit"
          className="
          mt-4
          bg-shop-dark-green
          text-white
          px-4
          py-2
          rounded
          ">
          Sign In
        </button>
      </form>
    </div>
  );
}