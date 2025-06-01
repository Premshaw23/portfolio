"use client";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return; // wait until auth loads

    if (!user) {
      router.push("/login");
      return;
    }

    // If email not verified and not already on verify-email page
    if (!user.emailVerified && pathname !== "/verify-email") {
      router.push("/verify-email");
    }

    // ✅ No need to delete user
  }, [user, loading, pathname, router]);

  // Show loading or null while we check auth
  if (loading || !user) {
    return <div className="text-center mt-40">Loading...</div>;
  }

  // Prevent flicker before redirect
  if (!user.emailVerified && pathname !== "/verify-email") {
    return null;
  }

  return children;
}
