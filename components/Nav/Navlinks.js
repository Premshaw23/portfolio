"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import clsx from "clsx";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/skills", label: "Skills" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/blogs", label: "Blog" },
];

export default function Links({ className = "" }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, emailVerified } = useAuth();

  const isVerifyPage = pathname === "/verify-email";
  const isAdminRoute = pathname.startsWith("/admin");
  const isDashboardRoute = pathname.startsWith("/dashboard");

  useEffect(() => {
    if (
      !loading &&
      user &&
      !emailVerified &&
      !isVerifyPage &&
      !isAdminRoute &&
      !isDashboardRoute
    ) {
      router.push("/verify-email");
    }
  }, [
    user,
    emailVerified,
    loading,
    isVerifyPage,
    isAdminRoute,
    isDashboardRoute,
    router,
  ]);

  return (
    <nav
      className={clsx(
        "flex flex-wrap items-center gap-4 md:gap-6 text-sm font-medium transition-all",
        className,
        isVerifyPage && "pointer-events-none opacity-50"
      )}
    >
      {navLinks.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={clsx(
            "text-gray-600 dark:text-gray-300 hover:text-green-500 transition-colors duration-200",
            pathname === href &&
              "dark:text-green-500 text-lg text-green-500 font-bold underline underline-offset-4"
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
