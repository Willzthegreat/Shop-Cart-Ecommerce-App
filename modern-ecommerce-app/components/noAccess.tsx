import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import Logo from './logo'
import SignInForm from './SignInForm';
import SignUpButton from './SignUpButton';

const NoAccess = ({
  details="Login in to view your cart items and checkout. Don't miss out on your favorite products."
}:{
  details?:string;
}) => {
  return (
    <>
      <div className="flex min-h-[60vh] items-center justify-center bg-gray-100 p-4 py-12 md:py-20">
        <Card className="w-full max-w-md">
          <CardHeader className="flex flex-col items-center gap-1 text-center">
            <Logo />
            <CardTitle className='text-2xl font-bold text-center '>
              Welcome Back
            </CardTitle>
          </CardHeader>
          <CardContent className="w-full">
            <p className="text-center font-medium text-darkColor/80">{details}</p>
            <div className="mx-auto mt-2 w-full max-w-sm">
              <SignInForm 
              close={() => {}} text={''} 
                className={'w-full'} />
            </div>
          </CardContent>
          <CardFooter className="flex w-full flex-col items-center space-y-2">
            <div className="text-sm text-muted-foreground text-center">
              Don&rsquo;t have an account?
            </div>
            <SignUpButton initialMode="signup" label="Sign Up" className={"w-full max-w-sm rounded-sm border border-shop-btn-dark-green py-2 hover:bg-shop-btn-dark-green hover:text-white"} />
          </CardFooter>
        </Card>
      </div>
    </>
  )
}

export default NoAccess
