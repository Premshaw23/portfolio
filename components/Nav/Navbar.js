"use client";

import { useState, useEffect } from "react";
import { Menu, X, UserCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Bt1 from "../buttonUi/Button";
import Links from "./Navlinks";
import { ModeToggle } from "../theme-btn";
import LoadingBar from "react-top-loading-bar";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setProgress(20);

    setTimeout(() => {
      setProgress(40);
    }, 200);

    setTimeout(() => {
      setProgress(100);
    }, 600);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => {
      setProgress(0);
    }, 50);
  }, []);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Projects", href: "/project" },
    { name: "Skills", href: "/skills" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Blog", href: "/blogs" },
  ];

  return (
    <nav className="fixed top-0 left-0 z-50 w-full backdrop-blur-md shadow-md">
      <LoadingBar
        color="#933ce6"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={"/"}>
            <div className="flex items-center gap-5">
              <div className="relative w-10 h-10">
                {/* Glow Background */}
                <div className="absolute -inset-1 rounded-full bg-purple-500 opacity-40 blur-sm animate-pulse z-0" />

                {/* Logo with border */}
                <div className="relative w-full h-full rounded-full overflow-hidden shadow-xl ring-2 ring-white/20 z-10">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    placeholder="blur"
                    blurDataURL="/logo.png"
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
              </div>

              <p className="text-2xl text-gray-100 font-bold tracking-wide">
                Portfolio
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <Links className="hidden md:flex" />

          {/* Right Controls */}
          <div className="flex items-center space-x-4 text-white">
            <ModeToggle />
            {!user ? (
              <Link href="/login">
                <Bt1 name="Login" />
              </Link>
            ) : (
              <div className="relative group">
                {!user.photoURL && (
                  <UserCircle2
                    className="text-white bg-blue-500 rounded-full"
                    size={50}
                  />
                )}{" "}
                {user.photoURL && (
                  <Image
                    src={user.photoURL || "/photo1.png"}
                    alt="Profile"
                    width={70}
                    height={70}
                    className="rounded-full border-2 border-white cursor-pointer size-11 object-cover"
                    onClick={() => router.push("/admin")}
                  />
                )}
                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 z-50">
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => router.push("/admin")}
                  >
                    Admin
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                    onClick={() => {
                      // Call Firebase logout
                      import("firebase/auth").then(({ getAuth, signOut }) => {
                        const auth = getAuth();
                        signOut(auth);
                        router.push("/login");
                      });
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
            <div className="md:hidden">
              <button onClick={() => setIsOpen(!isOpen)} className="p-1">
                {isOpen ? (
                  <X size={24} className="text-white" />
                ) : (
                  <Menu size={24} className="text-white" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden md:hidden ${
            isOpen ? "max-h-96 py-3" : "max-h-0"
          }`}
        >
          <div className="flex flex-col space-y-3">
            {navItems.map(({ name, href }) => (
              <Link
                key={name}
                href={href}
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-pink-400 transition px-2"
              >
                {name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
