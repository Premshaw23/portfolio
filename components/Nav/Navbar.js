"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X, UserCircle2, Sun, Moon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import LoadingBar from "react-top-loading-bar";
import { motion, AnimatePresence } from "framer-motion";

import { useAuth } from "@/context/AuthContext";
import { ModeToggle } from "../theme-btn";

const ADMIN_UID = process.env.NEXT_PUBLIC_ADMIN_UID;
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export default function PremiumNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [emailVerified, setEmailVerified] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
  ];

  const isAdmin =
    user && (user.uid === ADMIN_UID || user.email === ADMIN_EMAIL);

  const handleAdminAccess = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    const { getAuth, signOut } = await import("firebase/auth");
    const auth = getAuth();
    await signOut(auth);
    router.push("/login");
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 dark:bg-slate-950/10 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 shadow-lg shadow-gray-200/50 dark:shadow-purple-500/10"
            : "bg-white/50 dark:bg-transparent backdrop-blur-sm"
        }`}
      >
        <LoadingBar
          color="#933ce6"
          progress={progress}
          onLoaderFinished={() => setProgress(0)}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div whileHover={{ scale: 1.05 }} className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur-md opacity-75 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-10 h-10 rounded-lg overflow-hidden shadow-xl ring-2 ring-white/20">
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
              </motion.div>
              <div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  itsprem
                </span>
                <span className="text-purple-600 dark:text-purple-400">
                  .dev
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative px-4 py-2 rounded-lg text-sm font-medium transition-colors group"
                >
                  <span
                    className={`relative z-10 ${
                      pathname === item.href
                        ? "text-purple-600 dark:text-white"
                        : "text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    }`}
                  >
                    {item.name}
                  </span>
                  {pathname === item.href && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 dark:from-purple-600/20 dark:to-pink-600/20 rounded-lg border border-purple-500/30"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2 md:gap-4">
              <ModeToggle />

              {!user ? (
                <Link href="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="hidden md:block px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                  >
                    Login / Signup
                  </motion.button>
                </Link>
              ) : (
                <div
                  className="relative flex-shrink-0 z-[60]"
                  ref={dropdownRef}
                >
                  {user.photoURL ? (
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <Image
                        src={user.photoURL}
                        alt="Profile"
                        width={44}
                        height={44}
                        className="w-11 h-11 rounded-full border-2 border-purple-400 dark:border-purple-600 object-cover cursor-pointer hover:shadow-lg hover:shadow-purple-500/50 transition"
                        onClick={handleAdminAccess}
                      />
                    </motion.div>
                  ) : (
                    <UserCircle2
                      className="w-10 h-10 p-1 text-purple-600 bg-purple-100 dark:bg-purple-600/20 rounded-full cursor-pointer hover:scale-105 transition"
                      onClick={handleAdminAccess}
                    />
                  )}

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-[60]"
                      >
                        {isAdmin && (
                          <button
                            className={`cursor-pointer w-full rounded-t-lg text-left px-4 py-2 text-gray-900 dark:text-white ${
                              emailVerified
                                ? "hover:bg-gray-100 dark:hover:bg-gray-700"
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
                          className={`cursor-pointer w-full text-left px-4 py-2 text-gray-900 dark:text-white ${
                            emailVerified
                              ? "hover:bg-gray-100 dark:hover:bg-gray-700"
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
                              ? "Verify your email to access Dashboard"
                              : ""
                          }
                        >
                          Dashboard
                        </button>
                        <button
                          className="cursor-pointer rounded-b-lg w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={handleLogout}
                        >
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="md:hidden p-1 text-gray-900 dark:text-white"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.button>
            </div>
          </div>

          {/* Mobile Nav */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden pb-4 backdrop-blur-4xl"
              >
                <div className="flex flex-col space-y-2">
                  {navItems.map(({ name, href }, index) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={href}
                        onClick={() => setIsOpen(false)}
                        className={`block px-4 py-2 rounded-lg transition ${
                          pathname === href
                            ? "bg-gradient-to-r from-purple-600/10 to-pink-600/10 text-purple-600 dark:text-purple-400"
                            : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                      >
                        {name}
                      </Link>
                    </motion.div>
                  ))}

                  {user && (
                    <>
                      <Link
                        href="/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                      >
                        Dashboard
                      </Link>
                      {isAdmin && (
                        <button
                          onClick={() => {
                            if (emailVerified) {
                              setIsOpen(false);
                              router.push("/admin");
                            }
                          }}
                          className={`w-full text-left px-4 py-2 rounded-lg ${
                            emailVerified
                              ? "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                              : "text-gray-400 cursor-not-allowed"
                          }`}
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
                        onClick={() => {
                          setIsOpen(false);
                          handleLogout();
                        }}
                        className="text-left text-xl font-bold px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                      >
                        Logout
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>
    </>
  );
}
