import React from 'react'
import Container from './container'
import Logo from './logo'
import HeaderMenu from './headerMenu'
import SearchBar from './searchBar'
import CartIcon from './cartIcon'
import FavoriteButton from './favoriteButton'
import SignIn from './signIn'
import MobileMenu from './mobileMenu'
import { currentUser } from '@clerk/nextjs/server'
import { ClerkLoaded, UserButton } from '@clerk/nextjs'
// import { ClerkLoaded, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";

const Navbar = async() => {

  const user = await currentUser();
  console.log(user, "user");
  return (
    <>
      <header className="bg-white py-5 border-b border-b-black/20">
        <Container className='flex items-center justify-between text-lightColor'>
          {/* Logo */}
          <div className="w-auto md:flex md:gap-0 items-center justify-start gap-2.5 ">
            <MobileMenu />
            <Logo />
          </div>
          {/* NavButton */}
          <HeaderMenu />
          {/* NavAdmin */}
          <div className="w-auto md:w-1 flex items-center justify-end gap-4">
            <SearchBar />
            <CartIcon />
            <FavoriteButton />
            <ClerkLoaded>
              <useAuth>
                <UserButton />
              </useAuth>
              {/* <SignIn /> */}
              { !user && <SignIn />}
            </ClerkLoaded>
          </div>
        </Container>
      </header>
    </>
  )
}

export default Navbar
