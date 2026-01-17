"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FolderKanban,
  LogOut,
  Code2,
  Menu,
  X,
  MessageSquare,
  User,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/confirmModal";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { href: "/admin/blogs", label: "Blogs", icon: <FileText size={18} /> },
  {
    href: "/admin/projects",
    label: "Projects",
    icon: <FolderKanban size={18} />,
  },
  { href: "/admin/skills", label: "Skills", icon: <Code2 size={18} /> },
  { href: "/admin/comments", label: "Comments", icon: <MessageSquare size={18} /> },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Successfully logged out");
    } catch {
      toast.error("Logout failed");
    }
    setModalOpen(false);
  };

  // Close mobile nav on path change
  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  return (
    <ProtectedRoute adminOnly={true}>
      <ConfirmModal
        open={modalOpen}
        onConfirm={handleLogout}
        onCancel={() => setModalOpen(false)}
        title="Confirm Logout"
        description="Are you sure you want to end your administrative session?"
      />

      <div className="flex min-h-screen bg-slate-50 dark:bg-[#020617]">
        {/* Sidebar Background Overlay for Mobile */}
        <AnimatePresence>
          {mobileNavOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileNavOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-0 left-0 h-screen z-50 w-72 
          bg-white dark:bg-[#0f172a]/60 backdrop-blur-xl border-r border-gray-200 dark:border-white/5 
          transition-transform duration-500 ease-in-out flex flex-col
          ${mobileNavOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 overflow-hidden`}
        >
          {/* Sidebar Header */}
          <div className="p-8 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Code2 className="text-white" size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tighter text-gray-900 dark:text-white leading-none">
                  Admin<span className="text-indigo-500">Suite</span>
                </span>
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-400 mt-1">Management Tool</span>
              </div>
            </Link>
            <button 
              onClick={() => setMobileNavOpen(false)}
              className="lg:hidden p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-500"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
            <div className="px-4 mb-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">Core Navigation</span>
            </div>
            {navLinks.map(({ href, label, icon }) => {
              const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={`group flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 ${
                    isActive
                      ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3 font-bold text-sm">
                    <span className={isActive ? "text-white" : "text-indigo-500"}>
                      {icon}
                    </span>
                    {label}
                  </div>
                  {isActive && (
                    <motion.div layoutId="active-nav-glow" className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />
                  )}
                  {!isActive && (
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 mt-auto">
            <div className="p-4 rounded-3xl bg-gray-100 dark:bg-white/5 border border-transparent dark:border-white/5">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative shrink-0">
                  <div className="absolute inset-0 bg-indigo-500 rounded-xl blur-md opacity-20" />
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-white dark:border-white/10 shadow-sm">
                    {user?.photoURL ? (
                      <Image src={user.photoURL} alt="Admin" fill sizes="40px" className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-indigo-500 flex items-center justify-center text-white">
                        <User size={18} />
                      </div>
                    )}
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black dark:text-white truncate">
                    {user?.displayName || "Admin User"}
                  </p>
                  <p className="text-[10px] text-gray-400 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all duration-300 text-[10px] font-black uppercase tracking-widest"
              >
                <LogOut size={14} />
                Terminate Session
              </button>
            </div>
            <div className="mt-4 text-[9px] font-black uppercase tracking-widest text-center text-gray-400 dark:text-gray-500">
              &copy; {new Date().getFullYear()} IT PREM DEV
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile Top Bar */}
          <header className="lg:hidden sticky top-0 z-40 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 px-6 h-16 flex items-center justify-between">
            <button 
              onClick={() => setMobileNavOpen(true)}
              className="p-2 -ml-2 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
                <Code2 size={16} className="text-white" />
              </div>
              <span className="text-sm font-black dark:text-white">AdminPanel</span>
            </div>
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-gray-100 dark:border-white/10">
              {user?.photoURL ? (
                <Image src={user.photoURL} alt="Admin" width={32} height={32} />
              ) : (
                <div className="w-full h-full bg-indigo-500" />
              )}
            </div>
          </header>

          <main className="flex-1 p-6 lg:p-12">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-7xl mx-auto"
            >
               {children}
            </motion.div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
