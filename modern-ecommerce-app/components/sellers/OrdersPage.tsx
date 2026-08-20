"use client";

import { useMemo, useState } from "react";

type SellerOrder = {
  _id: string;
  customerName: string;
  email: string;
  totalPrice: number;
  currency: string;
  status: string;
  orderDate: string | Date;
  itemCount: number;
};

const statusClasses: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700",
  processing: "bg-blue-50 text-blue-700",
  paid: "bg-emerald-50 text-emerald-700",
  shipped: "bg-indigo-50 text-indigo-700",
  out_for_delivery: "bg-purple-50 text-purple-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
};

const OrdersPage = ({ orders }: { orders: SellerOrder[] }) => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesSearch =
        !query ||
        order.customerName.toLowerCase().includes(query) ||
        order.email.toLowerCase().includes(query) ||
        order._id.toLowerCase().includes(query);
      return matchesSearch && (status === "all" || order.status === status);
    });
  }, [orders, search, status]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Orders</h2>
          <p className="mt-1 text-sm text-gray-500">Track orders containing your products.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search orders..."
            className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-shop-dark-green"
          />
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-shop-dark-green"
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="paid">Paid</option>
            <option value="shipped">Shipped</option>
            <option value="out_for_delivery">Out for delivery</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-500">
            {orders.length === 0 ? "No orders found for your products." : "No orders match your filters."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-5 py-3">Order</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Items</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="text-gray-700">
                    <td className="whitespace-nowrap px-5 py-4 font-medium text-gray-900">#{order._id.slice(-8).toUpperCase()}</td>
                    <td className="px-5 py-4">
                      <div className="font-medium text-gray-900">{order.customerName || "Customer"}</div>
                      <div className="text-xs text-gray-500">{order.email}</div>
                    </td>
                    <td className="px-5 py-4">{order.itemCount}</td>
                    <td className="whitespace-nowrap px-5 py-4">{order.currency} {order.totalPrice.toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses[order.status] || "bg-gray-100 text-gray-700"}`}>
                        {order.status.replaceAll("_", " ")}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-gray-500">{new Date(order.orderDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default OrdersPage;
