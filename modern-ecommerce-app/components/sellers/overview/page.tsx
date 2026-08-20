"use client";

import { useState } from "react";
import PriceView from "../amountCurrencies";

const periods = [
  "Yesterday",
  "Last 7 Days",
  "Last 1 Month",
  "Last 3 Months",
  "Last 6 Months",
  "Last 1 Year",
];



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

  const [isOpen, setIsOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("Last 8 Days");



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
          <div className="min-h-auto min-w-0 md:w-130  border border-gray-200 p-4 bg-white ">
            <div className="flex justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Revenue Analytics</h2>
              <div>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsOpen((prev) => !prev)}
                    className="flex items-center gap-2 text-[10px] text-gray-600"
                  >
                    <span>{selectedPeriod}</span>

                    <i
                      className={`bx ${
                        isOpen ? "bx-chevron-up" : "bx-chevron-down"
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <ul className="absolute right-0 top-full z-50 mt-2 w-40 rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
                      {periods.map((period) => (
                        <li key={period}>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPeriod(period);
                              setIsOpen(false);
                            }}
                            className={`w-full rounded-md px-3 py-2 text-left text-[10px] hover:bg-gray-100 ${
                              selectedPeriod === period
                                ? "bg-gray-50 font-medium"
                                : ""
                            }`}
                          >
                            {period}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Your store performance summary will appear here.
            </p>
          </div>


          <div className="min-h-30 min-w-0  justify-end border border-gray-200 bg-white p-4 ">
            <h2 className="text-lg font-semibold text-gray-900">Monthly Target</h2>
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
