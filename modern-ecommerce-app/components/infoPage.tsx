import Link from "next/link";
// import Logo from "./logo";

interface InfoPageProps {
  title: string;
  intro: string;
  children: React.ReactNode;
}

export default function InfoPage({ title, intro, children }: InfoPageProps) {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="border-b pb-8">
        <h1 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">{title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-gray-600 sm:text-lg">{intro}</p>
      </div>
      <div className="prose prose-gray mt-8 max-w-none">{children}</div>
      <Link href="/shop" className="mt-10 inline-block rounded bg-shop-dark-green px-5 py-3 font-semibold text-white transition hover:opacity-90">
        Browse products
      </Link>
    </main>
  );
}
