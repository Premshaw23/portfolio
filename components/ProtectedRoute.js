// components/ProtectedRoute.js
"use client";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";

const ADMIN_UID = process.env.NEXT_PUBLIC_ADMIN_UID;
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    // Not logged in → go to login
    if (!user) {
      // console.log("loginerror1");
      router.push("/login");
      return;
    }

    // Not verified → force verify step
    if (!user.emailVerified && pathname !== "/verify-email") {
      router.push("/verify-email");
      return;
    }

    // Admin-only route → check if user is admin
    if (adminOnly) {
      const isAdmin = user.uid === ADMIN_UID || user.email === ADMIN_EMAIL;
      if (!isAdmin) {
        router.push("/not-authorized");
        return;
      }
    }
  }, [user, loading, pathname, router, adminOnly]);

  if (loading || !user) {
    return <div className="text-center mt-40">Loading...</div>;
  }

  // Prevent flicker during auth check
  if (!user.emailVerified && pathname !== "/verify-email") {
    return null;
  }

  if (adminOnly) {
    const isAdmin = user.uid === ADMIN_UID || user.email === ADMIN_EMAIL;
    if (!isAdmin) return null;
  }

  return children;
}
