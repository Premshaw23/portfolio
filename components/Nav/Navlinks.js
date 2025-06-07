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
  const { user, emailVerified } = useAuth();

  const isVerifyPage = pathname === "/verify-email";

  useEffect(() => {
    const shouldRedirect =
      user && !emailVerified && pathname !== "/verify-email";
    if (shouldRedirect) {
      router.push("/verify-email");
    }
  }, [user, emailVerified, pathname, router]);
  

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
              "dark:text-green-600 text-lg text-green-600 font-bold"
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
