// app/admin/page.js
"use client";
import { useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { UserCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Admin() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // useEffect(() => {
  //   if (loading) return; // Wait until loading is false

  //   if (!user) {
  //     console.log("No user, redirecting to login");
  //     router.push("/login");
  //   } else if (!user.emailVerified) {
  //     console.log("Email not verified, redirecting");
  //     router.push("/verify-email");
  //   }
  // }, [user, loading, router]);
  

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-[91.5vh] flex flex-col items-center justify-center px-4">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
          {!user.photoURL && (
            <UserCircle2
              className="text-white bg-blue-500 rounded-full mx-auto mb-4"
              size={64}
            />
          )}
          {user.photoURL && (
            <Image
              src={user.photoURL || "/photo1.png"}
              alt="Profile"
              width={70}
              height={70}
              className="rounded-full cursor-pointer size-16 mx-auto object-cover"
            />
          )}
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Welcome, User!
          </h2>
          <p className="text-gray-600 text-sm">You are logged in as:</p>
          <p className="text-blue-600 mt-2 font-medium">
            {user?.email || user?.reloadUserInfo?.providerUserInfo[0]?.email}
          </p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
