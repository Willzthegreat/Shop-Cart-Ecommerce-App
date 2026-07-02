import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className="font-poppins antialiased">
        <Navbar />
          <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}