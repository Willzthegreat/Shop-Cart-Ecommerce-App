import React from 'react'
import Logo from './logo';
import { X } from 'lucide-react';
import { headerData } from '@/constants/data';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SocialMedia from './socialMedia';
import { useOutsideClick } from '@/hooks';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}


const SideMenu: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const sidebarRef = useOutsideClick<HTMLDivElement>(onClose) 

  return (
    <>
      <div className={`fixed top-0 inset-y-0 left-0 h-screen w-full bg-black/50 text-white/80 shadow-xl transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} hoverEffect z-50`}>
        <div ref={sidebarRef} className="min-w-72 max-w-96 bg-black h-screen p-10 border-r border-r-shop-light-green flex flex-col gap-6">
          <div className="flex items-center justify-between gap-5">
            <Logo className=" text-white " spanDesign="group-hover:text-white" />
            <button onClick={onClose} className=" hoverEffect hover:text-shop-light-green">
              <X />
            </button>
          </div>
          <div className='flex flex-col space-y-3.5 font-semibold tracking-wide'>
            {headerData?.map((item) => (
              <Link href={item?.href} key={item?.title} 
              className={`hoverEffect hover:text-shop-light-green ${pathname === item?.href && 'text-shop-light-green'}`}
              >
                {item.title}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <SocialMedia />
          </div>
        </div>
      </div>
    </>
  )
}

export default SideMenu;
