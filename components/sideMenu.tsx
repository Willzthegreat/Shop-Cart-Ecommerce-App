import React from 'react'
import Logo from './logo';
import { X } from 'lucide-react';
import { headerData } from '@/constants/data';
import Link from 'next/link';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}


const SideMenu: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      <div className={`fixed top-0 inset-y-0 left-0 h-screen w-full bg-black/50 shadow-xl transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} hoverEffect z-50`}>
        <div className="min-w-72 max-w-96 bg-black h-screen p-10 border-r border-r-shop-light-green flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <Logo className=" text-white " spanDesign="hover:text-white" />
            <button onClick={onClose} className="absolute top-5 right-5 text-white hover:text-shop-light-green">
              <X />
            </button>
          </div>
          <div >
            {headerData?.map((item) => (
              <Link href={item?.href} key={item?.title} className="text-white hover:text-shop-light-green hoverEffect">
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default SideMenu
