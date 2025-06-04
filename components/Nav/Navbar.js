"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X, UserCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import LoadingBar from "react-top-loading-bar";

import Bt1 from "../buttonUi/Button";
import Links from "./Navlinks";
import { ModeToggle } from "../theme-btn";
import { useAuth } from "@/context/AuthContext";

const ADMIN_UID = process.env.NEXT_PUBLIC_ADMIN_UID;
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [emailVerified, setEmailVerified] = useState(false);

  useEffect(() => {
    const checkVerification = async () => {
      if (user) {
        await user.reload();
        setEmailVerified(user.emailVerified);
      }
    };
    checkVerification();
  }, [pathname, user]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Page change progress bar
  useEffect(() => {
    setProgress(20);
    const timeout1 = setTimeout(() => setProgress(60), 200);
    const timeout2 = setTimeout(() => setProgress(100), 600);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, [pathname]);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Projects", href: "/projects" },
    { name: "Skills", href: "/skills" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Blog", href: "/blogs" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  const isAdmin =
    user && (user.uid === ADMIN_UID || user.email === ADMIN_EMAIL);

  const handleAdminAccess = () => {
    setDropdownOpen((prev) => !prev);
    // if (emailVerified) {
    //   router.push("/dashboard");
    // } else {
    //   toast.warning("Please verify your email to access the admin panel.");
    //   router.push("/verify-email");
    // }
  };

  const handleLogout = async () => {
    const { getAuth, signOut } = await import("firebase/auth");
    const auth = getAuth();
    await signOut(auth);
    router.push("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md shadow-md">
      <LoadingBar
        color="#933ce6"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-5">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <div className="absolute -inset-1 rounded-full bg-purple-500 opacity-40 blur-sm animate-pulse z-0" />
              <div className="relative w-full h-full rounded-full overflow-hidden shadow-xl ring-2 ring-white/20 z-10">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="object-cover"
                  placeholder="blur"
                  blurDataURL="/logo.png"
                />
              </div>
            </div>
            <p className="text-2xl text-white font-bold tracking-wide">
              Portfolio
            </p>
          </Link>

          {/* Desktop Nav */}
          <Links className="hidden md:flex" />

          {/* Right Section */}
          <div className="flex items-center gap-2 md:gap-4 text-white">
            <ModeToggle />

            {!user ? (
              <Link href="/login">
                <Bt1 name="Login / Signup" />
              </Link>
            ) : (
              <div className="relative flex-shrink-0 z-[60]" ref={dropdownRef}>
                {user.photoURL ? (
                  <Image
                    src={user.photoURL || "/photo1.png"}
                    alt="Profile"
                    width={44}
                    height={44}
                    className="w-11 h-11 rounded-full border-2 border-amber-100 object-cover cursor-pointer hover:scale-105 transition"
                    onClick={handleAdminAccess}
                  />
                ) : (
                  <UserCircle2
                    className="w-10 h-10 p-1 bg-blue-500 rounded-full cursor-pointer"
                    onClick={handleAdminAccess}
                  />
                )}

                {/* Dropdown */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-lg shadow-lg z-[60]">
                    {isAdmin && (
                      <button
                        className={`cursor-pointer w-full rounded-lg text-left px-4 py-2 ${
                          emailVerified
                            ? "hover:bg-gray-200"
                            : "text-gray-400 cursor-not-allowed"
                        }`}
                        onClick={() => router.push("/admin")}
                        disabled={!emailVerified}
                        title={
                          !emailVerified
                            ? "Verify your email to access Admin"
                            : ""
                        }
                      >
                        Admin Panel
                      </button>
                    )}
                    <button
                      className={`cursor-pointer w-full rounded-lg text-left px-4 py-2 ${
                        emailVerified
                          ? "hover:bg-gray-200"
                          : "text-gray-400 cursor-not-allowed"
                      }`}
                      onClick={
                        emailVerified
                          ? () => router.push("/dashboard")
                          : undefined
                      }
                      disabled={!emailVerified}
                      title={
                        !emailVerified
                          ? "Verify your email to access Admin"
                          : ""
                      }
                    >
                      Dashboard
                    </button>

                    <button
                      className="cursor-pointer rounded-lg w-full text-left px-4 py-2 text-red-500 hover:bg-gray-200"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-1"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isOpen ? "max-h-96 py-3" : "max-h-0"
          }`}
        >
          <div className="flex flex-col space-y-3">
            {navItems.map(({ name, href }) => (
              <Link
                key={name}
                href={href}
                onClick={() => setIsOpen(false)}
                className="text-green-200 hover:text-pink-400 transition px-2"
              >
                {name}
              </Link>
            ))}

            {user && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="text-left text-red-400 hover:text-red-600 transition border border-gray-800 w-18 rounded-lg px-2"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
