import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Nav/Navbar";
import Footer from "@/components/footer";
import Loader from "@/components/Loader";
import { LoaderProvider } from "@/context/LoaderContext";
import { ThemeProvider } from "@/components/theme-provider";
import ToastWrapper from "@/components/ToastWrapper";
import { AuthProvider } from "@/context/AuthContext";

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
    <html lang="en" suppressHydrationWarning className="scroll-smooth scroll-p-20">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-b from-[#0c0f15] via-[#111139] to-[#0f0f1f] min-w-full min-h-[84vh]`}
      >
        <AuthProvider>

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LoaderProvider>
            <Loader />
            <Navbar />
            {children}
            <ToastWrapper />
            <Footer />
          </LoaderProvider>
        </ThemeProvider>
          </AuthProvider>
      </body>
    </html>
  );
}
