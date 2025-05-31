// app/admin/page.js
"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { UserCircle2 } from "lucide-react";

export default function Admin() {
  const { user } = useAuth();
  console.log(user?.reloadUserInfo?.providerUserInfo[0]?.email);
  return (
    <ProtectedRoute>
      <div className="min-h-[91.5vh] flex flex-col items-center justify-center px-4">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
          <UserCircle2 className="mx-auto text-blue-500 mb-4" size={64} />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Welcome, Admin!
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
