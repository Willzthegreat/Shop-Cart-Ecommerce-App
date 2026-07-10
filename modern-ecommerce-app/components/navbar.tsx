
// import React, { useState } from 'react'
// import Container from './container'
// import Logo from './logo'
// import HeaderMenu from './headerMenu'
// import SearchBar from './searchBar'
// import CartIcon from './cartIcon'
// import FavoriteButton from './favoriteButton'
// import SignIn from './signIn'
// import MobileMenu from './mobileMenu'
// import SignUp from './signUpModal'
// import Link from 'next/dist/client/link'
// import SignUpModal from './signUpModal'


// const Navbar = async() => {

  
  

//   return (
//     <>
//       <header className="bg-white py-5 border-b border-b-black/20">
//         <Container className='flex items-center justify-between text-lightColor'>
//           {/* Logo */}
//           <div className="w-auto md:flex md:gap-0 items-center justify-start gap-2.5 ">
//             <MobileMenu />
//             <Logo />
//           </div>
//           {/* NavButton */}
//           <HeaderMenu />
//           {/* NavAdmin */}
//           <div className="w-auto md:w-1 flex items-center justify-end gap-4">
//             <SearchBar />
//             <CartIcon />
//             <FavoriteButton />
//             <SignIn />
//             <Link href="/signUp" className='text-sm font-semibold text-light-Color hover:cursor-pointer hover:text-dark-color hoverEffect'>
//               SignUp
//             </Link>
//             {/* <button
//             onClick={()=>setOpenSignup(true)}
//             >
//             Sign Up
//             </button> */}
            
//           </div>
//         </Container>
//       </header>
//     </>
//   )
// }

// export default Navbar

import Container from "./container";
import Logo from "./logo";
import HeaderMenu from "./headerMenu";
import SearchBar from "./searchBar";
import CartIcon from "./cartIcon";
import FavoriteButton from "./favoriteButton";
import MobileMenu from "./mobileMenu";
import SignUpButton from "./SignUpButton";
import UserAvatar from "./userAvatar";


const Navbar = async () => {

  // You can fetch server data here
  // const user = await getUser();

  return (
    <header className="bg-white py-5 border-b border-b-black/20">
      <Container className="flex items-center justify-between text-lightColor">

        {/* Logo */}
        <div className="w-auto md:flex md:gap-0 items-center justify-start gap-2.5">
          <MobileMenu />
          <Logo />
        </div>


        {/* Menu */}
        <HeaderMenu />


        {/* Right side */}
        <div className="w-auto md:w-2 flex items-center justify-end gap-4">
          <SearchBar />
          <CartIcon />
          <FavoriteButton  />
          {/* User profile Avatar Icon & Log out link */}
        {/* 
          if(User){
           Console.log( "Stay Logged in")
          } else {
            Console.log(" ")
          } 
        */}

          <UserAvatar/>
          {/* <SignUpButton /> */}
        </div>

      </Container>
    </header>
  );
};


export default Navbar;