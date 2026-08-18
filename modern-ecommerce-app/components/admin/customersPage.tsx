"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  ChevronDown,
  DollarSign,
  MapPin,
  MoreHorizontal,
  Repeat2,
  Search,
  ShoppingBag,
  UserPlus,
  Users,
} from "lucide-react";

type CustomerOrder = {
  _id: string;
  customerName: string;
  email: string;
  totalPrice: number;
  currency: string;
  status: string;
  orderDate: string | Date;
  itemCount: number;
  address?: {
    city?: string;
    state?: string;
  };
};

type Customer = {
  name: string;
  email: string;
  orders: number;
  spent: number;
  lastOrder: Date;
  firstOrder: Date;
  status: "VIP" | "Active" | "Inactive";
  city: string;
};

const cardClass = "rounded-2xl border border-slate-200 bg-white shadow-sm";
const dateFormatter = new Intl.DateTimeFormat("en-NG", {
  day: "numeric",
  month: "short",
  year: "numeric",
});
const moneyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

const formatDate = (date: Date) => dateFormatter.format(date);
const formatMoney = (amount: number) => moneyFormatter.format(amount || 0);

const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "CU";

const CustomersPage = ({ orders }: { orders: CustomerOrder[] }) => {
  const [search, setSearch] = useState("");
  const [segment, setSegment] = useState("All customers");

  const analytics = useMemo(() => {
    const customerMap = new Map<string, Customer>();
    const sortedOrders = [...orders].sort(
      (a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime(),
    );

    for (const order of orders) {
      const email = order.email?.toLowerCase() || order.customerName.toLowerCase();
      const orderDate = new Date(order.orderDate);
      const existing = customerMap.get(email);
      const city = order.address?.city || order.address?.state || "Unknown";

      if (!existing) {
        customerMap.set(email, {
          name: order.customerName || "Customer",
          email: order.email || "No email",
          orders: 1,
          spent: Number(order.totalPrice) || 0,
          lastOrder: orderDate,
          firstOrder: orderDate,
          status: "Active",
          city,
        });
      } else {
        existing.orders += 1;
        existing.spent += Number(order.totalPrice) || 0;
        if (orderDate > existing.lastOrder) existing.lastOrder = orderDate;
        if (orderDate < existing.firstOrder) existing.firstOrder = orderDate;
        if (existing.city === "Unknown" && city !== "Unknown") existing.city = city;
      }
    }

    const customers = Array.from(customerMap.values()).map((customer) => ({
      ...customer,
      status:
        customer.spent >= 250000
          ? "VIP"
          : customer.lastOrder >= daysAgo(90)
            ? "Active"
            : "Inactive",
    })) as Customer[];

    const totalSpent = customers.reduce((sum, customer) => sum + customer.spent, 0);
    const newCustomers = customers.filter((customer) => customer.firstOrder >= daysAgo(30)).length;
    const activeCustomers = customers.filter((customer) => customer.lastOrder >= daysAgo(90)).length;
    const returningCustomers = customers.filter((customer) => customer.orders > 1).length;
    const locationMap = new Map<string, number>();
    customers.forEach((customer) => locationMap.set(customer.city, (locationMap.get(customer.city) || 0) + 1));

    const monthLabels = Array.from({ length: 6 }, (_, index) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - index));
      return {
        label: date.toLocaleDateString("en-NG", { month: "short" }),
        month: date.getMonth(),
        year: date.getFullYear(),
      };
    });
    const growth = monthLabels.map((month) => ({
      ...month,
      value: customers.filter(
        (customer) =>
          customer.firstOrder.getMonth() === month.month &&
          customer.firstOrder.getFullYear() === month.year,
      ).length,
    }));

    const filteredCustomers = customers
      .filter((customer) => {
        const matchesSearch = `${customer.name} ${customer.email}`
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesSegment =
          segment === "All customers" ||
          (segment === "New" && customer.firstOrder >= daysAgo(30)) ||
          (segment === "VIP" && customer.status === "VIP") ||
          (segment === "High Spenders" && customer.spent >= 100000) ||
          (segment === "Frequent Buyers" && customer.orders > 1) ||
          (segment === "Inactive" && customer.status === "Inactive");
        return matchesSearch && matchesSegment;
      })
      .sort((a, b) => b.lastOrder.getTime() - a.lastOrder.getTime());

    return {
      customers,
      sortedOrders,
      filteredCustomers,
      totalSpent,
      newCustomers,
      activeCustomers,
      returningCustomers,
      growth,
      locations: Array.from(locationMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5),
    };
  }, [orders, search, segment]);

  const maxGrowth = Math.max(...analytics.growth.map((item) => item.value), 1);
  const averageLifetimeValue = analytics.customers.length
    ? analytics.totalSpent / analytics.customers.length
    : 0;
  const retention = analytics.customers.length
    ? Math.round((analytics.activeCustomers / analytics.customers.length) * 100)
    : 0;
  const newOrderCount = analytics.sortedOrders.filter(
    (order) => new Date(order.orderDate) >= daysAgo(30),
  ).length;
  const returningOrderCount = Math.max(analytics.sortedOrders.length - newOrderCount, 0);
  const maxLocation = Math.max(...analytics.locations.map(([, count]) => count), 1);

  const kpis = [
    { label: "Total Customers", value: analytics.customers.length, icon: Users, tone: "bg-emerald-50 text-emerald-700" },
    { label: "New Customers", value: analytics.newCustomers, icon: UserPlus, tone: "bg-blue-50 text-blue-700" },
    { label: "Active Customers", value: analytics.activeCustomers, icon: Activity, tone: "bg-violet-50 text-violet-700" },
    { label: "Returning Customers", value: analytics.returningCustomers, icon: Repeat2, tone: "bg-amber-50 text-amber-700" },
    { label: "Customer Lifetime Value", value: formatMoney(averageLifetimeValue), icon: DollarSign, tone: "bg-rose-50 text-rose-700" },
  ];

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-shop-dark-green">Customer intelligence</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">Customers</h2>
          <p className="mt-1 text-sm text-slate-500">Understand your customers and grow stronger relationships.</p>
        </div>
        <button className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
          Last 30 days <ChevronDown size={16} />
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {kpis.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className={`${cardClass} p-5`}>
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm text-slate-500">{label}</p>
              <span className={`rounded-lg p-2 ${tone}`}><Icon size={17} /></span>
            </div>
            <p className="mt-5 text-2xl font-bold text-slate-950">{value}</p>
            <p className="mt-2 flex items-center gap-1 text-xs font-medium text-emerald-600"><ArrowUpRight size={13} /> Based on available order data</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <section className={`${cardClass} p-5`}>
          <div className="flex items-start justify-between">
            <div><h3 className="font-semibold text-slate-950">Customer Growth</h3><p className="mt-1 text-sm text-slate-500">New customers by month</p></div>
            <span className="rounded-lg bg-emerald-50 p-2 text-emerald-700"><Users size={18} /></span>
          </div>
          <div className="mt-8 flex h-48 items-end gap-3 border-b border-l border-slate-100 px-2 sm:gap-6">
            {analytics.growth.map((item) => (
              <div key={`${item.month}-${item.year}`} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <span className="text-xs font-semibold text-slate-600">{item.value}</span>
                <div className="w-full max-w-10 rounded-t-md bg-shop-light-green transition-all" style={{ height: `${Math.max((item.value / maxGrowth) * 78, item.value ? 8 : 2)}%` }} />
                <span className="text-xs text-slate-500">{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={`${cardClass} p-5`}>
          <h3 className="font-semibold text-slate-950">Customer Analytics</h3>
          <p className="mt-1 text-sm text-slate-500">New vs returning customers</p>
          <div className="mt-7 flex items-center gap-7">
            <div className="relative flex h-36 w-36 shrink-0 items-center justify-center rounded-full" style={{ background: `conic-gradient(#16805b ${analytics.customers.length ? (analytics.returningCustomers / analytics.customers.length) * 100 : 0}%, #dbeafe 0)` }}>
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-center"><span className="text-2xl font-bold text-slate-950">{retention}%</span></div>
            </div>
            <div className="space-y-4 text-sm">
              <div><p className="flex items-center gap-2 text-slate-500"><span className="h-2.5 w-2.5 rounded-full bg-shop-dark-green" /> Returning</p><p className="mt-1 font-bold text-slate-950">{analytics.returningCustomers}</p></div>
              <div><p className="flex items-center gap-2 text-slate-500"><span className="h-2.5 w-2.5 rounded-full bg-blue-200" /> New</p><p className="mt-1 font-bold text-slate-950">{Math.max(analytics.customers.length - analytics.returningCustomers, 0)}</p></div>
            </div>
          </div>
          <div className="mt-7 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">Customer retention is <span className="font-semibold text-slate-950">{retention}%</span> based on customers active in the last 90 days.</div>
        </section>
      </div>

      <section className={`${cardClass} p-5`}>
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h3 className="font-semibold text-slate-950">Customer Segments</h3><p className="mt-1 text-sm text-slate-500">Target customers by their behavior.</p></div><button className="text-sm font-semibold text-shop-dark-green hover:underline">Manage segments</button></div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {["New", "VIP", "High Spenders", "Frequent Buyers", "Inactive"].map((name, index) => {
            const count = name === "New" ? analytics.newCustomers : name === "VIP" ? analytics.customers.filter((customer) => customer.status === "VIP").length : name === "High Spenders" ? analytics.customers.filter((customer) => customer.spent >= 100000).length : name === "Frequent Buyers" ? analytics.returningCustomers : analytics.customers.filter((customer) => customer.status === "Inactive").length;
            return <button key={name} onClick={() => setSegment(segment === name ? "All customers" : name)} className={`rounded-xl border p-4 text-left transition hover:border-shop-light-green ${segment === name ? "border-shop-dark-green bg-emerald-50" : "border-slate-200 bg-slate-50/60"}`}><span className={`mb-4 block h-2 w-2 rounded-full ${["bg-blue-500", "bg-amber-500", "bg-rose-500", "bg-violet-500", "bg-slate-400"][index]}`} /><p className="text-sm font-semibold text-slate-800">{name}</p><p className="mt-1 text-2xl font-bold text-slate-950">{count}</p><p className="mt-1 text-xs text-slate-500">customers</p></button>;
          })}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className={`${cardClass} p-5`}><div className="flex items-center justify-between"><div><h3 className="font-semibold text-slate-950">Recent Customers</h3><p className="mt-1 text-sm text-slate-500">Latest customer activity</p></div><Users size={18} className="text-slate-400" /></div><div className="mt-5 space-y-4">{analytics.filteredCustomers.slice(0, 4).map((customer) => <div key={customer.email} className="flex items-center justify-between gap-3"><div className="flex min-w-0 items-center gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800">{getInitials(customer.name)}</span><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-800">{customer.name}</p><p className="truncate text-xs text-slate-500">{customer.email}</p></div></div><span className="text-xs text-slate-500">{formatDate(customer.lastOrder)}</span></div>)}{analytics.customers.length === 0 && <p className="py-5 text-sm text-slate-500">No customer activity yet.</p>}</div></section>
        <section className={`${cardClass} p-5`}><div className="flex items-center justify-between"><div><h3 className="font-semibold text-slate-950">Recent Purchases</h3><p className="mt-1 text-sm text-slate-500">Latest orders from your customers</p></div><ShoppingBag size={18} className="text-slate-400" /></div><div className="mt-5 space-y-4">{analytics.sortedOrders.slice(0, 4).map((order) => <div key={order._id} className="flex items-center justify-between gap-3"><div className="flex min-w-0 items-center gap-3"><span className="rounded-lg bg-blue-50 p-2 text-blue-700"><ShoppingBag size={15} /></span><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-800">{order.customerName || "Customer"}</p><p className="text-xs capitalize text-slate-500">{order.status.replaceAll("_", " ")}</p></div></div><span className="text-sm font-semibold text-slate-900">{formatMoney(order.totalPrice)}</span></div>)}{analytics.sortedOrders.length === 0 && <p className="py-5 text-sm text-slate-500">No purchases yet.</p>}</div></section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.25fr]">
        <section className={`${cardClass} p-5`}><div className="flex items-center justify-between"><div><h3 className="font-semibold text-slate-950">Geographic Distribution</h3><p className="mt-1 text-sm text-slate-500">Where your customers are located</p></div><MapPin size={18} className="text-slate-400" /></div><div className="mt-6 space-y-4">{analytics.locations.map(([location, count]) => <div key={location}><div className="mb-2 flex justify-between text-sm"><span className="font-medium text-slate-700">{location}</span><span className="text-slate-500">{count} customers</span></div><div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-shop-light-green" style={{ width: `${(count / maxLocation) * 100}%` }} /></div></div>)}{analytics.locations.length === 0 && <p className="py-5 text-sm text-slate-500">Location data will appear after purchases.</p>}</div></section>
        <section className={`${cardClass} p-5`}><div className="flex items-center justify-between"><div><h3 className="font-semibold text-slate-950">Recent Signups</h3><p className="mt-1 text-sm text-slate-500">Customers who joined recently</p></div><UserPlus size={18} className="text-slate-400" /></div><div className="mt-5 grid gap-3 sm:grid-cols-2">{analytics.customers.slice().sort((a, b) => b.firstOrder.getTime() - a.firstOrder.getTime()).slice(0, 4).map((customer) => <div key={customer.email} className="rounded-xl bg-slate-50 p-4"><div className="flex items-center justify-between"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-bold text-shop-dark-green">{getInitials(customer.name)}</span><span className="text-xs text-slate-500">{formatDate(customer.firstOrder)}</span></div><p className="mt-3 truncate text-sm font-semibold text-slate-800">{customer.name}</p><p className="truncate text-xs text-slate-500">{customer.email}</p></div>)}{analytics.customers.length === 0 && <p className="py-5 text-sm text-slate-500">No signups yet.</p>}</div></section>
      </div>

      <section className={`${cardClass} overflow-hidden`}>
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center"><div><h3 className="font-semibold text-slate-950">All Customers</h3><p className="mt-1 text-sm text-slate-500">View and manage your customer relationships.</p></div><div className="relative w-full sm:w-64"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search customers..." className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-shop-dark-green" /></div></div>
        <div className="overflow-x-auto"><table className="w-full min-w-190 text-left"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3 font-semibold">Customer</th><th className="px-5 py-3 font-semibold">Orders</th><th className="px-5 py-3 font-semibold">Total Spent</th><th className="px-5 py-3 font-semibold">Last Order</th><th className="px-5 py-3 font-semibold">Status</th><th className="px-5 py-3 font-semibold">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{analytics.filteredCustomers.map((customer) => <tr key={customer.email} className="hover:bg-slate-50/70"><td className="px-5 py-4"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800">{getInitials(customer.name)}</span><div><p className="font-semibold text-slate-800">{customer.name}</p><p className="text-xs text-slate-500">{customer.email}</p></div></div></td><td className="px-5 py-4 text-sm text-slate-600">{customer.orders}</td><td className="px-5 py-4 text-sm font-semibold text-slate-800">{formatMoney(customer.spent)}</td><td className="px-5 py-4 text-sm text-slate-600">{formatDate(customer.lastOrder)}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${customer.status === "VIP" ? "bg-amber-50 text-amber-700" : customer.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{customer.status}</span></td><td className="px-5 py-4"><button aria-label={`Actions for ${customer.name}`} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><MoreHorizontal size={18} /></button></td></tr>)}</tbody></table>{analytics.filteredCustomers.length === 0 && <div className="p-10 text-center text-sm text-slate-500">No customers match your search or segment.</div>}</div>
        <div className="flex flex-col justify-between gap-2 border-t border-slate-200 px-5 py-4 text-sm text-slate-500 sm:flex-row"><span>Showing {analytics.filteredCustomers.length} of {analytics.customers.length} customers</span><span>{newOrderCount} recent orders · {returningOrderCount} other orders</span></div>
      </section>
    </div>
  );
};

export default CustomersPage;
