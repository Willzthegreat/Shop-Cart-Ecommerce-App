export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;

}>) {
  return <div className="min-h-full">{children}</div>;
}
