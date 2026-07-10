"use client";


import { AlignLeft } from 'lucide-react'
import React, { useState } from 'react'
import SideMenu from './sideMenu'

const MobileMenu = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <>
      <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <AlignLeft className="md:hidden hover:text-darkColor hover:cursor-pointer " />
      </button>
      <div className="md:hidden">
        <SideMenu 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        /> 
      </div>
    </>
  )
}

export default MobileMenu
