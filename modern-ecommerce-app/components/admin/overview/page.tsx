"use client";

import PriceView from "../amountCurrencies";

const Overview = ({
  totalSales,
  percentageChange,
  totalOrders,
  visitors,
  ordersPercentageChange,
  visitorsPercentageChange,
}: {
  totalSales: number;
  percentageChange: number;
  totalOrders: number;
  visitors: number;
  ordersPercentageChange: number;
  visitorsPercentageChange: number;
}) => {

  return (
    <div className="grid w-full min-w-0 grid-cols-1 gap-6 md:grid-cols-[minmax(0,3fr)_minmax(200px,1fr)]">
      {/* Left grid */}
      <div className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">

          {/* Total Cost */}
          <div className="min-h-20 min-w-0 border border-gray-200 bg-white">
            <div className="flex items-center justify-between p-4 ">
              <h2 className="text-sm font-semibold text-gray-400">Total Sales</h2>
              <PriceView
                amount={0}
                symbolOnly
                className="rounded-sm bg-shop-light-green px-2 pt-1 text-sm text-white"
              />
            </div>
            <div className="flex py-2 px-4 justify-between">
              <PriceView className="text-lg font-semibold text-gray-900" amount={totalSales} />
              <div className="text-right">
                <p
                  className={`text-sm font-semibold ${
                    percentageChange >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {percentageChange >= 0 ? "+" : ""}
                  {percentageChange.toFixed(1)}%
                </p>
                <p className="text-[9px] text-gray-500">
                  vs last week
                </p>
              </div>
            </div>
          </div>

             {/* Total Orders */}

          <div className="min-h-20 min-w-0 border border-gray-200 bg-white">
            <div className="flex items-center justify-between p-4 ">
              <h2 className="text-sm font-semibold text-gray-400">Total Orders</h2>
              <i className='bx bx-cart-add rounded-sm bg-shop-light-green px-2 py-1.5 text-sm text-white'></i>
            </div>
            <div className="flex py-2 px-4 justify-between">
                  {totalOrders.toLocaleString()}
              <div className="text-right">
                <p
                  className={`text-sm font-semibold ${
                    ordersPercentageChange >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {ordersPercentageChange >= 0 ? "+" : ""}
                  {ordersPercentageChange.toFixed(1)}%
                </p>
                <p className="text-[9px] text-gray-500">
                  vs last week
                </p>
              </div>
            </div>
          </div>

          {/* Total Visitors */}

          <div className="min-h-20 min-w-0 border border-gray-200 bg-white">
            <div className="flex items-center justify-between p-4 ">
              <h2 className="text-sm font-semibold text-gray-400">Total  Visitors</h2>
             
              <i className='bx bx-user-circle rounded-sm bg-shop-light-green px-2 py-1.5 text-sm text-white'></i>
            </div>
            <div className="flex py-2 px-4 justify-between">
              {/* <PriceView className="text-lg font-semibold text-gray-900" amount={totalSales} /> */}
                {visitors.toLocaleString()}
              <div className="text-right">
                <p
                  className={`text-sm font-semibold ${
                    visitorsPercentageChange >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {visitorsPercentageChange >= 0 ? "+" : ""}
                  {visitorsPercentageChange.toFixed(1)}%
                </p>
                <p className="text-[9px] text-gray-500">
                  vs last week
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue & Montly Target */}

        <div className="grid gap-3 md:grid-cols-[minmax(0,2fr)_minmax(200px,1fr)]">
          <div className="min-h-auto min-w-0 flex md:w-130  border border-gray-200 p-4 bg-white ">
            <h2 className="text-lg font-semibold text-gray-900">Store overview</h2>
            <p className="mt-2 text-sm text-gray-600">
              Your store performance summary will appear here.
            </p>
          </div>
          <div className="min-h-30 min-w-0 flex justify-end border border-gray-200 bg-white p-4 ">
            <h2 className="text-lg font-semibold text-gray-900">Store overview</h2>
            <p className="mt-2 text-sm text-gray-600">
              Your store performance summary will appear here.
            </p>
          </div>
        </div>

        {/* Section 3 */}
        
        <div>

        </div>
      </div>

      {/* Right grid */}
      <div className="space-y-3">
        <div className="min-h-64 min-w-0  border border-gray-200 bg-white p-6 ">
          <h2 className="text-lg font-semibold text-gray-900">Top Categories</h2>
          <p className="mt-2 text-sm text-gray-600">
            Add products, manage orders, and review customers from the sidebar.
          </p>
        </div>
        <div className="min-h-64 min-w-0 mt border border-gray-200 bg-white p-6 ">
          <h2 className="text-lg font-semibold text-gray-900">Traffic Source</h2>
        </div>

      </div>
    </div>
  );
};


export default Overview
