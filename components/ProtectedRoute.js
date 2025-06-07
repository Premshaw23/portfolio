// components/ProtectedRoute.js
"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";

const ADMIN_UID = process.env.NEXT_PUBLIC_ADMIN_UID;
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [reloading, setReloading] = useState(false);

  // Reload user on route change for freshest info
  useEffect(() => {
    const reloadUser = async () => {
      if (user && typeof user.reload === "function") {
        setReloading(true);
        await user.reload();
        setReloading(false);
      }
    };
    reloadUser();
  }, [pathname]);

  useEffect(() => {
    if (loading || reloading) return;

    // Not logged in → go to login
    if (!user) {
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
  }, [user, loading, reloading, pathname, router, adminOnly]);

  if (loading || reloading || !user) {
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
