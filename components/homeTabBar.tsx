import { productType } from '@/constants/data'
import Link  from 'next/link'
import React from 'react'

interface props {
  selectedTab: string;
  onTabSelect: (tab: string) => void;
}


const HomeTabBar = ({ selectedTab, onTabSelect }: props) => {

  console.log(selectedTab);

  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-5">
        <div className="flex gap-3 items-center text-sm font-semibold">
          {productType?.map((item) => (
            <button
              key={item.title}
              className={`px-4 py-1.5 md:px-6 md:py-2 rounded-full border border-shop-light-green hover:bg-shop-light-green hover:border-shop-light-green hover:text-white hoverEffect ${selectedTab === item?.title ? "bg-shop-light-green text-white border-shop-light-green" : "bg-shopp-light-green/20"}`} 
              onClick={() => onTabSelect(item?.title)} 
            >
              {item.title}
            </button>
          ))}
        </div>
        <Link href={"/shop"} className="px-4 py-1.5 md:px-6 md:py-2 rounded-full border border-shop-light-green hover:bg-shop-light-green hover:border-shop-light-green hover:text-white hoverEffect">See all</Link>
      </div>
    </>
  )
}

export default HomeTabBar
