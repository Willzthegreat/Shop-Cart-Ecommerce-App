import { Toaster } from "react-hot-toast";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;

}>) {
  return <div className="min-h-full">
    {children}
    <Toaster 
      position="bottom-right"
      toastOptions={{
        style: {
          background: " #000000",
          color: " #fff",
        },
      }}
    />
  </div>;
}
