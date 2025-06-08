"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FolderKanban,
  LogOut,
  CodeIcon,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/confirmModal";

const navLinks = [
  { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { href: "/admin/blogs", label: "Blogs", icon: <FileText size={18} /> },
  {
    href: "/admin/projects",
    label: "Projects",
    icon: <FolderKanban size={18} />,
  },
  { href: "/admin/skills", label: "Skills", icon: <CodeIcon size={18} /> },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("You have been successfully logged out.");
    } catch {
      toast.error("Logout failed. Please try again.");
    }
    setModalOpen(false);
  };

  return (
    <ProtectedRoute adminOnly={true}>
      <ConfirmModal
        open={modalOpen}
        onConfirm={handleLogout}
        onCancel={() => setModalOpen(false)}
        title="Confirm Logout"
        description="Are you sure you want to log out?"
      />

      <div className="flex flex-col lg:flex-row min-h-screen ">
        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-0 left-0 h-screen overflow-y-auto z-40 w-64 
  dark:bg-black/30 bg-transparent md:bg-slate-600 backdrop-blur-md border-r border-white/10 
  text-white shadow-xl p-6 pt-20 transform 
  transition-transform duration-300 ease-in-out
  ${mobileNavOpen ? "translate-x-0" : "-translate-x-full"} 
  lg:translate-x-0`}
        >
          {/* Close Button (Mobile only) */}
          <div className="lg:hidden flex justify-end">
            <button onClick={() => setMobileNavOpen(false)}>
              <X size={24} className="text-white mb-4" />
            </button>
          </div>

          <div className="mb-10 hidden lg:block">
            <h2 className="text-2xl font-bold text-indigo-400">Admin Panel</h2>
          </div>

          <nav className="flex flex-col gap-3">
            {navLinks.map(({ href, label, icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all font-medium ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md"
                      : "hover:bg-white/10 text-gray-200"
                  }`}
                >
                  {icon}
                  <span className="text-sm">{label}</span>
                </Link>
              );
            })}
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-3 px-4 py-2 rounded-lg transition-all font-medium hover:bg-red-500/80 text-red-600 dark:text-red-300 hover:text-white mt-8"
            >
              <LogOut size={18} />
              <span className="text-sm">Logout</span>
            </button>
          </nav>

          <div className="mt-10 text-xs dark:text-gray-400 text-gray-200 hidden lg:block">
            &copy; {new Date().getFullYear()} Admin Panel
          </div>
        </aside>

        {/* Overlay */}
        {mobileNavOpen && (
          <div
            onClick={() => setMobileNavOpen(false)}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 mt-12">
          <div className="flex justify-between items-center mb-6 pt-8">
            <div className="flex items-center gap-3">
              {/* Menu Button beside "Admin Dashboard" (Mobile only) */}
              <button
                className="lg:hidden"
                onClick={() => setMobileNavOpen(true)}
              >
                <Menu size={24} className="dark:text-white" />
              </button>
              <h1 className="md:text-2xl text-lg font-bold text-gray-700 dark:text-gray-300">
                Admin Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {user?.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt="User Avatar"
                  width={36}
                  height={36}
                  className="rounded-full"
                />
              ) : (
                <div className="w-9 h-9 bg-gray-500 rounded-full" />
              )}
              <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                {user?.displayName || user?.email || "Admin"}
              </span>
            </div>
          </div>

          <div className="min-h-[65vh]">{children}</div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
