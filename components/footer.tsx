import React from 'react'
import Container from "./container";
import FooterTop from './footerTop';
import Logo from './logo';
import SocialMedia from './socialMedia';
import { SubText, SubTitle } from './ui/text';
import Link from "next/link";
import { categoriesData, quickLinksData } from '@/constants/data';
import { Input } from './ui/input';
import { Button } from './ui/button';


const Footer = () => {
  return (
    <footer className='mb-10 border-t '>
     <Container>
       <FooterTop />
       <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"> 
        <div className="space-y-5"> 
          <Logo />
          <SubText >
            Discover curated furniture collections atShopcartyt, blending style and comfort to elevate your living spaces.
          </SubText>
          <SocialMedia  
          className="text-darkColor/60 "
          iconClassName="border-darkColor/60 hover:border-shop-light-green hover:text-shop-dark-green" 
          // tooltipClassName='bg-darkColor text-white'
          />
        </div>
        <div>
          <SubTitle>
            Quick Links
          </SubTitle>
          <ul className="space-y-3 mt-4">
            {quickLinksData?.map((item) => (
              <li key={item?.title}>
                <Link href={item?.href} className='hover:text-shop-light-green hoverEffect font-medium'>
                {item?.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <SubTitle>
            Categories
          </SubTitle>
          <ul className="space-y-3 mt-4">
            {categoriesData?.map((item) => (
              <li key={`/category/${item?.title}`}>
                <Link href={item?.href} className='hover:text-shop-light-green hoverEffect font-medium'>
                {item?.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-4"> 
          <SubTitle> News Letter </SubTitle>
          <SubText>
            Subscrib to our news letter to updates and excluse offers
          </SubText>
          <form className='space-y-3 '>
            <Input type="email" placeholder = 'Enter your Email' required />
            <Button className="w-full">Subscribe</Button>
          </form>
        </div>
       </div> 
       <div className="py-6 border-t text-center text-sm text-gray-600">
        <div>
          @ {new Date().getFullYear()}{" "}
          <Logo  className="text-sm" />
          . All right reserved.
        </div>
       </div>
     </Container>
    </footer>
  )
}

export default Footer
