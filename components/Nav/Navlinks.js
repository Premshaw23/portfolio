"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Links({ className = "" }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, emailVerified } = useAuth();

  const isVerifyPage = pathname === "/verify-email";

  useEffect(() => {
    if (user && !emailVerified && !isVerifyPage) {
      router.push("/verify-email");
    }
  }, [emailVerified,router]);

  return (
    <div
      className={`space-x-6 md:flex ${className} ${
        isVerifyPage ? "pointer-events-none opacity-50" : ""
      }`}
    >
      <Link href="/" className="hover:text-green-200">
        Home
      </Link>
      <Link href="/projects" className="hover:text-green-200">
        Projects
      </Link>
      <Link href="/skills" className="hover:text-green-200">
        Skills
      </Link>
      <Link href="/about" className="hover:text-green-200">
        About
      </Link>
      <Link href="/contact" className="hover:text-green-200">
        Contact
      </Link>
      <Link href="/blogs" className="hover:text-green-200">
        Blog
      </Link>
    </div>
  );
}
