import React from 'react'
import Container from './container'
import Logo from './logo'
import HeaderMenu from './headerMenu'
import SearchBar from './searchBar'
import CartIcon from './cartIcon'
import FavoriteButton from './favoriteButton'
import SignIn from './signIn'
import MobileMenu from './mobileMenu'


const Navbar = async() => {

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
            <SignIn />
          </div>
        </Container>
      </header>
    </>
  )
}

export default Navbar
