import { SignInButton } from '@clerk/nextjs'
import React from 'react'

const SignIn = () => {
  return (
    <>
    <SignInButton mode="modal">
      <button className='text-sm font-semibold text-light-Color hover:cursor-pointer hover:text-dark-color hoverEffect'>
        Login
      </button>
    </ SignInButton>
    </>
  )
}

export default SignIn
