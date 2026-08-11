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
      <div className="flex w-full flex-wrap items-center justify-between gap-3 sm:gap-5">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 text-sm font-semibold sm:gap-3">
          {productType?.map((item) => (
            <button
              key={item.title}
              className={`whitespace-nowrap rounded-full border border-shop-light-green px-3 py-1.5 text-xs hover:bg-shop-light-green hover:border-shop-light-green hover:text-white hoverEffect sm:px-4 sm:text-sm md:px-6 md:py-2 ${selectedTab === item?.title ? "bg-shop-light-green text-white border-shop-light-green" : "bg-shopp-light-green/20"}`} 
              onClick={() => onTabSelect(item?.title)} 
            >
              {item.title}
            </button>
          ))}
        </div>
        <Link href={"/shop"} className="shrink-0 whitespace-nowrap rounded-full border border-shop-light-green px-3 py-1.5 text-xs hover:bg-shop-light-green hover:border-shop-light-green hover:text-white hoverEffect sm:px-4 sm:text-sm md:px-6 md:py-2">See all</Link>
      </div>
    </>
  )
}

export default HomeTabBar
