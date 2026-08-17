" useClient "

// import { brands } from '@/seed/brands'
// import { categories } from '@/seed/categories'
// import React { useState } from 'react';
// import ImageUpLoader from './ImageUpLoader'
// import ProductForm from './ProductForm'
// import { useState } from 'react'

const UsersProductDashboard = () => {


  return (
    <>
      <div>
        {/* <ProductForm categories={categories} brands={brands} />
        <ImageUpLoader initialBrands={brands} /> */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        
                  {/* Total Product */}
                  <div className="min-h-20 min-w-0 border border-gray-200 bg-white">
                    <div className="flex items-center justify-start p-4 ">
                      <i className='bx bxs-shopping-bag-alt text-[20px] text-shop-light-green pr-2' ></i>
                      <h2 className="text-sm font-semibold text-gray-400">Total Product</h2>
                    </div>
                    <div className="flex py-2 px-4 justify-between">
                      <p className="text-sm font-semibold " >
                        4,300
                      </p>
                    </div>
                  </div>
        
                     {/* Total Stock */}
        
                  <div className="min-h-20 min-w-0 border border-gray-200 bg-white">
                    <div className="flex items-center justify-start p-4 ">
                      <i className='bx bxs-bolt-circle pr-2 text-[20px] text-shop-light-green'></i>
                      <h2 className="text-sm font-semibold text-gray-400">Total Orders</h2>
                    </div>
                    <div className="flex py-2 px-4 justify-between">
                         
                      <div className="text-right">
                        <p className="text-sm font-semibold " >
                          18,600
                        </p>
                      </div>
                    </div>
                  </div>
        
                  {/* Total Sold */}
        
                  <div className="min-h-20 min-w-0 border border-gray-200 bg-white">
                    <div className="flex items-center justify-start p-4 ">
                      <i className='bx bx-dollar rounded-sm text-[9px] bg-shop-light-green p-1 mr-2 text-sm text-white' ></i>
                      <h2 className="text-sm font-semibold text-gray-400">Total Sold</h2>
                    </div>
                    <div className="flex py-2 px-4 justify-between">
                      <div className="text-right">
                        <p className="text-sm font-semibold " >
                         12,760
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Total Categories */}

                  <div className="min-h-20 min-w-0 border border-gray-200 bg-white">
                    <div className="flex items-center justify-start p-4 ">
                      <i className='bx bx-category-alt rounded-sm bg-shop-light-green text-[9px] mr-2 p-1 text-sm text-white' ></i>
                      <h2 className="text-sm font-semibold text-gray-400">Total Categories</h2>
                    </div>
                    <div className="flex py-2 px-4 justify-between">
                      <div className="text-right">
                        <p className="text-sm font-semibold " >
                         12,760
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                




      </div>
    </>
  )
}



export default UsersProductDashboard

