import React from 'react'
import Container from './container'
import Logo from './logo'
import HeaderMenu from './headerMenu'
import SearchBar from './searchBar'

const Navbar = () => {
  return (
    <>
      <header className="bg-white py-5 border-b border-b-black/20">
        <Container className='flex items-center justify-between'>
          {/* Logo */}
          <Logo  />
          {/* NavButton */}
          <HeaderMenu />
          {/* NavAdmin */}
          <div>
            <SearchBar />
          </div>
        </Container>
      </header>
    </>
  )
}

export default Navbar
