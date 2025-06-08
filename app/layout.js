import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Nav/Navbar";
import Loader from "@/components/Loader";
import { LoaderProvider } from "@/context/LoaderContext";
import { ThemeProvider } from "@/components/theme-provider";
import ToastWrapper from "@/components/ToastWrapper";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
      suppressHydrationWarning
      className="scroll-smooth scroll-p-20"
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-w-full min-h-[87vh] transition-colors duration-300 bg-white text-black dark:bg-gradient-to-b dark:from-[#0c0f15] dark:via-[#111139] dark:to-[#0f0f1f] dark:text-white`}
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
              <SpeedInsights/>
              <ToastWrapper />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  className:
                    "bg-white text-black dark:bg-gray-900 dark:text-white",
                }}
              />
            </LoaderProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
