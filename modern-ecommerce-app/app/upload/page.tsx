import Link from "next/link";

export default function Upload() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Product uploads moved to the dashboard</h1>
      <p className="mt-2">Create products there so they are validated and saved directly to MongoDB.</p>
      <Link href="/dashboard" className="mt-5 inline-block rounded bg-green-700 p-3 text-white">Open dashboard</Link>
    </main>
  );
}
