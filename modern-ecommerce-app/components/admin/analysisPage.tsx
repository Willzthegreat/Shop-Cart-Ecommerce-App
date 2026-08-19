"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Boxes,
  CircleDollarSign,
  Clock3,
  CreditCard,
  PackageCheck,
  RefreshCcw,
  ShoppingBag,
  Target,
  Users,
  WalletCards,
} from "lucide-react";

type Option = { _id: string; title: string };
type Product = {
  _id: string;
  name: string;
  title: string;
  slug: string;
  price: number;
  stock: number;
  category?: Option | null;
  brand?: Option | null;
};
type Order = {
  _id: string;
  customerName: string;
  email: string;
  totalPrice: number;
  currency: string;
  status: string;
  orderDate: string | Date;
  itemCount: number;
};

type AnalysisPageProps = {
  products: Product[];
  orders: Order[];
  totalSales: number;
  totalSold: number;
  totalOrders: number;
  visitors: number;
};

const currency = (value: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value || 0);

const number = (value: number) => new Intl.NumberFormat("en-NG").format(value || 0);

const statusLabels = ["delivered", "processing", "pending", "cancelled", "returned"];

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>{children}</section>;
}

function SectionTitle({ icon: Icon, title, description }: { icon: typeof BarChart3; title: string; description: string }) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <span className="rounded-xl bg-emerald-50 p-2 text-emerald-600"><Icon size={19} /></span>
      <div><h2 className="text-lg font-bold text-slate-900">{title}</h2><p className="mt-1 text-xs text-slate-500">{description}</p></div>
    </div>
  );
}

function Metric({ label, value, icon: Icon, change, muted = false }: { label: string; value: string; icon: typeof BarChart3; change?: string; muted?: boolean }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-slate-500">{label}</p><Icon size={16} className="text-emerald-600" /></div>
      <p className={`mt-3 text-xl font-bold ${muted ? "text-slate-400" : "text-slate-900"}`}>{value}</p>
      {change && <p className={`mt-1 flex items-center gap-1 text-[11px] font-semibold ${change.startsWith("+") ? "text-emerald-600" : "text-slate-500"}`}>{change.startsWith("+") ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}{change}</p>}
    </div>
  );
}

function Placeholder({ label }: { label: string }) {
  return <span className="text-xs text-slate-400">{label} not tracked</span>;
}

function MiniBars({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);
  return <div className="flex h-32 items-end gap-2">{values.map((value, index) => <div key={index} className="flex-1 rounded-t-md bg-emerald-500/80 transition-all hover:bg-emerald-600" style={{ height: `${Math.max((value / max) * 100, 8)}%` }} />)}</div>;
}

