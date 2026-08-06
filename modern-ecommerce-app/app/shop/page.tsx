import React from 'react'
import { Suspense } from 'react'
import { getAllBrands, getCategories } from '@/queries'
import Shop from '@/components/shop';





const ShopPage = async() => {
  const categories = await getCategories();
  const brands = await getAllBrands();
  return (
    <>
      <Suspense fallback={null}>
        <Shop categories={categories} brands={brands} />
      </Suspense>
    </>
  )
}

export default ShopPage
