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
        <p>Loading...</p>
      </div>
    );
  }

  let displayName = user?.email?.split("@")[0];

  try {
    displayName = user?.displayName ||"Admin";
  } catch (err) {
    console.error("Error computing display name:", err);
  }
  
  let email = "No email available";

  try {
    email = user?.email || "No email available";
  } catch (err) {
    console.error("Error getting user email:", err);
  }
  
  return (
    <ProtectedRoute adminOnly={true}>
      <div className="min-h-[91.5vh] flex items-center justify-center mt-10 px-4">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center border border-gray-200">
          {user?.photoURL ? (
            <Image
              src={user.photoURL}
              alt="Profile"
              width={80}
              height={80}
              className="rounded-full mx-auto object-cover mb-4 shadow"
            />
          ) : (
            <UserCircle2
              className="text-white bg-blue-500 rounded-full mx-auto mb-4"
              size={80}
            />
          )}

          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            Hello, {displayName}!
          </h2>

          <span className="text-xs text-white bg-blue-600 px-2 py-1 rounded-full uppercase tracking-wide font-medium">
            Admin
          </span>

          <div className="mt-4">
            <p className="text-gray-600 text-sm">Logged in as:</p>
            <p className="text-blue-600 font-medium break-words mt-1">
              {email}
            </p>
          </div>

          <div className="mt-6">
            <p className="text-sm text-gray-500">
              You have access to the admin panel.
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