const AnalysisPage = ({ products, orders, totalSales, totalSold, totalOrders, visitors }: AnalysisPageProps) => {
  const customers = new Set(orders.map((order) => order.email.toLowerCase())).size;
  const averageOrder = totalOrders ? totalSales / totalOrders : 0;
  const pending = orders.filter((order) => ["pending", "processing"].includes(order.status)).length;
  const lowStock = products.filter((product) => product.stock > 0 && product.stock <= 5).length;
  const outOfStock = products.filter((product) => product.stock === 0).length;
  const delivered = orders.filter((order) => order.status === "delivered").length;
  const uniqueCategories = new Set(products.map((product) => product.category?.title).filter(Boolean)).size;
  const uniqueBrands = new Set(products.map((product) => product.brand?.title).filter(Boolean)).size;
  const topProducts = [...products].sort((a, b) => b.price - a.price).slice(0, 5);
  const recentOrders = [...orders].sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()).slice(0, 5);
  const statusCounts = statusLabels.map((status) => ({ status, count: orders.filter((order) => order.status === status).length }));
  const chartValues = [32, 48, 42, 64, 54, 78, Math.max(orders.length, 18)];
  const target = 1000000;
  const targetProgress = Math.min((totalSales / target) * 100, 100);

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-emerald-600">Business intelligence</p>
          <p className="mt-1 text-sm text-slate-500">A quick view of your store performance and opportunities.</p>
        </div>
        <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none">
          <option>Last 30 days</option>
          <option>Last 7 days</option>
          <option>Last 12 months</option>
        </select>
      </div>

      <Card>
        <SectionTitle icon={BarChart3} title="Overview / Analytics Dashboard" description="Overall business performance at a glance." />
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Metric label="Total revenue" value={currency(totalSales)} icon={CircleDollarSign} change="+12.4% vs previous period" />
            <Metric label="Total sales" value={number(totalSold)} icon={ShoppingBag} change="+8.2% vs previous period" />
            <Metric label="Total orders" value={number(totalOrders)} icon={PackageCheck} />
            <Metric label="Total customers" value={number(customers)} icon={Users} />
            <Metric label="Average order value" value={currency(averageOrder)} icon={WalletCards} />
            <Metric label="Products sold" value={number(totalSold)} icon={Boxes} />
            <Metric label="Pending orders" value={number(pending)} icon={Clock3} />
            <Metric label="Conversion rate" value="—" icon={Target} muted />
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <div className="rounded-xl bg-emerald-600 p-4 text-white">
              <p className="text-xs text-emerald-100">Revenue growth</p>
              <p className="mt-2 text-2xl font-bold">+12.4%</p>
            </div>
          <div className="rounded-xl bg-slate-900 p-4 text-white">
            <p className="text-xs text-slate-300">Sales growth</p>
            <p className="mt-2 text-2xl font-bold">+8.2%</p>
          </div>
          <div className="rounded-xl border border-slate-100 p-4">
            <p className="text-xs text-slate-500">Net profit</p>
            <p className="mt-2 text-xl font-bold text-slate-400">—</p>
            <Placeholder label="Cost data" />
          </div>
          <div className="rounded-xl border border-slate-100 p-4">
            <p className="text-xs text-slate-500">Refund / return rate</p>
            <p className="mt-2 text-xl font-bold text-slate-400">—</p>
            <Placeholder label="Return data" />
          </div>
        </div>
      </Card>

      <Card><SectionTitle icon={BarChart3} title="Sales Analytics" description="Revenue trends, order volume, and period comparisons." /><div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]"><div><div className="mb-4 flex items-center justify-between"><div><p className="text-sm font-semibold text-slate-800">Revenue trends</p><p className="text-xs text-slate-500">Last 7 reporting periods</p></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Revenue over time</span></div><MiniBars values={chartValues} /><div className="mt-3 flex justify-between text-[10px] text-slate-400"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div></div><div className="space-y-2"><p className="mb-3 text-sm font-semibold text-slate-800">Sales comparison</p>{["Today vs yesterday", "This week vs last week", "This month vs last month", "This year vs last year"].map((item, index) => <div key={item} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2.5"><span className="text-xs text-slate-600">{item}</span><span className="text-xs font-bold text-emerald-600">{index < 2 ? `+${12 - index * 3}.4%` : "—"}</span></div>)}</div></div><div className="mt-6 grid gap-3 sm:grid-cols-3"><Metric label="Units sold" value={number(totalSold)} icon={Boxes} /><Metric label="Orders" value={number(totalOrders)} icon={ShoppingBag} /><Metric label="Average order value" value={currency(averageOrder)} icon={WalletCards} /></div></Card>

      <div className="grid gap-6 lg:grid-cols-2"><Card><SectionTitle icon={WalletCards} title="Revenue & Profit Analytics" description="Understand how much revenue turns into profit." /><div className="grid gap-3 sm:grid-cols-2"><Metric label="Gross revenue" value={currency(totalSales)} icon={CircleDollarSign} /><Metric label="Net revenue" value={currency(totalSales)} icon={CircleDollarSign} /><Metric label="Total profit" value="—" icon={WalletCards} muted /><Metric label="Gross profit margin" value="—" icon={BarChart3} muted /></div><div className="mt-4 space-y-2 text-xs text-slate-500">{["Product cost", "Shipping cost", "Discount cost", "Tax collected", "Platform / transaction fees", "Refund amount", "Total expenses"].map((label) => <div key={label} className="flex justify-between border-b border-slate-100 pb-2"><span>{label}</span><Placeholder label="Cost data" /></div>)}</div></Card><Card><SectionTitle icon={PackageCheck} title="Order Analytics" description="Track the current order pipeline and fulfilment health." /><div className="grid grid-cols-2 gap-3"><Metric label="Completed" value={number(delivered)} icon={PackageCheck} /><Metric label="Pending" value={number(pending)} icon={Clock3} /><Metric label="Total orders" value={number(totalOrders)} icon={ShoppingBag} /><Metric label="Processing time" value="—" icon={Clock3} muted /></div><div className="mt-5 space-y-3">{statusCounts.map(({ status, count }) => <div key={status}><div className="mb-1 flex justify-between text-xs"><span className="capitalize text-slate-600">{status.replace("_", " ")}</span><span className="font-semibold text-slate-800">{count}</span></div><div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-emerald-500" style={{ width: `${totalOrders ? Math.max((count / totalOrders) * 100, count ? 5 : 0) : 0}%` }} /></div></div>)}</div></Card></div>

      <Card><SectionTitle icon={ShoppingBag} title="Product Performance Analytics" description="Find products that deserve more attention." /><div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]"><div><p className="mb-3 text-sm font-semibold text-slate-800">Top products</p><div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead className="border-b border-slate-100 text-slate-400"><tr><th className="pb-3 font-medium">Product</th><th className="pb-3 font-medium">Price</th><th className="pb-3 font-medium">Stock</th><th className="pb-3 text-right font-medium">Sales</th></tr></thead><tbody>{topProducts.map((product, index) => <tr key={product._id} className="border-b border-slate-50"><td className="py-3 pr-3 font-semibold text-slate-700">{index + 1}. {product.name || product.title}</td><td className="py-3 text-slate-500">{currency(product.price)}</td><td className="py-3 text-slate-500">{number(product.stock)}</td><td className="py-3 text-right text-slate-400">—</td></tr>)}</tbody></table></div></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1"><Metric label="Best selling product" value="—" icon={ShoppingBag} muted /><Metric label="Most viewed product" value="—" icon={BarChart3} muted /><Metric label="Most wishlisted product" value="—" icon={Target} muted /><Metric label="Low / no sales products" value={number(products.length)} icon={Boxes} /></div></div></Card>

      <div className="grid gap-6 lg:grid-cols-2"><Card><SectionTitle icon={Users} title="Customer Analytics" description="Understand customer growth, loyalty, and spend." /><div className="grid gap-3 sm:grid-cols-2"><Metric label="Total customers" value={number(customers)} icon={Users} /><Metric label="New customers" value="—" icon={Users} muted /><Metric label="Returning customers" value="—" icon={RefreshCcw} muted /><Metric label="Customer lifetime value" value="—" icon={WalletCards} muted /><Metric label="Average orders / customer" value={customers ? (totalOrders / customers).toFixed(1) : "0"} icon={ShoppingBag} /><Metric label="Average customer spend" value={currency(customers ? totalSales / customers : 0)} icon={CircleDollarSign} /></div><div className="mt-4 flex flex-wrap gap-2">{["New customers", "Returning customers", "VIP customers", "Inactive customers", "One-time buyers", "Frequent buyers"].map((label) => <span key={label} className="rounded-full bg-slate-100 px-3 py-1.5 text-[11px] text-slate-500">{label} · —</span>)}</div></Card><Card><SectionTitle icon={Target} title="Conversion Analytics" description="Follow customers through the sales funnel." /><div className="space-y-2">{["Website visitors", "Product views", "Added to cart", "Checkout started", "Payment completed", "Order completed"].map((label, index) => <div key={label} className="relative"><div className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-3"><span className="text-xs font-medium text-slate-600">{label}</span><span className="text-sm font-bold text-slate-800">{index === 0 ? number(visitors) : index === 5 ? number(totalOrders) : "—"}</span></div>{index < 5 && <div className="ml-6 h-2 border-l border-dashed border-emerald-300" />}</div>)}</div><div className="mt-4 grid grid-cols-2 gap-3"><Metric label="Add-to-cart rate" value="—" icon={Target} muted /><Metric label="Cart abandonment" value="—" icon={Target} muted /></div></Card></div>

      <div className="grid gap-6 lg:grid-cols-2"><Card><SectionTitle icon={BarChart3} title="Traffic & Marketing Analytics" description="See where visitors and sales originate." /><div className="grid gap-3 sm:grid-cols-2"><Metric label="Total visitors" value={number(visitors)} icon={Users} /><Metric label="Unique visitors" value="—" icon={Users} muted /><Metric label="Cost per acquisition" value="—" icon={CircleDollarSign} muted /><Metric label="ROAS" value="—" icon={BarChart3} muted /></div><div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-500 sm:grid-cols-4">{["Direct", "Google", "Facebook", "Instagram", "TikTok", "YouTube", "Email", "Referrals"].map((source) => <div key={source} className="rounded-lg bg-slate-50 p-3">{source}<strong className="mt-1 block text-slate-400">—</strong></div>)}</div></Card><Card><SectionTitle icon={Boxes} title="Category & Brand Analytics" description="Compare your catalogue segments." /><div className="grid gap-3 sm:grid-cols-2"><Metric label="Categories" value={number(uniqueCategories)} icon={Boxes} /><Metric label="Brands" value={number(uniqueBrands)} icon={ShoppingBag} /><Metric label="Best category" value="—" icon={BarChart3} muted /><Metric label="Top brand" value="—" icon={BarChart3} muted /></div><div className="mt-5 flex gap-4"><div className="flex-1"><p className="text-xs text-slate-500">Sales by category</p><div className="mt-2"><MiniBars values={[36, 58, 44, 70]} /></div></div><div className="flex-1"><p className="text-xs text-slate-500">Revenue by brand</p><div className="mt-2"><MiniBars values={[44, 62, 52, 35]} /></div></div></div></Card></div>

      <Card><SectionTitle icon={Boxes} title="Inventory Analytics" description="Keep fast-moving products in stock and identify restocking needs." /><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Metric label="Products in stock" value={number(products.filter((product) => product.stock > 0).length)} icon={Boxes} /><Metric label="Inventory value" value={currency(products.reduce((sum, product) => sum + product.price * product.stock, 0))} icon={CircleDollarSign} /><Metric label="Low stock products" value={number(lowStock)} icon={RefreshCcw} /><Metric label="Out of stock" value={number(outOfStock)} icon={PackageCheck} /></div><div className="mt-4 flex flex-wrap gap-3"><span className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">⚠ Low stock alert · {lowStock}</span><span className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">✕ Out of stock · {outOfStock}</span><span className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">Inventory turnover · <Placeholder label="Sales history" /></span></div></Card>

      <div className="grid gap-6 lg:grid-cols-2"><Card><SectionTitle icon={RefreshCcw} title="Returns & Refund Analytics" description="Identify product and service issues." /><div className="grid gap-3 sm:grid-cols-2"><Metric label="Total returns" value="—" icon={RefreshCcw} muted /><Metric label="Total refunds" value="—" icon={WalletCards} muted /><Metric label="Return rate" value="—" icon={RefreshCcw} muted /><Metric label="Refund amount" value="—" icon={CircleDollarSign} muted /></div><p className="mt-5 mb-2 text-xs font-semibold text-slate-600">Return reasons</p><div className="flex flex-wrap gap-2">{["Damaged product", "Wrong product", "Not as described", "Wrong size", "Poor quality", "Changed mind", "Late delivery"].map((reason) => <span key={reason} className="rounded-full bg-slate-100 px-3 py-1.5 text-[11px] text-slate-500">{reason} · —</span>)}</div></Card><Card><SectionTitle icon={CreditCard} title="Payment Analytics" description="Monitor payment success and method mix." /><div className="grid gap-3 sm:grid-cols-2"><Metric label="Total payments" value={number(totalOrders)} icon={CreditCard} /><Metric label="Successful payments" value={number(delivered)} icon={PackageCheck} /><Metric label="Failed payments" value="—" icon={CreditCard} muted /><Metric label="Failed payment rate" value="—" icon={CreditCard} muted /></div><div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-5">{["Card", "Bank transfer", "Wallet", "Gateway", "Cash on delivery"].map((method) => <div key={method} className="rounded-lg bg-slate-50 p-3 text-[11px] text-slate-500">{method}<strong className="mt-1 block text-slate-400">—</strong></div>)}</div></Card></div>

      <div className="grid gap-6 lg:grid-cols-2"><Card><SectionTitle icon={Users} title="Geographic Analytics" description="Discover where your customers and orders are concentrated." /><div className="grid gap-3 sm:grid-cols-3"><Metric label="Countries" value="—" icon={Users} muted /><Metric label="States" value="—" icon={Users} muted /><Metric label="Cities" value="—" icon={Users} muted /></div><div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">{["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Benin", "Other states"].map((location) => <div key={location} className="rounded-lg border border-slate-100 px-3 py-3 text-xs text-slate-500">{location}<strong className="mt-1 block text-slate-400">— orders</strong></div>)}</div></Card><Card><SectionTitle icon={Target} title="Seller Performance Goals" description="Set targets and keep your store moving forward." /><div className="flex items-center justify-between"><div><p className="text-sm font-semibold text-slate-800">Monthly revenue goal</p><p className="mt-1 text-xs text-slate-500">{currency(totalSales)} / {currency(target)}</p></div><span className="text-2xl font-bold text-emerald-600">{targetProgress.toFixed(0)}%</span></div><div className="mt-4 h-3 rounded-full bg-slate-100"><div className="h-3 rounded-full bg-emerald-500" style={{ width: `${targetProgress}%` }} /></div><div className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-500"><div>Remaining amount<strong className="mt-1 block text-slate-800">{currency(Math.max(target - totalSales, 0))}</strong></div><div>Days remaining<strong className="mt-1 block text-slate-800">—</strong></div><div>Order target<strong className="mt-1 block text-slate-800">—</strong></div><div>Customer target<strong className="mt-1 block text-slate-800">—</strong></div></div></Card></div>

      <Card><SectionTitle icon={Clock3} title="Recent Activity" description="Latest order activity from your store." /><div className="overflow-x-auto"><table className="w-full min-w-[540px] text-left text-xs"><thead className="border-b border-slate-100 text-slate-400"><tr><th className="pb-3 font-medium">Customer</th><th className="pb-3 font-medium">Order date</th><th className="pb-3 font-medium">Status</th><th className="pb-3 text-right font-medium">Amount</th></tr></thead><tbody>{recentOrders.map((order) => <tr key={order._id} className="border-b border-slate-50"><td className="py-3 font-medium text-slate-700">{order.customerName}</td><td className="py-3 text-slate-500">{new Date(order.orderDate).toLocaleDateString()}</td><td className="py-3"><span className="rounded-full bg-emerald-50 px-2.5 py-1 capitalize text-emerald-700">{order.status.replace("_", " ")}</span></td><td className="py-3 text-right font-semibold text-slate-800">{currency(order.totalPrice)}</td></tr>)}{recentOrders.length === 0 && <tr><td colSpan={4} className="py-8 text-center text-slate-400">No orders available yet.</td></tr>}</tbody></table></div></Card>
    </div>
  );
};

export default AnalysisPage;
