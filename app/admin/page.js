"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { UserCircle2 } from "lucide-react";
import Image from "next/image";

export default function Admin() {
  const { user, loading } = useAuth();

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  const displayName =
    user?.displayName || user?.email?.split("@")[0] || "Admin";
  const email = user?.email || "No email available";

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center rounded-3xl bg-gradient-to-tr from-gray-800 via-gray-700 to-gray-900 px-6 py-8 shadow-lg border border-gray-600">
      {/* Your content here */}
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md text-center border border-gray-200">
        {user?.photoURL ? (
          <Image
            src={user.photoURL}
            alt="Profile"
            width={80}
            height={80}
            className="rounded-full mx-auto object-cover mb-4 shadow"
          />
        ) : (
          <UserCircle2 className="text-blue-500 mx-auto mb-4" size={80} />
        )}

        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          Hello, {displayName}!
        </h2>

        <span className="text-xs text-white bg-blue-600 px-3 py-1 rounded-full uppercase tracking-wider font-semibold">
          Admin
        </span>

        <div className="mt-4">
          <p className="text-gray-500 text-sm">Logged in as:</p>
          <p className="text-blue-700 font-medium break-words mt-1">{email}</p>
        </div>

        <div className="mt-6">
          <p className="text-sm text-gray-500">
            You have full access to the admin panel.
          </p>
        </div>
      </div>
    </div>
  );
}
