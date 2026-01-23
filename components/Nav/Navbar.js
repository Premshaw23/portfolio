"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X, UserCircle2, Settings, LayoutDashboard, LogOut, ChevronRight, Home, Briefcase, Code, User, Mail, FileText } from "lucide-react";
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

const navItems = [
  { name: "Home", href: "/", icon: <Home size={18} /> },
  { name: "Projects", href: "/projects", icon: <Briefcase size={18} /> },
  { name: "Skills", href: "/skills", icon: <Code size={18} /> },
  { name: "About", href: "/about", icon: <User size={18} /> },
  { name: "Contact", href: "/contact", icon: <Mail size={18} /> },
  { name: "Blog", href: "/blogs", icon: <FileText size={18} /> },
];

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

  const isAdmin =
    user && (user.uid === ADMIN_UID || user.email === ADMIN_EMAIL);

  const handleLogout = async () => {
    const { getAuth, signOut } = await import("firebase/auth");
    const auth = getAuth();
    await signOut(auth);
    router.push("/login");
    setIsOpen(false);
  };

  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) return null;

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/80 dark:bg-slate-950/40 backdrop-blur-2xl border-b border-gray-200 dark:border-white/10 shadow-xl"
            : "bg-transparent backdrop-blur-0"
        }`}
      >
        <LoadingBar
          color="#933ce6"
          progress={progress}
          onLoaderFinished={() => setProgress(0)}
        />

        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }} 
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur-lg opacity-40 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-11 h-11 rounded-xl overflow-hidden shadow-2xl ring-2 ring-white/20">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={44}
                    height={44}
                    priority
                    className="object-cover"
                  />
                </div>
              </motion.div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tighter text-gray-900 dark:text-white leading-none">
                  itsprem<span className="text-purple-600 dark:text-purple-400">.dev</span>
                </span>
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-400 mt-1">Portfolio v2</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative px-5 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all group overflow-hidden"
                >
                  <span
                    className={`relative z-10 transition-colors duration-300 ${
                      pathname === item.href
                        ? "text-purple-600 dark:text-white"
                        : "text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    }`}
                  >
                    {item.name}
                  </span>
                  {pathname === item.href && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-purple-500/10 dark:bg-white/5 border border-purple-500/20 dark:border-white/10 rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              <ModeToggle />

              {!user ? (
                <Link href="/login" className="hidden md:block">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-7 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black text-xs uppercase tracking-widest rounded-xl hover:shadow-2xl hover:shadow-purple-500/20 transition-all border border-transparent dark:border-white/10"
                  >
                    Get Started
                  </motion.button>
                </Link>
              ) : (
                <div className="relative flex-shrink-0 z-[60]" ref={dropdownRef}>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="relative cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-purple-500 rounded-full blur-md opacity-20" />
                    <div className="relative w-11 h-11 rounded-full border-2 border-white dark:border-white/10 overflow-hidden shadow-xl ring-2 ring-purple-500/20">
                      {user.photoURL ? (
                        <Image
                          src={user.photoURL}
                          alt="Profile"
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-indigo-500 flex items-center justify-center text-white">
                          <UserCircle2 size={24} />
                        </div>
                      )}
                    </div>
                  </motion.div>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                        className="absolute right-0 mt-4 w-60 bg-white dark:bg-gray-950 border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
                      >
                        <div className="p-4 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Authenticated As</p>
                          <p className="text-sm font-bold truncate dark:text-white">{user.displayName || user.email}</p>
                        </div>
                        <div className="p-2">
                          {isAdmin && (
                            <button
                              onClick={() => {
                                router.push("/admin");
                                setDropdownOpen(false);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-indigo-500/10 text-indigo-500 dark:hover:bg-indigo-500/20 transition-all group"
                            >
                              <Settings size={18} className="group-hover:rotate-45 transition-transform" />
                              <span className="text-xs font-black uppercase tracking-widest">Admin Control</span>
                            </button>
                          )}
                          <button
                            onClick={() => {
                              router.push("/dashboard");
                              setDropdownOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 transition-all"
                          >
                            <LayoutDashboard size={18} />
                            <span className="text-xs font-black uppercase tracking-widest">Dashboard</span>
                          </button>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-500 transition-all mt-1"
                          >
                            <LogOut size={18} />
                            <span className="text-xs font-black uppercase tracking-widest">Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="lg:hidden p-2 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white shadow-sm border border-transparent dark:border-white/10"
                onClick={() => setIsOpen(!isOpen)}
              >
                <AnimatePresence mode="wait">
                  {isOpen ? <X key="x" size={24} /> : <Menu key="menu" size={24} />}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[49] lg:hidden"
          >
            <div className="absolute inset-0 bg-white/90 dark:bg-slate-950/90 backdrop-blur-2xl" />
            <div className="relative h-full flex flex-col items-center justify-center p-8">
              <div className="flex flex-col items-center gap-6 w-full max-w-sm">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="w-full"
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between w-full p-5 rounded-2xl transition-all border shadow-sm ${
                        pathname === item.href
                          ? "bg-indigo-600 text-white border-indigo-500 shadow-indigo-600/20"
                          : "bg-white dark:bg-white/5 text-gray-900 dark:text-white border-gray-100 dark:border-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className={pathname === item.href ? "text-white" : "text-indigo-500"}>
                          {item.icon}
                        </span>
                        <span className="text-sm font-black uppercase tracking-[0.2em]">{item.name}</span>
                      </div>
                      <ChevronRight size={18} className="opacity-30" />
                    </Link>
                  </motion.div>
                ))}

                {user && (
                   <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: navItems.length * 0.1 }}
                    className="w-full pt-6 mt-6 border-t border-gray-200 dark:border-white/10"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      {isAdmin && (
                        <button
                          onClick={() => { router.push("/admin"); setIsOpen(false); }}
                          className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20"
                        >
                          <Settings size={20} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Admin</span>
                        </button>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 col-span-1"
                      >
                        <LogOut size={20} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Logout</span>
                      </button>
                    </div>
                  </motion.div>
                )}

                {!user && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: navItems.length * 0.1 }}
                      className="w-full pt-6"
                    >
                      <Link href="/login" onClick={() => setIsOpen(false)} className="block w-full">
                        <button className="w-full py-5 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-600/20">
                          Sign In / Sign Up
                        </button>
                      </Link>
                    </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
