import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Prem Shaw — Developer Portfolio",
  description:
    "Explore the portfolio of Prem Shaw, a front-end developer specializing in responsive design, clean code, and scalable architecture using React and Next.js.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className="bg-gradient-to-b from-black via-[#111132] to-[#0f0f1f] min-w-full min-h-full"
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-[90vh]`}
      >
        <Navbar />
        {children}
          <Footer />
      </body>
    </html>
  );
}
